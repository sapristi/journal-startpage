import { useState, useEffect, memo } from 'react'
import { Typography, Stack, Box, ToggleButton } from '@mui/material';
import {Table, TableRow, TableCell, TableBody, TableContainer, Badge} from '@mui/material';
import {Calendar} from "./calendar"
import {Bookmarks} from "./bookmarks"
import {BackgroundPaper, IconButton} from "./base"
import {SettingsIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon} from 'icons'
import {useTransientSettings} from 'stores/transient'
import {useSettingsStore} from 'stores/settings'
import { fetchCalendarObjects, fetchCalendars, createDAVClient } from 'tsdav';
import { DateTime } from "luxon";
const ICAL = require("ical.js")


const matched = x => ({
  on: () => matched(x),
  otherwise: () => x,
})

const cleverEval = (fn, x) => (
  (typeof(fn) === "function")
    ? fn(x) : fn
)

export const match = (x, cmp = (a,b) => a===b) => ({
  on: (pred, fn) => (
    (typeof(pred) === "function")
      ? (pred(x) ? matched(cleverEval(fn, x)) : match(x, cmp))
      : ((cmp(x, pred)) ? matched(cleverEval(fn, x)) : match(x, cmp))
  ),
  otherwise: fn => cleverEval(fn, x),
})

const loadEvents = async ({url}) => {

  const parseRawEvent = (rawEvent) => {
    const jcalData = ICAL.parse(rawEvent.data)
    const comp = new ICAL.Component(jcalData);
    const vevent = comp.getFirstSubcomponent("vevent")
    const uid = vevent.getFirstPropertyValue("uid")
    const summary = vevent.getFirstPropertyValue("summary")
    const dtstart = vevent.getFirstPropertyValue("dtstart")
    delete dtstart._time.isDate
    const zone = match(dtstart.timezone).on(
      "Z", "UTC"
    ).otherwise(x => x)
    const dt = DateTime.fromObject(dtstart._time, {zone})
    const res =  {
      uid,
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
  res.sort((a,b) => (a.startTime > b.startTime))
  return res
}

const getTextColor = (startTime) =>{
  const nbDays = startTime.diff(DateTime.now(), "days").values.days
  if (nbDays < 2) {return "text.primary"}
  if (nbDays < 7) {return "text.secondary"}
  return "text.disabled"
}


const Event = ({summary, startTime}) => {
  const textColor = getTextColor(startTime)
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0, }}}>
      <TableCell>
        {/* <Badge color="primary" badgeContent=" " variant="dot" anchorOrigin={{horizontal: 'left', vertical: 'top'}}> */}
          <Typography sx={{color: textColor}}>{summary}</Typography>
        {/* </Badge> */}
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{color: textColor}}>{startTime.toRelative()}</Typography>
        <Typography variant="caption" sx={{color: textColor}}>{startTime.toLocaleString(DateTime.DATETIME_SHORT)}</Typography>
      </TableCell>
    </TableRow>
  )
}


const Events = () => {
  // Trigger refresh on locale change
  const locale = useSettingsStore(state => state.locale)
  const [events, setEvents ] = useState([])
  const caldavURL = useSettingsStore(state => state.caldavURL)

  useEffect(() => {
    if (!caldavURL) {return}
    loadEvents({url: caldavURL}).then(events => setEvents(events))
  }, [caldavURL, locale])

  return (
    <TableContainer sx={{width: "auto", maxHeight: "200px"}}>
      <Table size="small">
        <TableBody>
          {events.map(event => <Event key={event.uid} {...event}/>)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
const AutoUpdatingTimePanel = () => {
  // Trigger refresh on locale change
  const locale = useSettingsStore(state => state.locale)
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box sx={{padding: 2}}>
      <Typography variant="h3">{DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}</Typography>
      <Typography variant="h4">{DateTime.now().toLocaleString(DateTime.DATE_FULL)}</Typography>
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
