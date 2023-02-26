import { useEffect, useMemo, memo, Fragment } from 'react'
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper, Box} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import {Journal} from './components/journal'
import {Notes} from './components/notes'
import {Tasks} from './components/tasks'
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
    },
    shape: {
      borderRadius: 4
    }
  })
}

const BottomPanel = memo(() =>{
  const {settingsActive, activeTab} = useTransientSettings()
  return (
    settingsActive ?

    <Grid xs={12}>
      <SettingsPanel/>
    </Grid>
    :
    <>
      <Grid xs={4}>
        <Tasks/>
      </Grid>
      <Grid xs={8}>
        {
          (activeTab === "journal")? <Journal/>: <Notes/>
        }
      </Grid>
    </>
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
      <Box sx={{height: "100vh", overflow: "scroll", ...backgroundTheme}}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TopPanel/>
            </Grid>
            <BottomPanel/>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}


const HotKeysProvider = () => {
  const {setActiveTab} = useTransientSettings()
  const log = makeLogger("HOTKEYS")
  const handleKeyUp = useMemo(
    () => {
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

      return (event) => {
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
        default:
          break
        }
      }
    },
    [setActiveTab]
  )
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
