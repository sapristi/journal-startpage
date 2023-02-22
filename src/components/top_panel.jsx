import { useState, useEffect, memo } from 'react'
import { Typography,  Switch, Stack, Box} from '@mui/material';
import {Calendar} from "./calendar"
import {Bookmarks} from "./bookmarks"
import {useTransientSettings} from "stores/transient"
import {useSyncValue} from 'stores/sync'
import {BackgroundPaper} from "./base"

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
    <Box sx={{padding: 2}}>
      <Typography variant="h3">{dayjs().format("LT")}</Typography>
      <Typography variant="h4">{dayjs().format("dddd LL")}</Typography>
    </Box>
  )
}


export const TopPanel = memo(() => {

  const {locale} = useSyncValue("settings")
  const {settingsActive, switchSettings} = useTransientSettings()
  return (
    <BackgroundPaper>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" justifyContent="space-between">
          <AutoUpdatingTimePanel/>
          <div>
            Settings
            <Switch checked={settingsActive} onChange={switchSettings} label="Settings"/>
          </div>
        </Stack>
        <Bookmarks/>
        <Calendar locale={locale}/>
      </Stack>
    </BackgroundPaper>
  )
})
