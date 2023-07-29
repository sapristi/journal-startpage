import create from 'zustand'

export const useTransientSettings = create(
  (set, get) => ({
    settingsActive: false,
    switchSettings: () => set(state => ({
      settingsActive: !state.settingsActive
    })),
    showContent: false,
    setShowContent: (value) => set(state => ({
      showContent: value
    })),
    switchShowContent: () => set(state => ({
      showContent: !state.showContent
    })),
    triggerRenderLocaleValue: false,
    triggerRenderLocale: () => set(state => ({
      triggerRenderLocaleValue: !state.triggerRenderLocaleValue
    })),

    snackbar: null,
    setSnackbar: (snackbar) => set({snackbar}),
    closeSnackbar: () => set({snackbar: null})
  })
)
