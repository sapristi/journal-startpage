import { DateTime } from "luxon";
import locales from './languages.json'

export const displayRelativeDate = (timestamp) => {
  return DateTime.fromMillis(timestamp).toRelative()
}

export const displayDate = (timestamp) => {
  return DateTime.fromMillis(timestamp).toLocaleString("dddd LL")
}

export const formatTimeProp = (timestamp) => (
  DateTime.fromMillis(timestamp).toISO()
)

export {locales}
