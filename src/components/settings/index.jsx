import {useState} from "react"
import { Typography, Stack, Switch,  MenuItem, Divider} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import {debounce} from 'lodash';
import {useSettingsStore} from 'stores/settings'
import {makeLogger, helpText} from 'utils'
import {locales} from 'utils/locales'
import {ActionsPanel} from "./actions"
import {Select} from "components/select"
import {FileUpload} from "components/file_upload"
import {Markdown} from "components/editable"

import {ActionInput, BackgroundPaper, ForegroundPaper} from "components/base"
import SaveIcon from '@mui/icons-material/Save';

const log = makeLogger("Settings component")
const { version } = require('../../../package.json');

const LocaleSelector = () => {
  const {locale, setLocale} = useSettingsStore()
  return (
    <Select
      id="locale-selector" label="Locale"
            value={locale} handleChange={setLocale}>
      {
        locales.map(localeChoice =>
          <MenuItem key={localeChoice.key} value={localeChoice.key}>{localeChoice.name}</MenuItem>
        )
      }
    </Select>
  )
}
const ModeSlider = () => {
  const {mode, switchMode} = useSettingsStore()
  return (
    <Stack direction="row" alignItems="center">
      <Typography>Light</Typography>
      <Switch checked={(mode==="dark")} onChange={switchMode}/>
      <Typography>Dark</Typography>
    </Stack>
  )
}

const ControlledColorPicker = ({ propName}) => {
  const {[propName]: value, setValue} = useSettingsStore()

  const handleChange = newValue => setValue(propName, newValue)
  const debouncedChangeHandler = debounce(handleChange, 300)
  return (
    <MuiColorInput
      value={value}
      onChange={debouncedChangeHandler}
      label={propName}
    />
  )
}

const BackgroundPicker = () => {
  const [backgroundType, setBackgroundType] = useState("color")
  const {backgroundImageURL, setValue} = useSettingsStore()

  const handleUrlChange = (event) => {
    const newValue = event.target.value
    setValue("backgroundImageURL", newValue)
  }
  const handleFileChange = ({name, content}) => {
    setValue("backgroundImageURL", content)
  }

  let secondaryInput = null;
  if (backgroundType === "url") {
    secondaryInput = (
      <ActionInput value=""
                   action={value => setValue("backgroundImageURL", value)}
                   Icon={SaveIcon}
                   label="Background image url"
      />
    )
  } else if (backgroundType === "file"){
    secondaryInput = (
      <FileUpload id="background-image-upload" label="Background image" accept="image/*" handler={handleFileChange} readerMethod="readAsDataURL"/>
    )
  }

  return (
    <div>
      <Select value={backgroundType} handleChange={setBackgroundType} label="Background Image" sx={{minWidth: "50%"}}>
      <MenuItem value="color">Color</MenuItem>
      <MenuItem value="url">From URL</MenuItem>
      <MenuItem value="file">From file</MenuItem>
    </Select>
      {secondaryInput}
    </div>
  )
}

const HelpPanel = () => {
  return (
    <ForegroundPaper sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h2" variant="h4">About</Typography>

        <Markdown>{helpText}</Markdown>

      </Stack>
    </ForegroundPaper>
  )
}

export const SettingsPanel = () => {
  return (
    <BackgroundPaper sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h3">Settings</Typography>
        <Divider/>
        <Stack direction="row" spacing={3}>

          <ForegroundPaper elevation={4} sx={{padding: "20px"}}>
            <Stack spacing={3}>
              <Typography component="h2" variant="h4">Appearance</Typography>
              <ModeSlider />
              <ControlledColorPicker propName="primaryColor"/>
              {/* <ControlledColorPicker propName="secondaryColor"/> */}
              <ControlledColorPicker  propName="backgroundColor"/>
              <BackgroundPicker />
              <LocaleSelector />
            </Stack>
          </ForegroundPaper>
          <ActionsPanel/>
          <HelpPanel/>
        </Stack>
      </Stack>
      <Typography sx={{padding: "10px"}}>Version: {version}</Typography>
    </BackgroundPaper>
  )
}
