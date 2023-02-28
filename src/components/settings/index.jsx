import {useState, useEffect} from 'react';
import { Typography, Stack, Divider, Link} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {makeLogger, helpText} from 'utils'
import {Markdown} from "components/editable"
import {ForegroundPaper, BackgroundPaper, ActionInput, Button} from "components/base"
import {JournalExport, JournalImport} from "./actions"
import {
  LocaleSelector, ModeSlider, ControlledColorPicker,
  BookmarksFolderPicker, BlurSelector
} from './inputs'
import {storage} from 'stores/storage_adapter'
import {FileUpload} from "components/file_upload"
import {useSettingsStore} from 'stores/settings'
import SaveIcon from '@mui/icons-material/Save';

const log = makeLogger("Settings component")
const { version } = require('../../../package.json');

const SettingsSubPanel = ({title, children}) => {
  return (
    <ForegroundPaper sx={{p: 2}}>
      <Stack spacing={3}>
        <Typography component="h2" variant="h4">{title}</Typography>
        {children}
      </Stack>
    </ForegroundPaper>
  )
}

const HelpPanel = () => (
  <SettingsSubPanel title="About">
    <Markdown>{helpText}</Markdown>
  </SettingsSubPanel>
)

const PersonalPanel = () => (
  <SettingsSubPanel title="Personal">
    <LocaleSelector />
    <BookmarksFolderPicker/>
  </SettingsSubPanel>
)

const AppearancePanel = () => (
  <SettingsSubPanel title="Appearance">
    <ModeSlider />
    <ControlledColorPicker propName="primaryColor"/>
    {/* <ControlledColorPicker propName="secondaryColor"/> */}
    <ControlledColorPicker  propName="backgroundColor"/>
    {/* <BackgroundPicker /> */}
    <BlurSelector propName="panelBlur"/>
  </SettingsSubPanel>
)

const BackgroundImagePanel = () => {
  const {setValue} = useSettingsStore()
  const handleFileChange = ({name, content}) => {
    setValue("backgroundImageURL", content)
  }

  return (
    <SettingsSubPanel title="Background Image">
      <ActionInput value=""
                   action={value => setValue("backgroundImageURL", value)}
                   Icon={SaveIcon}
                   label="Background image url"
      />
      <FileUpload id="background-image-upload" label="Upload background image" accept="image/*" handler={handleFileChange} readerMethod="readAsDataURL" buttonProps={{variant: "contained", sx: {width: "100%"}}}/>
      <Button onClick={() => setValue("backgroundImageURL", null)} variant="contained">Clear image</Button>
    </SettingsSubPanel>
  )
}

const ActionsPanel = () => (
  <SettingsSubPanel title="Actions">
    <JournalExport />
    <JournalImport />
  </SettingsSubPanel>
)

const StatsPanel = () => {
  const [counts, setCounts] = useState({tasks: 0, journal: 0, notes: 0})
  useEffect(
    () => {
      storage.get(null, fullState => {
        var count = {tasks: 0, journal: 0, notes: 0}
        for (const key of Object.keys(fullState)) {
          for (const prefix of ["tasks", "journal", "notes"]) {
            if (key.startsWith(`${prefix}-`)) {
              count[prefix] += 1
            }
          }
        }
        console.log("COUNT", count)
        setCounts(count)
      })
    },
    []
  )

  return (
    <SettingsSubPanel title="Stats">
      <span>How much of your sync storage quota is being used:</span>
      <ul>
        <li>Journal: {counts.journal}</li>
        <li>Notes: {counts.notes}</li>
        <li>Tasks: {counts.tasks}</li>
        <li>Total: {counts.tasks+counts.journal+counts.notes}/512</li>
      </ul>
    </SettingsSubPanel>
  )
}

export const SettingsPanel = () => {
  return (
    <BackgroundPaper>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography component="h1" variant="h3">Settings</Typography>
          <Stack>
            <Typography>Journal Startpage version: {version}</Typography>
    <Typography><Link href="https://github.com/sapristi/journal-startpage/">See source on GitHub</Link></Typography>
          </Stack>
        </Stack>
        <Divider/>
        <Grid container spacing={3} p={0}>
          <Grid xs={3} sx={{paddingLeft: 0}}>
            <Stack spacing={3}>
              <AppearancePanel/>
              <BackgroundImagePanel/>
            </Stack>
          </Grid>
          <Grid xs={3}>
            <Stack spacing={3}>
              <PersonalPanel/><StatsPanel/>
            </Stack>
          </Grid>
          <Grid xs={3}><ActionsPanel/></Grid>
          <Grid xs={3} sx={{ paddingRight: 0 }}><HelpPanel/></Grid>
        </Grid>
      </Stack>
    </BackgroundPaper>
  )
}
