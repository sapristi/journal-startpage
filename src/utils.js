import React from 'react';
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const getTimestamp = () => {
  return Date.now()
}

export const displayDate = (timestamp) => {
  return dayjs(timestamp).fromNow()
}

export const DateElem = (timestamp) => {
  return <time dateTime={dayjs(timestamp).format('YYYY-MM-DDTHH:mm:ss')}>
    {displayDate(timestamp)}
  </time>
}
