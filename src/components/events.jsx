import { useState, useEffect, memo } from 'react'
import { Typography } from '@mui/material';
import { DateTime } from "luxon";
import {Table, TableRow, TableCell, TableBody, TableContainer} from '@mui/material';
import { fetchCalendarObjects, fetchCalendars, createDAVClient , calendarQuery} from 'tsdav';
import {match} from 'utils'

import {useSettingsStore} from 'stores/settings'

const ICAL = require("ical.js")

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
    end: now.plus({month: 2}).toISO()
  }
  const res = await getEvents(timeRange)
  res.sort((a,b) => (a.startTime > b.startTime))
  return res
}
/* Would use some less resources to only query for the entries first,
  then download those that have changed (would need localstorage as well).
  Though it's not much more efficient, and a bit more complicated.
*/
const loadEventsBis = async ({url}) => {
  const dateToCalFormat = (date) => {
    return date.startOf('second').setZone('UTC').toFormat("yyyyLLdd'T'HHmmss'Z'")
  }
  const now = DateTime.now()
  const start = dateToCalFormat(now)
  const end = dateToCalFormat(now.plus({month: 2}))

  const entries = await calendarQuery({
    url,
    prop: [
      {
        name: 'getetag',
      }
    ],
    filters: [
      {
        "comp-filter": {
          "_attributes": {"name": "VCALENDAR"},
          "comp-filter": {"_attributes": {"name": "VEVENT"},
                          "time-range": {
                            "_attributes": {start,end}
                          }}}}
    ],
    depth: '1'
  })
  console.log("CALDAV ENTRIES", entries)
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



export const Events = () => {
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
