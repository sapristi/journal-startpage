import { Typography, Stack, Divider, Link, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { makeLogger, helpText } from "utils";
import { Markdown } from "components/editable";
import {
  ForegroundPaper,
  BackgroundPaper,
  ActionInput,
  Button,
  Switch,
  IconButton,
} from "components/base";
import { DataExport, DataImport } from "./actions";
import {
  LocaleSelector,
  ModeSlider,
  ControlledColorPicker,
  BookmarksFolderPicker,
  BlurSelector,
} from "./inputs";
import { SaveIcon, CloseIcon } from "icons";
import { FileUpload } from "components/file_upload";
import { useSettingsStore } from "stores/settings";

import { useJournalStore } from "stores/journal";
import { useNotesStore } from "stores/notes";
import { useTasksStore } from "stores/tasks";
import { useTransientSettings } from "stores/transient";
import { requestUrlPermission } from "utils/perms_adapter";

const log = makeLogger("Settings component");
const { version } = require("../../../package.json");

const SettingsSubPanel = ({ title, children }) => {
  return (
    <ForegroundPaper sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Typography component="h2" variant="h4">
          {title}
        </Typography>
        {children}
      </Stack>
    </ForegroundPaper>
  );
};

const HelpPanel = () => (
  <SettingsSubPanel title="About">
    <Markdown>{helpText}</Markdown>
  </SettingsSubPanel>
);

const BehaviourPanel = () => {
  const {
    showContentAtStart,
    switchValue,
    caldavURL,
    setValue,
    escapeCancels,
  } = useSettingsStore();
  const handlecaldavURLChange = async (event) => {
    let newValue = event.target.value;
    if (newValue.endsWith("?export")) {
      newValue = newValue.replace("?export", "");
    }
    await requestUrlPermission(newValue);
    setValue("caldavURL", newValue);
  };

  return (
    <SettingsSubPanel title="Behaviour">
      <LocaleSelector />
      <BookmarksFolderPicker />
      <Switch
        label="Show content at startup"
        checked={showContentAtStart}
        onChange={switchValue("showContentAtStart")}
      />
      <TextField
        label="CalDAV public url"
        value={caldavURL}
        onChange={handlecaldavURLChange}
      />
      <Switch
        label="Escape cancels edition"
        checked={escapeCancels}
        onChange={switchValue("escapeCancels")}
      />
    </SettingsSubPanel>
  );
};

const NextcloudPanel = () => {
  const { url, username, password } = useSettingsStore(
    (state) => state.nextcloud,
  );
  const { setValue, makeSetValueFromEvent } = useSettingsStore((state) => ({
    makeSetValueFromEvent: state.makeSetValueFromEvent,
    setValue: state.setValue,
  }));
  const handleNextcloudURLChange = async (event) => {
    let newValue = event.target.value;
    await requestUrlPermission(newValue);
    setValue(["nextcloud", "url"], newValue);
  };

  return (
    <SettingsSubPanel title="NextCloud (experimental)">
      <span>
        Sync with nextcloud notes. See{" "}
        <Link href="https://github.com/sapristi/journal-startpage#nextcloud-sync---experimental">
          the doc
        </Link>
      </span>
      <TextField
        label="Nextcloud url"
        value={url}
        onChange={handleNextcloudURLChange}
      />
      <TextField
        label="Nextcloud username"
        value={username}
        onChange={makeSetValueFromEvent(["nextcloud", "username"])}
      />
      <TextField
        label="Nextcloud credentials"
        type="password"
        value={password}
        onChange={makeSetValueFromEvent(["nextcloud", "password"])}
      />
    </SettingsSubPanel>
  );
};

const AppearancePanel = () => {
  const { hideTasks, minimalTopPanel, switchValue } = useSettingsStore();

  return (
    <SettingsSubPanel title="Appearance">
      <ModeSlider />
      <ControlledColorPicker propName="primaryColor" />
      {/* <ControlledColorPicker propName="secondaryColor"/> */}
      <ControlledColorPicker propName="backgroundColor" />
      <BlurSelector propName="panelBlur" />
      <Switch
        label="Hide tasks"
        checked={hideTasks}
        onChange={switchValue("hideTasks")}
      />
      <Switch
        label="Minimal top-panel"
        checked={minimalTopPanel}
        onChange={switchValue("minimalTopPanel")}
      />
    </SettingsSubPanel>
  );
};

const BackgroundImagePanel = () => {
  const { setValue } = useSettingsStore();
  const handleFileChange = ({ name, content }) => {
    setValue("backgroundImageURL", content);
  };

  return (
    <SettingsSubPanel title="Background Image">
      <ActionInput
        value=""
        action={(value) => setValue("backgroundImageURL", value)}
        Icon={SaveIcon}
        label="Background image url"
      />
      <FileUpload
        id="background-image-upload"
        label="Upload background image"
        accept="image/*"
        handler={handleFileChange}
        readerMethod="readAsDataURL"
        buttonProps={{ variant: "contained", sx: { width: "100%" } }}
      />
      <Button
        onClick={() => setValue("backgroundImageURL", null)}
        variant="contained"
      >
        Clear image
      </Button>
    </SettingsSubPanel>
  );
};

const ActionsPanel = () => (
  <SettingsSubPanel title="Actions">
    <DataExport />
    <DataImport />
  </SettingsSubPanel>
);

const StatsPanel = () => {
  const { entries: journalEntries } = useJournalStore();
  const { entries: tasks } = useTasksStore();
  const { entries: notes } = useNotesStore();

  const nbJournal = Object.keys(journalEntries).length;
  const nbTasks = Object.keys(tasks).length;
  const nbNotes = Object.keys(notes).length;
  return (
    <SettingsSubPanel title="Stats">
      <span>How much of your sync storage quota is being used:</span>
      <ul>
        <li>Journal: {nbJournal}</li>
        <li>Notes: {nbNotes}</li>
        <li>Tasks: {nbTasks}</li>
        <li>Total: {nbTasks + nbJournal + nbNotes}/512</li>
      </ul>
    </SettingsSubPanel>
  );
};

export const SettingsPanel = () => {
  const { switchSettings } = useTransientSettings();
  return (
    <BackgroundPaper>
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography component="h1" variant="h3">
            Settings
          </Typography>
          <IconButton onClick={switchSettings}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Grid container spacing={3} p={0}>
          <Grid xs={3} sx={{ paddingLeft: 0 }}>
            <Stack spacing={3}>
              <AppearancePanel />
              <BackgroundImagePanel />
            </Stack>
          </Grid>
          <Grid xs={3}>
            <Stack spacing={3}>
              <BehaviourPanel />
              <StatsPanel />
            </Stack>
          </Grid>
          <Grid xs={3}>
            <Stack spacing={3}>
              <ActionsPanel />
              <NextcloudPanel />
            </Stack>
          </Grid>
          <Grid xs={3} sx={{ paddingRight: 0 }}>
            <HelpPanel />
          </Grid>
        </Grid>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography>Journal Startpage version: {version}</Typography>
          <Typography>
            <Link href="https://github.com/sapristi/journal-startpage/">
              See source on GitHub
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </BackgroundPaper>
  );
};
