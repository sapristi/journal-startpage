import {Paper, Typography, Stack, Switch, Select, MenuItem, Divider, Button, TextField} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import {debounce} from 'lodash';
import {useSettingsStore} from 'stores/settings'
import {makeLogger, isEmpty} from 'utils'
import {locales} from 'utils/locales'
import {ActionsPanel} from "./actions"

const log = makeLogger("Settings component")
const { version } = require('../../package.json');

const LocaleSelector = ({locale, setLocale}) => {
  const handleChange = (event) => {
    const newLocale = event.target.value
    setLocale(newLocale)
  }
  return (
    <Select value={locale} onChange={handleChange} label="locale">
      {
        locales.map(localeChoice =>
          <MenuItem key={localeChoice.key} value={localeChoice.key}>{localeChoice.name}</MenuItem>
        )
      }
    </Select>
  )
}
const ModeSlider = ({mode, switchMode}) => {
  return (
    <Stack direction="row" alignItems="center">
      <Typography>Light</Typography>
      <Switch checked={(mode==="dark")} onChange={switchMode}/>
      <Typography>Dark</Typography>
    </Stack>
  )
}

const ControlledColorPicker = ({settings, propName, updateValue}) => {

  const handleChange = newValue => updateValue(() => ({[propName]: newValue}))
  const debouncedChangeHandler = debounce(handleChange, 300)
  return (
    <MuiColorInput
      value={settings[propName]}
      onChange={debouncedChangeHandler}
      label={propName}
    />
  )
}

const BackgroundImagePicker = ({value, updateValue}) => {
  const fieldValue = (value)? value : ""
  const handleChange = (event) => {
    const newValue = event.target.value
    updateValue(() => ({backgroundImageURL: newValue}))
  }
  return <TextField value={fieldValue} onChange={handleChange} label="Background Image URL"/>
}

export const SettingsPanel = () => {
  const {settings, switchMode, setLocale, updateValue} = useSettingsStore()
  log("Settings", settings)
  if (isEmpty(settings)) {return <div/>}
  return (
    <Paper elevation={3} sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h3">Settings</Typography>
        <Divider/>
        <Stack direction="row" spacing={3}>

          <Paper elevation={4} sx={{padding: "20px"}}>
            <Stack spacing={3}>
              <Typography component="h2" variant="h4">Appearance</Typography>
              <ModeSlider mode={settings.mode} switchMode={switchMode}/>
              <ControlledColorPicker settings={settings} propName="primaryColor" updateValue={updateValue}/>
              {/* <ControlledColorPicker propName="secondaryColor"/> */}
              <ControlledColorPicker settings={settings} propName="background" updateValue={updateValue}/>
              <BackgroundImagePicker value={settings.backgroundImage} updateValue={updateValue}/>
              <LocaleSelector locale={settings.locale} setLocale={setLocale}/>
            </Stack>
          </Paper>
          <ActionsPanel/>

        </Stack>
      </Stack>
      <Typography sx={{padding: "10px"}}>Version: {version}</Typography>
    </Paper>
  )
}
