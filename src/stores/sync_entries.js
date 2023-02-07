import  {useState, useEffect, useMemo} from 'react';
import {getTimestamp, getRandomId, makeLogger, filterObject, mapObject} from 'utils'
import {storage} from './storage_adapter'


const makeOperators = (name, setState, log) => {

  const prefix = `${name}-`
  const setEntry = (key, value) => {
    if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}
    log("SET", key, value)
    storage.set(
      {
        [key]: value,
      }
    )
    if (process.env.REACT_APP_USE_LOCALSTORAGE) {
      setState(state => (
        {
          ...state,
          [key]: value,
        }))
    }
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
  const log = useMemo(
    () => makeLogger(`Store [${name}]`),
    [name]
  )
  const {setEntry, addEntry, removeEntry} = useMemo(
    () => makeOperators(name, setState, log),
    [name, setState, log]
  )

  const prefix = `${name}-`
  log(`Setting storage for ${name}`)

  function updateOnChange(changes) {

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

    setState(state => ({
      ...filterObject(state, (key, value) => (!removedEntries.includes(key))),
      ...Object.fromEntries(changedEntries)
    }))
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

