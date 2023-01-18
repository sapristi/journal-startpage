import create from 'zustand'
import { persist } from 'zustand/middleware'
import { TinyColor } from '@ctrl/tinycolor';

const dayjs = require('dayjs')

const initValue = {
  background: "rgb(18, 18, 18)",
  primaryColor: "rgb(96, 125, 139)",
  secondaryColor: "#DD0033",
  mode: "dark",
  locale: null
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
      }),
      setLocale: (newLocale) => set(state => {
        dayjs.locale(newLocale)
        return {
          locale: newLocale
        }
      }),
    }),
    {
      name: "settings"
    }
  )
)
