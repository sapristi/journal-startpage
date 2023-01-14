import { getTimestamp } from '../utils'
import produce from "immer"

const clone = (entries) => {
  if (!entries) {return entries}
  return entries.map(e => ({...e}))
}


const mergeSortedArrays = (arr1_, arr2_) => {
  const arr1 = [...arr1_]
  const arr2 = [...arr2_]
  console.log("Merging", clone(arr1), clone(arr2))
    var a1
    var a2
    const result = []

    while (true) {
        if (arr1.lenght === 0 && arr2.length === 0) {return result}
        if (arr1.length === 0) {return [...result, ...arr2]}
        if (arr2.length === 0) {return [...result, ...arr1]}
        a1 = arr1[0]
        a2 = arr2[0]

        // console.log("HEAD", a1, a2)
        if (a1.creationDate === a2.creationDate) {
            // creationDate is the same -> same entry, we take the last modified
            if (a1.modificationDate < a2.modificationDate) {
                result.push(a2)
                arr1.shift()
                arr2.shift()
            } else {
                result.push(a1)
                arr1.shift()
                arr2.shift()
            }
        } else if (a1.creationDate > a2.creationDate) {
            result.push(a1)
            arr1.shift()
        } else {
            result.push(a2)
            arr2.shift()
        }
    }
}

export const createMergingLocalStorage = () => {
  const getItem = (name) => {
    const parse = (str) => {
      if (str === null) {
        return null
      }
      return JSON.parse(str)
    }
    const str = localStorage.getItem(name)
    const result = parse(str)
    return result
  }
  const store = (name, value) => {
    const tsNewValue = produce(value, draft => {draft.state.ts = getTimestamp()})
    localStorage.setItem(name, JSON.stringify(tsNewValue))
  }
  const setItem = (name, newValue) => {
    const currentStoredItem = getItem(name)
    if (currentStoredItem === null) {
      store(name, newValue)
    } else {
      if (currentStoredItem.state.ts > newValue.state.ts) {
        const mergedValue = {
          ...newValue,
          state: {
            ...newValue.state,
            entries: mergeSortedArrays(newValue.state.entries, currentStoredItem.state.entries)
          }
        }
        store(name, mergedValue)
      } else {
        store(name, newValue)
      }
    }

  }

  const persistStorage = {
    getItem,
    setItem,
    removeItem: (name) => localStorage.removeItem(name),
  }
  return persistStorage
}


