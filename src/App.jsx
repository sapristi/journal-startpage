import './App.css';
import {Journal} from './components/journal'
import {Tasks} from './components/tasks'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper} from '@mui/material';
import {VFlex, HFlex} from "./components/base"
import {deepOrange, blueGrey} from '@mui/material/colors';
import { CalendarPicker, LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

require('dayjs/locale/fr')

const theme = createTheme ({
  palette: {
    mode: "dark",
    primary: blueGrey
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Paper style={{minHeight: "100vh"}}>
        <Container maxWidth="xl">
          <VFlex style={{gap: "20px"}}>
            <div/>
            <HFlex style={{justifyContent: "space-around"}}>
              <div style={{flexGrow: 1}}>
              </div>
              <div style={{maxWidth: "300px"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                  <CalendarPicker onChange={()=>{}} reduceAnimations={true} readOnly={true}></CalendarPicker>
                </LocalizationProvider>
              </div>
            </HFlex>
            <div style={{display: "grid", gridTemplateColumns: "1fr 2fr", gap: "50px"}}>
              <div>
                <Tasks/>
              </div>
              <div>
                <Journal/>
              </div>
            </div>
          </VFlex>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
