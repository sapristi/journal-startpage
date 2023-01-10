import React from 'react';
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')

// const locale = window.navigator.language.slice()
// console.log("LOCALE", locale)
// require(`dayjs/locale/${locale}`)
// dayjs.locale(locale)

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export const getTimestamp = () => {
  return Date.now()
}

export const displayRelativeDate = (timestamp) => {
  return dayjs(timestamp).fromNow()
}

export const displayDate = (timestamp) => {
  return dayjs(timestamp).format("dddd, LL")
}
export const DateElem = ({timestamp}) => {
  return <time dateTime={dayjs(timestamp).format('YYYY-MM-DDTHH:mm:ss')}>
    {displayRelativeDate(timestamp)}
  </time>
}
