import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { DateTime } from "luxon";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import { fetchCalendarObjects, calendarQuery } from "tsdav";
import { checkUrlPermission } from "utils/perms_adapter";
import { PermSnackBarMessage } from "components/base";
import { match, makeLogger } from "utils";

import { useSettingsStore, useTransientSettings } from "stores";
import { loadICSEvents, loadCalDAVEvents } from "utils/ical_helpers";

const log = makeLogger("EVENTS");

const loadEvents = async ({ url }) => {
  if (url.startsWith("https://calendar.google.com/")) {
    return await loadICSEvents({ url });
  } else {
    return await loadCalDAVEvents({ url });
  }
};

const getTextColor = (startTime) => {
  const nbDays = startTime.diff(DateTime.now(), "days").values.days;
  if (nbDays < 2) {
    return "text.primary";
  }
  if (nbDays < 7) {
    return "text.secondary";
  }
  return "text.disabled";
};

const Event = ({ summary, startTime }) => {
  const textColor = getTextColor(startTime);
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        {/* <Badge color="primary" badgeContent=" " variant="dot" anchorOrigin={{horizontal: 'left', vertical: 'top'}}> */}
        <Typography sx={{ color: textColor }}>{summary}</Typography>
        {/* </Badge> */}
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: textColor }}>
          {startTime.toRelative()}
        </Typography>
        <Typography variant="caption" sx={{ color: textColor }}>
          {startTime.toLocaleString(DateTime.DATETIME_SHORT)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export const Events = () => {
  // Trigger refresh on locale change
  const locale = useSettingsStore((state) => state.locale);
  const [events, setEvents] = useState([]);
  const caldavURL = useSettingsStore((state) => state.caldavURL);
  const setSnackbar = useTransientSettings((state) => state.setSnackbar);

  const asyncEffect = async () => {
    if (!caldavURL) {
      return;
    }
    const hasPerm = await checkUrlPermission(caldavURL);
    if (!hasPerm) {
      setSnackbar({
        message: <PermSnackBarMessage />,
        severity: "warning",
      });
      return;
    }

    loadEvents({ url: caldavURL })
      .then((events) => setEvents(events))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setSnackbar({
            message: `Failed fetching Calendar events from ${caldavURL} (${error}). Check that the url is correct.`,
            severity: "warning",
          });
        }
      });
  };

  useEffect(() => {
    asyncEffect();
  }, [caldavURL, locale]);

  return (
    <TableContainer sx={{ width: "auto", maxHeight: "200px" }}>
      <Table size="small">
        <TableBody>
          {events.map((event) => (
            <Event key={event.uid} {...event} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
