import create from 'zustand';
import { persist } from 'zustand/middleware'
import produce from "immer"
import { getTimestamp } from './utils'


const decomposeSets = (set1, set2) => {
  /* decompose values in
     - common: in both sets
     - in set1 but not set2 (i.e. set1 - set2)
     - in set2 but not set1 (i.e. set2 - set1)
  */
  const common = new Set()
  const set1distinct = new Set()
  const set2distinct = new Set()
  for (const v1 of set1) {
    if (set2.has(v1)) {common.add(v1)}
    else {set1distinct.add(v1)}
  }
  for (const v2 of set2) {
    if (!common.has(v2)) {set2distinct.add(v2)}
  }
  return {common, set1distinct, set2distinct}
}


const mergeObjects = (obj1, obj2) => {
  const keys1 = new Set(Object.keys(obj1))
  const keys2 = new Set(Object.keys(obj2))
  const {common, set1distinct: keys1distinct, set2distinct: keys2distinct} = decomposeSets(keys1, keys2)
  const result = {}
  for (const key of keys1distinct) {result[key] = obj1[key]}
  for (const key of keys2distinct) {result[key] = obj2[key]}
  for (const key of common) {
    const v1 = obj1[key]
    const v2 = obj2[key]
    if (v1.lastModified > v2.lastModified) {
      result[key] = v1
    } else {result[key] = v2}
  }
  return result
}


const createMergingLocalStorage = () => {
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
    const currentStoredValue = getItem(name)
    if (currentStoredValue === null) {
      store(name, newValue)
    } else {
      if (currentStoredValue.state.ts > newValue.state.ts) {
        const mergedValue = {
          ...newValue,
          state: {
            ...newValue.state,
            items: mergeObjects(newValue.state.items, currentStoredValue.state.items)
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

export const makePersistedStore = ({name, version, initData}) => create(
  persist(
    (set, get) => ({
      items: initData,
      actions: {
        addItem: (item) => set((state) =>
          {
            const date = getTimestamp();
            return {
              items: {
                ...state.items,
                [date]: {
                  ...item,
                  date,
                  lastModified: date
                }
              }
            }
          }
        ),
        editItem: (key, field, newValue) => set((state) => {
          const toEdit = {
            [field]: newValue,
            lastModified: getTimestamp()
          }
          // useful when modifiying an item that has been concurrently deleted
          // -> we assume modification means we want to keep it
          if (field !== "deleted") {toEdit.deleted = false}
          return {
            items: {
              ...state.items,
              [key]: {
                ...state.items[key],
                ...toEdit
              }
            }
          }
        }),
        deleteItem: (key) => set((state) => {
          return {
            items: {
              ...state.items,
              [key]: {
                ...state.items[key],
                deleted: true
              }
            }
          }
        })
      },
    }),
    {
      name,
      version,
      storage: createMergingLocalStorage(),
      partialize: (state) => ({
        items: state.items,
        ts: state.ts
      })

    }
  )
)
