import { useState, useEffect, memo } from 'react'
import { Typography, Stack, Box, ToggleButton } from '@mui/material';
import {Calendar} from "./calendar"
import {Bookmarks} from "./bookmarks"
import {BackgroundPaper, IconButton} from "./base"
import {SettingsIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon} from 'icons'
import {useTransientSettings} from 'stores/transient'
import {useSettingsStore} from 'stores/settings'
import { createDAVClient } from 'tsdav';
import {useCalDAVStore} from 'stores/caldav'
const ICAL = require("ical.js")
const dayjs = require('dayjs')

const encode = (value) => {
  let utf8Encode = new TextEncoder()
  return String.fromCharCode.apply(null, utf8Encode.encode(value))
}


const loadEvents = async ({username, password, url}) => {
  const client = await createDAVClient({
    serverUrl: url,
    credentials: {
      username,
      password: encode(password),
    },
    authMethod: 'Basic',
    defaultAccountType: 'caldav',
  })


  const parseRawEvent = (rawEvent) => {
    const jcalData = ICAL.parse(rawEvent.data)
    const comp = new ICAL.Component(jcalData);
    const vevent = comp.getFirstSubcomponent("vevent");
    const summary = vevent.getFirstPropertyValue("summary");
    const dtstart = vevent.getFirstPropertyValue("dtstart");
    return {
      summary,
      dstart: dtstart._time
    }
  }

  const getEvents = async (timeRange) => {
    const events = await client.fetchCalendarObjects(
      {
        calendar: {url},
        timeRange,
      }
    )
    return events.map(parseRawEvent)
  }
  console.log("cleint", client, url)
  const now = dayjs().hour(0).minute(0).second(0).millisecond(0)
  let timeRange =  {
    start: now.toISOString(),
    end: now.year(now.year()+1).toISOString()
  }
  console.log(timeRange, await getEvents(timeRange))

  timeRange= {
    start: '2023-01-01T00:00:00.000Z',
    end: '2024-01-01T00:00:00.000Z'
  }
  console.log(timeRange, await getEvents(timeRange))
  timeRange= {
    start: "2023-01-01T23:00:00.000Z",
    end: "2023-02-01T23:00:00.000Z"
  }
  console.log(timeRange, await getEvents(timeRange))

  timeRange= {
    start: "2023-02-03T23:00:00.000Z",
    end: "2024-01-01T23:00:00.000Z"
  }
  console.log(timeRange, await getEvents(timeRange))

  const rawEventsBis = await client.fetchCalendarObjects(
    {
      calendar: {url},
      timeRange: {
        start: '2023-01-01T00:00:00.000Z',
        end: '2024-01-01T00:00:00.000Z'
        // start: now.toISOString(),
        // end: now.year(now.year()+1).toISOString()
      },
      // expand: true
    }
  )
  console.log("RAWEVENTS", rawEventsBis)

  const res = rawEventsBis.map(parseRawEvent)
  console.log("RES", res)
  return res
}


const Events = () => {
  const [events, setEvents ] = useState([])
  const {username, password, url } = useCalDAVStore()

  useEffect(() => {
    setEvents(loadEvents({username, password, url}))
  }, [])
  console.log("EVENTS", events)
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
