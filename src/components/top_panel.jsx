import { useState, useEffect, memo } from 'react'
import { Typography, Stack, Box, ToggleButton } from '@mui/material';
import {Table, TableRow, TableCell, TableBody} from '@mui/material';
import {Calendar} from "./calendar"
import {Bookmarks} from "./bookmarks"
import {BackgroundPaper, IconButton, ForegroundPaper} from "./base"
import {SettingsIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon} from 'icons'
import {useTransientSettings} from 'stores/transient'
import {useSettingsStore} from 'stores/settings'
import { fetchCalendarObjects } from 'tsdav';
import { DateTime } from "luxon";
import {dayjs} from 'utils/locales'
const ICAL = require("ical.js")
const loadEvents = async ({url}) => {

  const parseRawEvent = (rawEvent) => {
    const jcalData = ICAL.parse(rawEvent.data)
    const comp = new ICAL.Component(jcalData);
    const vevent = comp.getFirstSubcomponent("vevent");
    const summary = vevent.getFirstPropertyValue("summary");
    const dtstart = vevent.getFirstPropertyValue("dtstart");
    delete dtstart._time.isDate
    const dt = DateTime.fromObject(dtstart._time, {zone: dtstart.timezone})
    const res =  {
      summary,
      startTime: dt
    }
    return res
  }

  const getEvents = async (timeRange) => {
    const events = await fetchCalendarObjects(
      {
        calendar: {url},
        timeRange,
      }
    )
    return events.map(parseRawEvent)
  }
  const now = DateTime.now()
  let timeRange =  {
    start: now.toISO(),
    end: now.plus({year: 1}).toISO()
  }
  const res = await getEvents(timeRange)
  console.log(res)
  return res
}
const Event = ({summary, startTime}) => {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0, } }}>
      <TableCell><Typography variant="body2">{startTime.toLocaleString(DateTime.DATETIME_SHORT)}</Typography></TableCell>
      <TableCell><Typography>{summary}</Typography></TableCell>
    </TableRow>
  )
}


const Events = () => {
  const [events, setEvents ] = useState([])
  const caldavURL = useSettingsStore(state => state.caldavURL)

  useEffect(() => {
    loadEvents({url: caldavURL}).then(events => setEvents(events))
  }, [])
  console.log("EVENTS", events)
  return (
    <Table size="small" sx={{height: "min-content"}}>
      <TableBody>
      {events.map(event => <Event key={event.startTime.toLocaleString()} {...event}/>)}
      </TableBody>
    </Table>
  )
}
const AutoUpdatingTimePanel = () => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
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


const Controls = () => {
  const {settingsActive, switchSettings, showContent, switchShowContent} = useTransientSettings()
  return (
    <Stack sx={{width: "min-content"}} direction="row">
      <ToggleButton selected={settingsActive} onChange={switchSettings} value="settings">
        <SettingsIcon />
      </ToggleButton>
      <IconButton onClick={switchShowContent} color="">
        {
          (showContent)? <KeyboardArrowUpIcon/>: <KeyboardArrowDownIcon/>
        }
      </IconButton>
    </Stack>
  )
}
export const TopPanel = memo(() => {
  return (
    <BackgroundPaper>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" justifyContent="space-between">
          <AutoUpdatingTimePanel/>
          <Controls/>
        </Stack>
        <Bookmarks/>
        <Events/>
        <Calendar/>
      </Stack>
    </BackgroundPaper>
  )
})
