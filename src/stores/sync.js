import  {useState, useEffect} from 'react';
import {getTimestamp, getRandomId} from 'utils'
/* sync store

 */

const filterObject = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(
  ([key, value]) => predicate(key, value)
))

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
    /* we don't remove items from storage here, since we couldn't track
      where the change would come from
    */
    setEntry(key, null)
  }
  return {setEntry, addEntry, removeEntry}
}

// TODO: caller id needs to be set to random value in order to show
// in changes values in chrome
export const useSyncItemsStore = (name) => {
  const [state, setState] = useState({})
  const [callerId] = useState(getRandomId())

  const [{setEntry, addEntry, removeEntry}, setOperators] = useState({setEntry: null, addEntry: null, removeEntry: null})
  useEffect(
    () => {
      setOperators(makeOperators(name, callerId, setState))
    }, [name, callerId, setState]
  )

  const prefix = `${name}-`
  console.log(`Setting storage for ${name} with ${callerId}`)

  function updateOnChange(changes) {

    console.log("CHANGES", changes)
    if (
      changes.callerId === undefined
        || !changes.callerId.newValue
    ) {console.log("No caller id"); return}

    const changedItems = []
    const removedItems = []
    for (const [key,value] of Object.entries(changes)) {
      if (! key.startsWith(prefix)) {continue}
      if (value.newValue === null) {
        removedItems.push(key)
      } else if (value.newValue === undefined) {
      } else {
        changedItems.push([key, value.newValue])
      }
    }

    /* remove deleted items from storage */
    if (removedItems.length > 0) {
      console.log("REMOVING from storage", removedItems)
      storage.remove(removedItems)
    }
    if (changedItems.length === 0) {console.log("no related change"); return}

    const [changesCallerId] = changes.callerId.newValue.split("-")
    if (changesCallerId === callerId) {console.log("SAME caller id"); return}
    setState(logCall("onChange", state => ({
      ...filterObject(state, (key, value) => (!removedItems.includes(key))),
      ...Object.fromEntries(changedItems)
    })))
  }

  /* load initial state and set listener*/
  useEffect(()=>{

    storage.onChanged.addListener(updateOnChange)

    storage.get(null,
      fullState => {
        setState(filterObject(fullState, (key, value) => key.startsWith(prefix)))
      }
    )
  }, [])

  return [state, setEntry, addEntry, removeEntry]
}

