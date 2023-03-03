import { useState, useEffect, memo } from 'react'
import { Typography, Stack, Box, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {Calendar} from "./calendar"
import {Bookmarks} from "./bookmarks"
import {BackgroundPaper, Switch, IconButton} from "./base"
import {SettingsIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon} from 'icons'
import {useSettingsStore} from 'stores/settings'
import {useTransientSettings} from 'stores/transient'
import {useLocalSettings} from 'stores/local'

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
  const {activeTab} = useLocalSettings()

  const {settingsActive, switchSettings, showContent, switchShowContent} = useTransientSettings()
  const {locale, showContentAtStart} = useSettingsStore()
  return (
    <BackgroundPaper>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" justifyContent="space-between">
          <AutoUpdatingTimePanel/>
          <Stack sx={{width: "min-content"}} direction="row">
            <ToggleButton selected={settingsActive} onChange={switchSettings}>
              <SettingsIcon />
            </ToggleButton>
            <IconButton onClick={switchShowContent} color="">
              {
                (showContent)? <KeyboardArrowUpIcon/>: <KeyboardArrowDownIcon/>
              }
            </IconButton>
          </Stack>
        </Stack>
        <Bookmarks/>
        <Calendar locale={locale}/>
      </Stack>
    </BackgroundPaper>
  )
})
