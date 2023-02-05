import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useTransientSettings = create(persist(
  (set) => ({
    settingsActive: false,
    activeTab: "journal",
    switchSettings: () => set(state => ({
      settingsActive: !state.settingsActive
    })),
    switchActiveTab: () => set(state => ({
      activeTab: (state.activeTab === "journal")?"notes":"journal"
    }))
  }),
  {
    name: "transient"
  }
))
