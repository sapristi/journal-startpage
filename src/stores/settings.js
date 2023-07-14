import create from 'zustand'
import { persist } from 'zustand/middleware'
import { TinyColor } from '@ctrl/tinycolor'
import { Settings as LuxonSettings } from "luxon";
import {changeDeepState} from 'utils'


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
  nextcloud: {
    url: "",
    username: "",
    password: "",
    lastSync: null
  },
  hideTasks: false,
  minimalTopPanel: false,
}
const makeActions = (set, get) => {
  const setValue = (key, value) => {
    if (Array.isArray(key)) {
      set(state => changeDeepState(key, value, state))
    } else {
      set(state => ({[key]: value}))
    }
  }
  return {
    setValue,
    makeSetValueFromEvent: (key) => (event) => {
      const newValue = event.target.value;
      setValue(key, newValue)
    },
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
    switchValue: (key) => () => set(state => ({ [key]: !state[key] })),
    nextcloudActive: () => {
      const {url, username, password} = get().nextcloud
      return Boolean(url && username && password)
    }
  }
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      ...initValue,
      ...makeActions(set, get)
    }),
    {
      version: 0,
      name: "settings"
    }
  )
)
