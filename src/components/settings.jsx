import {Paper, Typography, Button, Stack, Switch} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import {debounce} from 'lodash';
import {useSettingsStore} from 'stores/settings'

const ModeSlider = () => {
  const { mode, switchMode } = useSettingsStore()
  // const switchMode = () => {
  //   const newValue = mode === "dark" ? "light" : "dark"
  //   setValue("mode", newValue)
  // }
  return (
    <Stack direction="row" alignItems="center">
      <Typography>Light</Typography>
      <Switch checked={(mode==="dark")} onChange={switchMode}/>
      <Typography>Dark</Typography>
    </Stack>
  )
}

const ControlledColorPicker = ({propName}) => {
  const state = useSettingsStore()

  const handleChange = newValue => state.setValue(propName, newValue)
  const debouncedChangeHandler = debounce(handleChange, 300)
  return (
    <MuiColorInput
      value={state[propName]}
      onChange={debouncedChangeHandler}
      label={propName}
    />
  )
}

export const SettingsPanel = () => {
  return (
    <Paper elevation={3} sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <ModeSlider/>
        <ControlledColorPicker propName="primaryColor"/>
        {/* <ControlledColorPicker propName="secondaryColor"/> */}
        <ControlledColorPicker propName="background"/>
      </Stack>
    </Paper>
  )
}
