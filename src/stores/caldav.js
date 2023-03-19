import create from 'zustand'
import { persist } from 'zustand/middleware'


export const useCalDAVStore = create(
  persist(
    (set) => ({
      entries: {},
      set,
    }),
    {
      name: "caldav"
    }
  )
)
