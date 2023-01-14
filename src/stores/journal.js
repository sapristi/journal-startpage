import create from 'zustand';
import { persist } from 'zustand/middleware'

import { getTimestamp } from '../utils'
import {createMergingLocalStorage} from './persist'

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



export const useJournalStore = create(
  persist(
    (set, get) => ({
      entries: initData,
      addEntry: (entry) => set((state) =>
        {
          return {entries: [{creationDate: getTimestamp(), ...entry}, ...state.entries]}
        }
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
    }),
    {
      name: "journal-storage",
      version: 1,
      storage: createMergingLocalStorage()

    }
  )
)
