import { CalendarPicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import { DateTime } from "luxon";

import { useSettingsStore } from "stores/settings";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isToday" && prop !== "isWeekEnd",
})(({ theme, isToday, isWeekEnd }) => ({
  ...(!isWeekEnd && {
    backgroundColor: theme.palette.action.disabledBackground,
  }),
  ...(isWeekEnd && {
    backgroundColor: theme.palette.background.default,
  }),
  ...(isToday && {
    backgroundColor: theme.palette.primary.light,
  }),
}));

const renderCustomDay = (date, selectedDates, pickersDayProps) => {
  const isWeekEnd = date.weekday === 6 || date.weekday === 7;
  const isToday = date.hasSame(DateTime.now(), "day");
  return (
    <CustomPickersDay
      sx={{ height: "22px", borderRadius: "25%" }}
      isToday={isToday}
      isWeekEnd={isWeekEnd}
      {...pickersDayProps}
    />
  );
};

export const Calendar = () => {
  const locale = useSettingsStore((state) => state.locale);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
      <CalendarPicker
        onChange={() => {}}
        reduceAnimations={true}
        readOnly={true}
        renderDay={renderCustomDay}
        style={{ margin: "0 0" }}
      />
    </LocalizationProvider>
  );
};
