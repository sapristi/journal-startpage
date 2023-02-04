import {useEffect} from 'react'
import { TinyColor } from '@ctrl/tinycolor';
import {useSyncStore} from 'stores/sync'
import {getBrowserLocale} from 'utils/locales'

const dayjs = require('dayjs')

const initValue = {
  background: "rgb(18, 18, 18)",
  primaryColor: "rgb(96, 125, 139)",
  secondaryColor: "#DD0033",
  mode: "dark",
  locale: getBrowserLocale()
}

export const useSettingsStore = () => {
  const {value, updateValue} = useSyncStore({name: "settings", initValue})
  useEffect(
    () => {
      if (value.locale) {dayjs.locale(value.locale)}
    },
    [value.locale]
  )

  const switchMode = () => (
    updateValue( value => {
      const newValues = (value.mode === "dark") ? {
        mode: "light",
        background: new TinyColor(value.background).lighten(70).toString()
      } : {
        mode: "dark",
        background: new TinyColor(value.background).darken(70).toString()
      }
      return newValues
    })
  )

  const setLocale = (newLocale) => {
    dayjs.locale(newLocale)
    updateValue(() => ({locale: newLocale}))
  }
  return {settings: value, switchMode, setLocale, updateValue}
}
