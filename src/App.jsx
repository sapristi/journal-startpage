import {useState, useEffect } from 'react'
import './App.css';
import {Journal} from './components/journal'
import {Tasks} from './components/tasks'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper, Stack} from '@mui/material';

import {TopPanel} from "./components/top_panel"
import {SettingsPanel} from "./components/settings"
import {useTransientSettings} from "stores/transient"
import {useSettingsStore} from 'stores/settings'

const createCustomTheme = ({mode, primaryColor, secondaryColor, background}) =>createTheme({
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

function App() {
  const {settingsActive} = useTransientSettings()
  const {mode, primaryColor, secondaryColor, background} = useSettingsStore(state => state)
  const [currentTheme, setCurrentTheme] = useState(
    createCustomTheme({mode, primaryColor, secondaryColor, background})
  )
  useEffect(
    () => {
      setCurrentTheme(createCustomTheme({mode, primaryColor, secondaryColor, background} ))
    },
    [mode, primaryColor, secondaryColor, background]
  )
  return (
    <ThemeProvider theme={currentTheme}>
      <Paper style={{minHeight: "100vh"}}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <TopPanel/>
            {
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
            }
          </Stack>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
