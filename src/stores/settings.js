import create from 'zustand'
import { persist } from 'zustand/middleware'
import { TinyColor } from '@ctrl/tinycolor'
import { Settings as LuxonSettings } from "luxon";


const initValue = {
  backgroundColor: "rgba(32, 39, 64, 0.44)",
  primaryColor: "rgb(104, 209, 224)",
  secondaryColor: "#DD0033",
  mode: "dark",
  backgroundImageURL: "https://raw.githubusercontent.com/sapristi/journal-startpage/master/assets/wallpaper_2.jpg",
  bookmarksFolder: "",
  locale: navigator.language,
  panelBlur: 4,
  showContentAtStart: true,
  caldavURL: "",
  escapeCancels: true,
  nextcloudURL: "",
  nextcloudCredentials: "",
  nextcloudLastSync: null
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
        LuxonSettings.defaultLocale = newLocale
        return {
          locale: newLocale
        }
      }),
      switchShowContentAtStart: () => set(state => ({showContentAtStart: !state.showContentAtStart})),
      switchEscapeCancels: () => set(state => ({ escapeCancels: !state.escapeCancels }))
    }),
    {
      name: "settings"
    }
  )
)
