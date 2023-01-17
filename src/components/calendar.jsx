
import { CalendarPicker, LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import {useSettingsStore} from 'stores/settings'
import dayjs  from 'dayjs';




const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'isToday' && prop !== 'isWeekEnd',
}) (({ theme, isToday, isWeekEnd }) => (
    {
    ...(!isWeekEnd && {
      backgroundColor: theme.palette.action.disabledBackground,
    }),
    ...(isWeekEnd && {
      backgroundColor: theme.palette.background.default,
    }),
    ...(isToday && {
      backgroundColor: theme.palette.primary.light,
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

  const {locale} = useSettingsStore()
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <CalendarPicker
          onChange={() => {}}
          reduceAnimations={true}
          readOnly={true}
          renderDay={renderCustomDay}
          style={{margin: "0 0"}}
        />
    </LocalizationProvider>
    )
}
