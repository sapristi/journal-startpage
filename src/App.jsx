import { useEffect, useMemo, memo, useState, Fragment } from 'react'
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

const createCustomTheme = ({mode, primaryColor, secondaryColor, backgroundColor}) =>{
  return createTheme({
    palette: {
      mode ,
      primary: {main: primaryColor},
      secondary: {main: secondaryColor},
      background: {
        paper: backgroundColor,
        default: backgroundColor
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

const VisibleApp = () => {
  const {mode, primaryColor, secondaryColor, backgroundColor, locale, backgroundImageURL} = useSettingsStore()
  useEffect(
    () => {
      dayjs.locale(locale)
    },
  [locale])

  const currentTheme = useMemo(
    () => {
      return createCustomTheme({mode, primaryColor, secondaryColor, backgroundColor})
    },
    [mode, primaryColor, secondaryColor, backgroundColor]
  )

  const backgroundTheme = useMemo( () =>
    (
    (backgroundImageURL) ? {
    backgroundImage: `url("${backgroundImageURL}")`,
    backgroundSize: "cover",
    } : {}),
    [backgroundImageURL]
  )


  return (
    <ThemeProvider theme={currentTheme}>
      <Paper sx={{height: "100vh", overflow: "scroll", ...backgroundTheme}} onKeyUp={console.log}>
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


const HotKeysProvider = () => {
  useEffect(
    () => {
      const handleKeyUp = (event) => {
        // console.log(event)
        const {target, key} = event;
        if (!target.localName === "body") {return}
        switch (key) {
        case "n":
          break;
        case "j":
          break;
        case "t":
          break;
        }
      }
      document.addEventListener("keyup", handleKeyUp)
    }, []
  )
  return null
}

export const App = () => {
  return (
    <Fragment>
      <HotKeysProvider/>
      <VisibleApp/>
    </Fragment>
  )
}
