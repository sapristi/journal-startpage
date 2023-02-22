import create from 'zustand'
import { persist } from 'zustand/middleware'
import { TinyColor } from '@ctrl/tinycolor'
import {getBrowserLocale} from 'utils/locales'

const dayjs = require('dayjs')

const initValue = {
  backgroundColor: "rgb(18, 18, 18)",
  primaryColor: "rgb(96, 125, 139)",
  secondaryColor: "#DD0033",
  mode: "dark",
  backgroundImageURL: "",
  bookmarksFolder: "",
  locale: getBrowserLocale(),
  panelBlur: 0,
}


export const useSettingsStore = create(
  persist(
    (set) => ({
      ...initValue,
      setValue: (key, value) => set(state => ({[key]: value})),
      switchMode: () => set(state => {
        if (state.mode === "dark") {
          return {
            mode: "light",
            backgroundColor: new TinyColor(state.backgroundColor).lighten(70).toString()
          }
        } else {
          return {
            mode: "dark",
            backgroundColor: new TinyColor(state.backgroundColor).darken(70).toString()
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
