import './App.css';
import {Journal} from './components/journal'
import {Tasks} from './components/tasks'

import Calendar from 'react-calendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Container, Paper} from '@mui/material';
import {VFlex, HFlex} from "./components/base"
import {deepOrange, blueGrey} from '@mui/material/colors';
console.log("ORANGE", deepOrange)
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
              <div style={{flexGrow: 1}}/>
              <div style={{maxWidth: "300px"}}>
                <Calendar/>
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
