import {Paper, Toolbar, Typography, Button, Stack, Switch} from '@mui/material';
import {Calendar} from "./calendar"

import {useTransientSettings} from "stores/transient"

export const TopPanel = () => {

  const {settingsActive, switchSettings} = useTransientSettings()
  return (
    <Paper elevation={3}>
      <Toolbar sx={{justifyContent: "space-between"}}>
        <div/>
        <Switch checked={settingsActive} onChange={switchSettings} label="Settings"/>
        <Calendar/>
      </Toolbar>
    </Paper>
  )
}
