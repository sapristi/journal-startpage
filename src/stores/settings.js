import create from 'zustand'
import { persist } from 'zustand/middleware'
import { TinyColor } from '@ctrl/tinycolor';

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
      setValue: (key, value) => set(state => ({[key]: value})),
      switchMode: () => set(state => {
        if (state.mode == "dark") {
          return {
            mode: "light",
            background: new TinyColor(state.background).lighten(70).toString()
          }
        } else {
          return {
            mode: "dark",
            background: new TinyColor(state.background).darken(70).toString()
          }
        }
      })
    }),
    {
      name: "settings"
    }
  )
)
