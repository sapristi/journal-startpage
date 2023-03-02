import { useEffect, useMemo, memo, Fragment } from 'react'
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Box} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import {Journal} from './components/journal'
import {Notes} from './components/notes'
import {Tasks} from './components/tasks'
import {TopPanel} from "./components/top_panel"
import {SettingsPanel} from "./components/settings"
import {useTransientSettings} from "stores/transient"
import {useSettingsStore} from 'stores/settings'
import { makeLogger} from 'utils'
import {addEmptyJournalEntry, editLastJournalEntry} from 'stores/journal'
import {addEmptyNote, editLastNote} from 'stores/notes'
import {addEmptyTask} from 'stores/tasks'


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
    } : {backgroundColor}),
    [backgroundImageURL, backgroundColor]
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
  const {setActiveTab, activeTab, switchActiveTab} = useTransientSettings()
  const log = makeLogger("HOTKEYS")
  const handleKeyUp = useMemo(
    () => {
      return (event) => {
        const {target, key} = event;

        if (target.localName !== "body") {return}
        switch (key) {
        case "n":
          setActiveTab("notes")
          addEmptyNote()
          break;
        case "j":
          setActiveTab("journal")
          addEmptyJournalEntry()
          break;
        case "t":
          addEmptyTask()
          break;
        case "e":
          switch (activeTab) {
          case "notes":
            editLastNote()
            break
          case "journal":
            editLastJournalEntry()
            break
          default:
            break
          }
          break;
        case "s":
          switchActiveTab()
          break
        default:
          break
        }
      }
    },
    [setActiveTab, activeTab, switchActiveTab]
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
