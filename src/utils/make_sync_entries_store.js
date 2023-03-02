import  { useEffect, useReducer} from 'react';
import {getTimestamp, makeLogger, filterObject, mapObject} from 'utils'
import {storage} from 'utils/storage_adapter'


export const makeSyncEntriesStore = (name, initData) => {
  const prefix = `${name}-`
  const log = makeLogger(`Store [${name}]`)

  const checkKey = (key) => {if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}}
  const setEntry = (key, value) => {
    checkKey(key)
    log("SET", key, value)
    storage.set(
      {
        [key]: value,
      }
    )
  }

  const setEntries = (payload) => {
    Object.keys(payload).forEach(checkKey)
    storage.set(payload)
  }

  const addEntry = (value) => {
    const timestamp = getTimestamp()
    const key = `${prefix}${timestamp}`
    setEntry(key, {
      ...value,
      date: timestamp
    })
  }
  const removeEntry = (key) => {
    if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}
    storage.remove([key])
  }

  const reducer = (state, action) => {
    log("ACTION", state, action)
    switch (action.type) {
    case "initial":
      return action.payload
    case "updateOnChange":
      const {changedEntries, removedEntries} = action.payload
      return {
        ...filterObject(state, (key, value) => (!removedEntries.includes(key))),
        ...Object.fromEntries(changedEntries)
      }
    default:
      return state
    }
  }

  const makeUpdateOnChange = (dispatch) => (changes) => {

    const changedEntries = []
    const removedEntries = []
    for (const [key,value] of Object.entries(changes)) {
      if (! key.startsWith(prefix)) {continue}
      if (value.newValue === null || value.newValue === undefined) {
        removedEntries.push(key)
      } else {
        changedEntries.push([key, value.newValue])
      }
    }

    /* remove deleted entries from storage */
    if (changedEntries.length === 0 && removedEntries.length ===0) {
      log("no related change"); return}

    log("CHANGES", changes)
    dispatch({
      type: "updateOnChange",
      payload: {changedEntries, removedEntries}
    })
  }

  // Initial state
  storage.get(
    null,
    fullState => {
      const syncedObjects = filterObject(fullState, (key, value) => key.startsWith(prefix))
      log("SyncedObjects", syncedObjects)
      if (Object.keys(syncedObjects).length === 0) {
        log("Setting state from init data", initData)
        const entries = mapObject(initData, ([key, value]) => ([`${name}-${key}`, value]))
        setEntries(entries)
      }
    }
  )


  const useStore = () => {
    const [entries, dispatch] = useReducer(reducer, {})

    useEffect(
      () => {
        storage.get(
          null,
          fullState => {
            const syncedObjects = filterObject(fullState, (key, value) => key.startsWith(prefix))
            log("Loaded initial state", syncedObjects)
            dispatch({type: "initial", payload: syncedObjects})
          })
      }, []
    )
    useEffect(
      ()=>{
        const updateOnChange = makeUpdateOnChange(dispatch)
        storage.onChanged.addListener(updateOnChange)
        return () => {
          storage.onChanged.removeListener(updateOnChange)
        }
      },[dispatch]
    )
    return {entries}
  }
  return {
    useStore,
    setEntry,
    addEntry,
    removeEntry
  }
}


