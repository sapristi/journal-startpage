import create from 'zustand'
import { persist } from 'zustand/middleware'
import { TinyColor } from '@ctrl/tinycolor'
import {getBrowserLocale} from 'utils/locales'

const dayjs = require('dayjs')

const initValue = {
  backgroundColor: "rgba(32, 39, 64, 0.44)",
  primaryColor: "rgb(104, 209, 224)",
  secondaryColor: "#DD0033",
  mode: "dark",
  backgroundImageURL: "https://raw.githubusercontent.com/sapristi/journal-startpage/master/assets/wallpaper_2.jpg",
  bookmarksFolder: "",
  locale: getBrowserLocale(),
  panelBlur: 4,
  showContentAtStart: true,
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
      switchShowContentAtStart: () => set(state => ({showContentAtStart: !state.showContentAtStart}))
    }),
    {
      name: "settings"
    }
  )
)
