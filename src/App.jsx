import { useEffect, useMemo, memo } from 'react'
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper, Stack} from '@mui/material';

import {Journal} from './components/journal'
import {Tasks} from './components/tasks'
import {TopPanel} from "./components/top_panel"
import {SettingsPanel} from "./components/settings"
import {useTransientSettings} from "stores/transient"
import {useSyncValue} from 'stores/sync'
import {nonEmpty} from 'utils'

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
  const {settingsActive} = useTransientSettings()
  return (
    settingsActive ?
      <SettingsPanel/>
      :
      <Stack direction="row" spacing={3}>
        <div style={{flexGrow: 0.5}}>
          <Tasks/>
        </div>
        <div style={{flexGrow: 1}}>
          <Journal/>
        </div>
      </Stack>
  )
})
const InitializedApp = ({settings}) => {
  const {mode, primaryColor, secondaryColor, background} = settings
  console.log("APP", settings)
  const currentTheme = useMemo(
    () => {
      return createCustomTheme({mode, primaryColor, secondaryColor, background})
    },
    [mode, primaryColor, secondaryColor, background]
  )

  return (
    <ThemeProvider theme={currentTheme}>
      <Paper sx={{minHeight: "100vh"}}>
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
export const App = () => {
  const settings = useSyncValue("settings")
  if (nonEmpty(settings)) {
    return <InitializedApp settings={settings}/>
  } else {
    return <div/>
  }
}

