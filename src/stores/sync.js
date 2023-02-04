import  {useState, useEffect, useMemo} from 'react';
import {storage} from './storage_adapter'
import {getTimestamp, getRandomId, makeLogger} from 'utils'


const makeOperators = (name, callerId, setState, log) => {
  const setValue = (value) => {
    log("Setting value", value)
    storage.set({
      [name]: value,
      callerId: `${callerId}-${getTimestamp()}`
    })
    setState(value)
  }

  const updateValue = (updateFn) => {
    storage.get(name, state => {
      const value = state[name]
      log("UPDATE", updateFn)
      const update = updateFn(value)
      log("updating value", value, "with", update)
      storage.set({
        [name]: {
          ...value,
          ...update
        },
        callerId: `${callerId}-${getTimestamp()}`
      })
      setState(value => ({...value, ...update}))
    })

  }
  return {setValue, updateValue}
}
export const useSyncStore = ({name, initValue}) => {

  const [state, setState] = useState({})
  const [callerId] = useState(getRandomId())
  const log = useMemo(
    () => makeLogger(`Store [${name}-${callerId}]`),
    [name, callerId]
  )
  const {setValue, updateValue} = useMemo(
    () => makeOperators(name, callerId, setState, log),
    [name, callerId, setState, log]
  )


  const updateOnChange = (changes) => {

    log("received changes", changes)
    if (
      changes.callerId === undefined
        || !changes.callerId.newValue
    ) {log("No caller id"); return}
    const [changesCallerId] = changes.callerId.newValue.split("-")
    if (changesCallerId === callerId) {log("SAME caller id"); return}

    for (const [key,value] of Object.entries(changes)) {
      if (! key === name) {continue}
      const newState = value.newValue
      log("Received new state", newState)
      setState(newState)
    }
  }

  /* load initial state and set listener*/
  useEffect(()=>{

    storage.onChanged.addListener(updateOnChange)

    storage.get(name,
      state => {
        const value = state[name]
        log("state", value)
        if (!value || Object.keys(value).length === 0) {
          const localValueStr = localStorage.getItem(name)
          if (localValueStr) {
            log("Loading state from local storage", localValueStr)
            const localValue = JSON.parse(localValueStr)
            log("setting PARSEDSettings ", localValue.state)
            setValue(localValue.state)
          } else {
            log("setting default value ", initValue)
            setValue(initValue)
          }
        } else {
          log("Loading existing state")
          setState(value)
        }
      }
    )
  }, [])
  return {value: state, setValue, updateValue}
}

export const useSyncValue = (name) => {
  const [state, setState] = useState({})
  const log = useMemo(
    () => makeLogger(`Value [${name}]`),
    [name]
  )

  const updateOnChange = (changes) => {

    log("received changes", changes)
    if (changes[name]) {
      if (changes[name].newValue) {
        log("Received new state", changes[name].newValue)
        setState(changes[name].newValue)
      }
    }
  }

  useEffect(()=>{
    storage.get(name, state => {
      if (state[name]) {setState(state[name])}
    })
    storage.onChanged.addListener(updateOnChange)
  }, [])
  return state
}
