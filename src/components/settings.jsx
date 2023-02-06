import {Paper, Typography, Stack, Switch, Select, MenuItem, Divider, Button, TextField} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import {debounce} from 'lodash';
import {useSettingsStore} from 'stores/settings'
import {makeLogger, isEmpty} from 'utils'
import {locales} from 'utils/locales'
import {ActionsPanel} from "./actions"

const log = makeLogger("Settings component")
const { version } = require('../../package.json');

const LocaleSelector = () => {
  const {locale, setLocale} = useSettingsStore()
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

const BackgroundImagePicker = () => {
  const {backgroundImageURL, setValue} = useSettingsStore()
  const handleChange = (event) => {
    const newValue = event.target.value
    console.log("NEW VALUE", newValue)
    setValue("backgroundImageURL", newValue)
  }
  return <TextField value={backgroundImageURL} onChange={handleChange} label="Background Image URL"/>
}

export const SettingsPanel = () => {
  return (
    <Paper elevation={3} sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h3">Settings</Typography>
        <Divider/>
        <Stack direction="row" spacing={3}>

          <Paper elevation={4} sx={{padding: "20px"}}>
            <Stack spacing={3}>
              <Typography component="h2" variant="h4">Appearance</Typography>
              <ModeSlider />
              <ControlledColorPicker propName="primaryColor"/>
              {/* <ControlledColorPicker propName="secondaryColor"/> */}
              <ControlledColorPicker  propName="background"/>
              <BackgroundImagePicker />
              <LocaleSelector />
            </Stack>
          </Paper>
          <ActionsPanel/>

        </Stack>
      </Stack>
      <Typography sx={{padding: "10px"}}>Version: {version}</Typography>
    </Paper>
  )
}
