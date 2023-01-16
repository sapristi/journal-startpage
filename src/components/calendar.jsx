
import { CalendarPicker, LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import dayjs  from 'dayjs';
var weekday = require('dayjs/plugin/weekday')
dayjs.extend(weekday)
require('dayjs/locale/fr')



const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'isToday' && prop !== 'isWeekEnd',
}) (({ theme, isToday, isWeekEnd }) => (
    {
    ...(!isWeekEnd && {
        backgroundColor: theme.palette.common.black,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.common.grey,
        },
    }),

    ...(isWeekEnd && {
        backgroundColor: theme.palette.primary.main,
    }),
    ...(isToday && {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.secondary.dark,
        },
    }),
}))

const renderCustomDay = (
    date,
    selectedDates,
    pickersDayProps,
) => {
    const isWeekEnd = date.weekday() === 5 || date.weekday() === 6;
    const isToday = date.isSame(dayjs(), "day");
    return <CustomPickersDay
             sx={{height: "22px", borderRadius: "25%"}}
             isToday={isToday} isWeekEnd={isWeekEnd} {...pickersDayProps}
           />
}


export const Calendar = () => {
    return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <CalendarPicker
          onChange={() => {}}
          reduceAnimations={true}
          readOnly={true}
          renderDay={renderCustomDay}
        />
    </LocalizationProvider>
    )
}
