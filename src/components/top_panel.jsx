import { useState, useEffect, memo } from 'react'
import {Paper, Toolbar, Typography,  Switch} from '@mui/material';
import {Calendar} from "./calendar"
import {useTransientSettings} from "stores/transient"
import {useSettingsStore} from 'stores/settings'

const dayjs = require('dayjs')

const AutoUpdatingTimePanel = () => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Typography variant="h3">{dayjs().format("LT")}</Typography>
      <Typography variant="h4">{dayjs().format("dddd LL")}</Typography>
    </>
  )
}


export const TopPanel = memo(() => {

  const {locale} = useSettingsStore()
  const {settingsActive, switchSettings} = useTransientSettings()
  return (
    <Paper elevation={3}>
      <Toolbar sx={{justifyContent: "space-between"}}>
        <div style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
          <div style={{flexGrow: 1}}>
            <AutoUpdatingTimePanel/>
          </div>
          <div style={{display: "flex", justyfyContent: "space-between"}}>
            <div style={{flexGrow: 1}}/>
            <div>
              Settings
              <Switch checked={settingsActive} onChange={switchSettings} label="Settings"/>
            </div>
          </div>
        </div>
        <Calendar locale={locale}/>
      </Toolbar>
    </Paper>
  )
})
