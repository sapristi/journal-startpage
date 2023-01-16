import create from 'zustand'

export const useTransientSettings = create((set) => ({
  settingsActive: false,
  switchSettings: () => set(state => ({
    settingsActive: !state.settingsActive
  }))
}))
