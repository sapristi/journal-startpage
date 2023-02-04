import  {useState, useEffect} from 'react';
import {getTimestamp, getRandomId} from 'utils'
/* sync store

 */

const filterObject = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(
  ([key, value]) => predicate(key, value)
))

const mapObject = (obj, mapFn) => Object.fromEntries(Object.entries(obj).map(mapFn))

const logCall = (name, callable) => {
  const inner = (...args) => {
    const res = callable(...args)
    console.log(args, "=>", res)
    return res
  }
  return inner
}


const getStorage = () => {
  /* eslint-disable */
  if (navigator.userAgent.match(/chrome|chromium|crios/i)){
    return chrome.storage.sync
  } else if (navigator.userAgent.match(/firefox|fxios/i)){
    /* same interface for firefox than chrome */
    const get = (arg, callback) => {
      browser.storage.sync.get(arg).then(callback)
    }
    return {
      ...browser.storage.sync,
      get,
    }
  }
  /* eslint-enable */
}

const storage = getStorage()

const makeOperators = (name, callerId, setState) => {

  const prefix = `${name}-`
  const setEntry = (key, value) => {
    if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}
    console.log("SET", key, value)
    storage.set(
      {
        [key]: value,
        // add salt to caller id, otherwise chrome doesnt show the change
        callerId: `${callerId}-${getTimestamp()}`
      }
    )
    setState(state => (
      {
        ...state,
        [key]: value,
      }))
  }

  const addEntry = (value) => {
    const timestamp = getTimestamp()
    const key = `${prefix}${getTimestamp()}`
    setEntry(key, {
      ...value,
      date: timestamp
    })
  }
  const removeEntry = (key) => {
    if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}
    /* we don't remove entries from storage here, since we couldn't track
      where the change would come from
    */
    setEntry(key, null)
  }
  return {setEntry, addEntry, removeEntry}
}



export const useSyncEntriesStore = ({name, initData}) => {
  const [state, setState] = useState({})
  const [callerId] = useState(getRandomId())

  const [{setEntry, addEntry, removeEntry}] = useState(makeOperators(name, callerId, setState))

  const prefix = `${name}-`
  console.log(`Setting storage for ${name} with ${callerId}`)

  function updateOnChange(changes) {

    console.log("CHANGES", changes)
    if (
      changes.callerId === undefined
        || !changes.callerId.newValue
    ) {console.log("No caller id"); return}

    const changedEntries = []
    const removedEntries = []
    for (const [key,value] of Object.entries(changes)) {
      if (! key.startsWith(prefix)) {continue}
      if (value.newValue === null) {
        removedEntries.push(key)
      } else if (value.newValue === undefined) {
      } else {
        changedEntries.push([key, value.newValue])
      }
    }

    /* remove deleted entries from storage */
    if (removedEntries.length > 0) {
      console.log("REMOVING from storage", removedEntries)
      storage.remove(removedEntries)
    }
    if (changedEntries.length === 0) {console.log("no related change"); return}

    const [changesCallerId] = changes.callerId.newValue.split("-")
    if (changesCallerId === callerId) {console.log("SAME caller id"); return}
    setState(logCall("onChange", state => ({
      ...filterObject(state, (key, value) => (!removedEntries.includes(key))),
      ...Object.fromEntries(changedEntries)
    })))
  }

  /* load initial state and set listener*/
  useEffect(()=>{

    storage.onChanged.addListener(updateOnChange)

    storage.get(null,
      fullState => {
        const syncedObjects = filterObject(fullState, (key, value) => key.startsWith(prefix))
        console.log("SyncedObjects", syncedObjects)
        if (Object.keys(syncedObjects).length === 0) {
          const localEntriesStr = localStorage.getItem(name)
          if (localEntriesStr) {
            console.log("Loading state from local storage", localEntriesStr)
            const localEntries = JSON.parse(localEntriesStr)
            const entries = mapObject(localEntries.state.items, ([key, value]) => ([`${name}-${key}`, value]))
            setState(entries)
            Object.entries(entries).map(([key, value]) => setEntry(key,value))
          } else {
            console.log("Loading state from init data", initData)
            const entries = mapObject(initData, ([key, value]) => ([`${name}-${key}`, value]))
            setState(entries)
            Object.entries(entries).map(([key, value]) => setEntry(key,value))
          }
        } else {
          console.log("Loading existing state")
          setState(syncedObjects)
        }
      }
    )
  }, [])

  return {entries: state, setEntry, addEntry, removeEntry}
}

