import {Paper, Toolbar, Typography, Button, Stack, Switch} from '@mui/material';
import {Calendar} from "./calendar"
import {useTransientSettings} from "stores/transient"

const dayjs = require('dayjs')

export const TopPanel = () => {

  const {settingsActive, switchSettings} = useTransientSettings()
  return (
    <Paper elevation={3}>
      <Toolbar sx={{justifyContent: "space-between"}}>
        <div>
          <Typography variant="h3">{dayjs().format("LT")}</Typography>
          <Typography variant="h4">{dayjs().format("dddd LL")}</Typography>
          <div>
            Settings
            <Switch checked={settingsActive} onChange={switchSettings} label="Settings"/>
          </div>
        </div>
        <Calendar/>
      </Toolbar>
    </Paper>
  )
}
