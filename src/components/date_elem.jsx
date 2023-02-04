import {displayRelativeDate, formatTimeProp} from 'utils/locales'

export const DateElem = ({timestamp}) => {
  return <time dateTime={formatTimeProp(timestamp)}>
           {displayRelativeDate(timestamp)}
         </time>
}
