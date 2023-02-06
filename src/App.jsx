import { useEffect, useMemo, memo, useState } from 'react'
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper, Stack} from '@mui/material';

import {Journal} from './components/journal'
import {Notes} from './components/notes'
import {Tasks} from './components/tasks'
import {MainPaper} from './components/base'
import {TopPanel} from "./components/top_panel"
import {SettingsPanel} from "./components/settings"
import {useTransientSettings} from "stores/transient"
import {useSettingsStore} from 'stores/settings'
const dayjs = require('dayjs')

const createCustomTheme = ({mode, primaryColor, secondaryColor, background}) =>{
  return createTheme({
    palette: {
      mode ,
      primary: {main: primaryColor},
      secondary: {main: secondaryColor},
      background: {
        paper: background,
        default: background
      }
    }
  })
}

const BottomPanel = memo(() =>{
  const {settingsActive, activeTab} = useTransientSettings()
  return (
    settingsActive ?
      <SettingsPanel/>
      :
      <Stack direction="row" spacing={3}>
        <div style={{flexGrow: 0.5}}>
          <Tasks/>
        </div>
        <div style={{flexGrow: 1}}>
          {
            (activeTab === "journal")? <Journal/>: <Notes/>
          }
        </div>
      </Stack>
  )
})

export const App = () => {
  const {mode, primaryColor, secondaryColor, background, locale, backgroundImageURL} = useSettingsStore()
  const currentTheme = useMemo(
    () => {
      return createCustomTheme({mode, primaryColor, secondaryColor, background})
    },
    [mode, primaryColor, secondaryColor, background]
  )
  useEffect(() => {
    dayjs.locale(locale)
  }
           )

  const backgroundTheme = (backgroundImageURL) ? {
    backgroundImage: `url("${backgroundImageURL}")`,
    backgroundSize: "cover",
  } : {}
  return (
    <ThemeProvider theme={currentTheme}>
      <Paper sx={{height: "100vh", overflow: "scroll", ...backgroundTheme}}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <TopPanel/>
            <BottomPanel/>
          </Stack>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

