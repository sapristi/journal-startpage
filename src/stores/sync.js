import  {useState, useEffect} from 'react';
import {getTimestamp, getRandomId} from 'utils'
/* sync store

 */

const filterObject = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(
  ([key, value])=> predicate(key, value)
))

const logCall = (name, callable) => {
  const inner = (...args) => {
    const res = callable(...args)
    console.log(args, "=>", res)
    return res
  }
  return inner
}

export const useSyncStore = (name) => {
  const [state, setState] = useState({})
  const [callerId] = useState(getRandomId())
  /* eslint-disable */
  const storage = browser.storage.sync
  /* eslint-enable */
  const prefix = `${name}-`
  console.log(`Setting storage for ${name} with ${callerId}`)

  function updateOnChange(changes) {

    if (changes.callerId.newValue === callerId) {console.log("SAME caller id"); return}
    const changedItems = []
    const removedItems = []
    for (const [key,value] of Object.entries(changes)) {
      if (! key.startsWith(prefix)) {continue}
      if (value.newValue) {
        if (value.newValue === null) {
          removedItems.push(key)
        } else {
          changedItems.push([key, value.newValue])
        }
      } else {
        // removedItems.append(key)
        // Do nothing here
      }
    }
    if (changedItems.length === 0 && removedItems.length === 0) {console.log("no related change"); return}

    setState(logCall("onChange", state => ({
      ...filterObject(state, (key, value) => (!removedItems.includes(key))),
      ...Object.fromEntries(changedItems)
    })))
  }

  /* load initial state and set listener*/
  useEffect(()=>{

    storage.onChanged.addListener(updateOnChange)

    const storageState = storage.get(null).then(
      fullState => {
        setState(filterObject(fullState, (key, value) => key.startsWith(prefix)))
      }
    )
  }, [])

  const setEntry = (key, value) => {
    if (! key.startsWith(prefix)) {throw new Error(`Key should start with ${prefix}`)}
    storage.set({[key]: value, callerId})
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
    /* we don't remove items from storage here, since we can't track
       where this comes from
     */
    setEntry(key, null)
  }


  return [state, setEntry, addEntry, removeEntry]
}

