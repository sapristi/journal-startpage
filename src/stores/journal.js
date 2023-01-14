import create from 'zustand';
import { persist } from 'zustand/middleware'

import { getTimestamp } from '../utils'

const initData = [{
  creationDate: 0,
  content: `
# Welcome to Journal Startpage !

## Features

- Task list
- Journal entries

See [source and more](https://github.com/sapristi/journal-startpage).

## Shortcuts

- Double click to edit
- Ctrl+Enter to validate (or click outside)
- Escape to cancel edition
`
}]


const mergeSortedArrays = (arr1, arr2) => {
    console.log("Merging")
    console.log(arr1)
    console.log(arr2)
    var a1
    var a2
    const result = []

    while (true) {
        console.log(arr1, arr2)
        if (arr1.lenght === 0 && arr2.length === 0) {return result}
        if (arr1.length === 0) {return [...result, ...arr2]}
        if (arr2.length === 0) {return [...result, ...arr1]}
        a1 = arr1[0]
        a2 = arr2[0]

        console.log("HEAD", a1, a2)
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

export const useJournalStore = create(
  persist(
  (set) => ({
    entries: initData,
    addEntry: (entry) => set((state) =>
      {return {entries: [{creationDate: getTimestamp(), ...entry}, ...state.entries]}}
    ),
    editEntry: (creationDate, field, newValue) => set((state) => {
      const newEntries = state.entries.map((entry) => {
        if (creationDate === entry.creationDate) {
          return {
              ...entry,
              [field]: newValue,
              modificationDate: getTimestamp()
          }
        } else {return entry}
      });
      return {entries: newEntries};
    }),
    removeEntry: (creationDate) => set( (state) => {
      return {
        entries: state.entries.filter(entry => entry.creationDate !== creationDate)
      }})
  }),
      {
          name: "journal-storage",
          version: 1,
          merge: (persistedState, currentState) => {
              return {
                  ...currentState,
                  entries: mergeSortedArrays(persistedState.entries, currentState.entries)
              }
          }
      }
  )
)
