import { fetchCalendarObjects, calendarQuery } from "tsdav";
import { match, makeLogger } from "./common";
import { DateTime } from "luxon";

const ICAL = require("ical.js");

const log = makeLogger("EVENTS");

const parseIcalDate = (comp) => {
  delete comp._time.isDate;
  const zone = match(comp.timezone)
    .on("Z", "UTC")
    .otherwise((x) => x);
  const dt = DateTime.fromObject(comp._time, { zone });
  return dt;
};

const parseIcalEvent = (vevent) => {
  const uid = vevent.getFirstPropertyValue("uid");
  const summary = vevent.getFirstPropertyValue("summary");
  const dtstart = vevent.getFirstPropertyValue("dtstart");
  const res = {
    uid,
    summary,
    startTime: parseIcalDate(dtstart),
  };
  return res;
};

const extractIcalEvents = (data) => {
  const jcalData = ICAL.parse(data);
  const comp = new ICAL.Component(jcalData);
  const events = comp
    .getAllSubcomponents()
    .filter((comp) => comp.name === "vevent")
    .map(parseIcalEvent);
  return events;
};

export const loadICSEvents = async ({ url }) => {
  let response = await fetch(url);
  let text = await response.text();

  const events = extractIcalEvents(text);
  const start = DateTime.now();
  const end = start.plus({ month: 2 });

  return events
    .filter((event) => event.startTime >= start && event.startTime <= end)
    .sort((a, b) => a.startTime > b.startTime);
};

export const loadCalDAVEvents = async ({ url }) => {
  const getEvents = async (timeRange) => {
    const response = await fetchCalendarObjects({
      calendar: { url },
      timeRange,
    });
    const events = [];
    for (let rawEvent of response) {
      for (let event of extractIcalEvents(rawEvent.data)) {
        events.push(event);
      }
    }
    return events;
  };
  const now = DateTime.now();
  let timeRange = {
    start: now.toISO(),
    end: now.plus({ month: 2 }).toISO(),
  };
  const res = await getEvents(timeRange);
  res.sort((a, b) => a.startTime > b.startTime);
  return res;
};

/* Would use some less resources to only query for the entries first,
   then download those that have changed (would need localstorage as well).
   Though it's not much more efficient, and a bit more complicated.
*/
const loadEventsBis = async ({ url }) => {
  const dateToCalFormat = (date) => {
    return date
      .startOf("second")
      .setZone("UTC")
      .toFormat("yyyyLLdd'T'HHmmss'Z'");
  };
  const now = DateTime.now();
  const start = dateToCalFormat(now);
  const end = dateToCalFormat(now.plus({ month: 2 }));

  const entries = await calendarQuery({
    url,
    prop: [
      {
        name: "getetag",
      },
    ],
    filters: [
      {
        "comp-filter": {
          _attributes: { name: "VCALENDAR" },
          "comp-filter": {
            _attributes: { name: "VEVENT" },
            "time-range": {
              _attributes: { start, end },
            },
          },
        },
      },
    ],
    depth: "1",
  });
  log("CALDAV ENTRIES", entries);
};
