import create from 'zustand'
import { persist } from 'zustand/middleware'


export const useCalDAVStore = create(
  persist(
    (set) => ({
      url: "",
      auth_method: "public",
      credentials: {},
      set,
    }),
    {
      name: "caldav"
    }
  )
)
