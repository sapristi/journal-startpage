import create from 'zustand'
import { persist } from 'zustand/middleware'

const initValue = {
  background: "black",
  primaryColor: "#AAAAAA",
  secondaryColor: "#DD0033",
  mode: "dark",
}

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...initValue,
      setValue: (key, value) => set(state => ({[key]: value}))}),
    {
      name: "settings"
    }
  )
)
