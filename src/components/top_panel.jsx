import { useState, useEffect, memo } from "react";
import { Typography, Stack, Box, ToggleButton } from "@mui/material";
import { Calendar } from "./calendar";
import { Bookmarks } from "./bookmarks";
import { BackgroundPaper, IconButton } from "./base";
import {
  SettingsIcon,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  CloudSyncIcon,
} from "icons";
import { useTransientSettings } from "stores/transient";
import { useSettingsStore } from "stores/settings";
import { DateTime } from "luxon";
import { Events } from "./events";
import { syncNotes } from "utils/sync_nextcloud";

const AutoUpdatingTimePanel = () => {
  // Trigger refresh on locale change
  const locale = useSettingsStore((state) => state.locale);
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3">
        {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
      </Typography>
      <Typography variant="h4">
        {DateTime.now().toLocaleString(DateTime.DATE_FULL)}
      </Typography>
    </Box>
  );
};

const Controls = () => {
  const { settingsActive, switchSettings, showContent, switchShowContent } =
    useTransientSettings();
  const nextcloudActive = useSettingsStore((state) => state.nextcloudActive());
  return (
    <Stack sx={{ width: "min-content" }} direction="row">
      <ToggleButton
        selected={settingsActive}
        onChange={switchSettings}
        value={true}
      >
        <SettingsIcon />
      </ToggleButton>
      {nextcloudActive && (
        <ToggleButton onClick={syncNotes} value={true}>
          <CloudSyncIcon />
        </ToggleButton>
      )}
      {!settingsActive && (
        <IconButton onClick={switchShowContent} color="">
          {showContent ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      )}
    </Stack>
  );
};
export const TopPanel = memo(() => {
  return (
    <BackgroundPaper>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" justifyContent="space-between">
          <AutoUpdatingTimePanel />
          <Controls />
        </Stack>
        <Bookmarks />
        <Events />
        <Calendar />
      </Stack>
    </BackgroundPaper>
  );
});

export const MinimalTopPanel = memo(() => {
  return (
    <BackgroundPaper sx={{ paddingTop: 1, paddingBottom: 1 }}>
      <Controls />
    </BackgroundPaper>
  );
});
