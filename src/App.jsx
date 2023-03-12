import { useEffect, useMemo, memo, Fragment, useState } from 'react'
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Box} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useBottomScrollListener, BottomScrollListener } from 'react-bottom-scroll-listener';

import {Journal} from './components/journal'
import {Notes} from './components/notes'
import {Tasks} from './components/tasks'
import {TopPanel} from "./components/top_panel"
import {SettingsPanel} from "./components/settings"
import { makeLogger} from 'utils'
import {addEmptyJournalEntry, editLastJournalEntry} from 'stores/journal'
import {addEmptyNote, editLastNote} from 'stores/notes'
import {addEmptyTask} from 'stores/tasks'
import {useLocalSettings} from "stores/local"
import {useSettingsStore} from 'stores/settings'
import {useTransientSettings} from 'stores/transient'
import { Settings as LuxonSettings } from "luxon";


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
  const {settingsActive, showContent, setShowContent} = useTransientSettings()
  const {activeTab} = useLocalSettings()
  const {showContentAtStart} = useSettingsStore()
  const [scroll, setScroll] = useState(false)
  // show content at startup only if enabled
  useEffect(
    () => {
      if (showContentAtStart) {setShowContent(true)}
    }, []
  )

  if (settingsActive) {
    return (
      <Grid xs={12}>
        <SettingsPanel/>
      </Grid>
    )
  }
  if (!showContent) {return null}
  return (
    <>
      <Grid xs={4}>
        <Tasks/>
      </Grid>
      <Grid xs={8}>
        {
          (activeTab === "journal")? <Journal scroll={scroll}/>: <Notes scroll={scroll}/>
        }
      </Grid>
      <BottomScrollListener onBottom={() => setScroll(scroll => (!scroll))}/>
    </>
  )
})

const VisibleApp = () => {
  const {
    mode, primaryColor, secondaryColor, backgroundColor, locale, backgroundImageURL,
  } = useSettingsStore()

  if (LuxonSettings.defaultLocale !== locale) {LuxonSettings.defaultLocale = locale}

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
        backgroundAttachment: "fixed",
        margin: 0,
        minHeight: "100vh",
      } : {backgroundColor, minHeight: "100vh",}),
    [backgroundImageURL, backgroundColor]
  )


  return (
    <ThemeProvider theme={currentTheme}>
    <div style={{ ...backgroundTheme}}>
      <Container maxWidth="xl">
        <Grid container spacing={3} sx={{margin: 0}}>
          <Grid xs={12}>
            <TopPanel/>
          </Grid>
          <BottomPanel/>
        </Grid>

      </Container>
      </div>
    </ThemeProvider>
  );
}


const HotKeysProvider = () => {
  const {showContent, setShowContent, settingsActive, switchSettings} = useTransientSettings()
  const {setActiveTab, activeTab, switchActiveTab} = useLocalSettings()
  const log = makeLogger("HOTKEYS")
  const handleKeyUp = useMemo(
    () => {
      return (event) => {
        const {target, key} = event;

        if (target.localName !== "body") {return}
        // log("received", key)
        switch (key) {
        case "Escape":
          if (settingsActive) {switchSettings()}
          break
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
          if (!showContent) {setShowContent(true)}
          else {switchActiveTab()}
          break
        default:
          break
        }
      }
    },
    [setActiveTab, activeTab, switchActiveTab, setShowContent, showContent, settingsActive, switchSettings]
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
