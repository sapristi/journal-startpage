import  {useState, useEffect, useMemo} from 'react';
import {getTimestamp, getRandomId, makeLogger} from 'utils'
import {storage} from './storage_adapter'
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



const makeOperators = (name, callerId, setState, log) => {

  const prefix = `${name}-`
  const setEntry = (key, value) => {
    if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}
    log("SET", key, value)
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
  const log = useMemo(
    () => makeLogger(`Store [${name}-${callerId}]`),
    [name, callerId]
  )
  const {setEntry, addEntry, removeEntry} = useMemo(
    () => makeOperators(name, callerId, setState, log),
    [name, callerId, setState, log]
  )

  const prefix = `${name}-`
  log(`Setting storage for ${name} with ${callerId}`)

  function updateOnChange(changes) {

    log("CHANGES", changes)
    if (
      changes.callerId === undefined
        || !changes.callerId.newValue
    ) {log("No caller id"); return}

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
      log("REMOVING from storage", removedEntries)
      storage.remove(removedEntries)
    }
    if (changedEntries.length === 0 && removedEntries.length ===0) {
      log("no related change"); return}

    const [changesCallerId] = changes.callerId.newValue.split("-")
    if (changesCallerId === callerId) {log("SAME caller id"); return}
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
        log("SyncedObjects", syncedObjects)
        if (Object.keys(syncedObjects).length === 0) {
          // TODO: remove loading from localEntries once a few versions have passed
          const localEntriesStr = localStorage.getItem(name)
          if (localEntriesStr) {
            log("Loading state from local storage", localEntriesStr)
            const localEntries = JSON.parse(localEntriesStr)
            const entries = mapObject(localEntries.state.items, ([key, value]) => ([`${name}-${key}`, value]))
            setState(entries)
            Object.entries(entries).map(([key, value]) => setEntry(key,value))
          } else {
            log("Loading state from init data", initData)
            const entries = mapObject(initData, ([key, value]) => ([`${name}-${key}`, value]))
            setState(entries)
            Object.entries(entries).map(([key, value]) => setEntry(key,value))
          }
        } else {
          log("Loading existing state")
          setState(syncedObjects)
        }
      }
    )
  }, [])

  return {entries: state, setEntry, addEntry, removeEntry}
}

