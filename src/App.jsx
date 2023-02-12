import { useEffect, useMemo, memo, Fragment } from 'react'
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
import {storage} from 'stores/storage_adapter'
import {getTimestamp, makeLogger} from 'utils'

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


const HotKeysProvider = () => {
  const {setActiveTab} = useTransientSettings()
  const log = makeLogger("HOTKEYS")
  const addEntry = (name, value) => {
    const timestamp = getTimestamp()
    const key = `${name}-${timestamp}`
    storage.set(
      {
        [key]: {
          ...value,
          date: timestamp,
          isDraft: true,
        },
      }
    )
  }
  const addJournalEntry = () => addEntry("journal", {content: ""})
  const addTask = () => addEntry("tasks", {status: "todo", content: ""})
  const addNote = () => addEntry("notes", {title: "New Note", content: "", lastModified: getTimestamp()})
  const handleKeyUp = (event) => {
    const {target, key} = event;

    if (target.localName !== "body") {return}
    switch (key) {
    case "n":
      setActiveTab("notes")
      addNote()
      break;
    case "j":
      setActiveTab("journal")
      addJournalEntry()
      break;
    case "t":
      addTask()
      break;
    }
  }
  useEffect(
    () => {
      document.addEventListener("keyup", handleKeyUp)
      return () => document.removeEventListener("keyup", handleKeyUp)
    }, [setActiveTab, handleKeyUp]
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
