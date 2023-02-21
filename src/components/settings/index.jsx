import { Typography, Stack, Divider} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {makeLogger, helpText} from 'utils'
import {Markdown} from "components/editable"
import {ForegroundPaper, BackgroundPaper} from "components/base"
import {JournalExport, JournalImport} from "./actions"
import {LocaleSelector, ModeSlider, ControlledColorPicker, BackgroundPicker,
        BookmarksFolderPicker, BlurSelector
       } from './inputs'

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
    <BackgroundPicker />
    <BlurSelector propName="panelBlur"/>
  </SettingsSubPanel>
)

const ActionsPanel = () => (
  <SettingsSubPanel title="Actions">
    <JournalExport />
    <JournalImport />
  </SettingsSubPanel>
)

export const SettingsPanel = () => {
  return (
    <BackgroundPaper sx={{p: 3}}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h3">Settings</Typography>
        <Divider/>
        <Grid container spacing={3}>
          <Grid xs={3}><AppearancePanel/></Grid>
          <Grid xs={3}><PersonalPanel/></Grid>
          <Grid xs={3}><ActionsPanel/></Grid>
          <Grid xs={3}><HelpPanel/></Grid>
        </Grid>
      </Stack>
      <Typography sx={{padding: "10px"}}>Version: {version}</Typography>
    </BackgroundPaper>
  )
}
