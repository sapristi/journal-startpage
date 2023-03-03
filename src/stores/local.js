import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useLocalSettings = create(persist(
  (set, get) => ({
    settingsActive: false,
    activeTab: "journal",
    switchSettings: () => set(state => ({
      settingsActive: !state.settingsActive
    })),
    switchActiveTab: () => set(state => ({
      activeTab: (state.activeTab === "journal")?"notes":"journal"
    })),
    setActiveTab: (newTabValue) => {
      const current = get().activeTab
      if (current !== newTabValue) {
        set(state => ({activeTab: newTabValue}))
      }
    }
  }),
  {
    name: "local"
  }
))
