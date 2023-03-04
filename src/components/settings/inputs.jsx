import {useState, useEffect} from "react"
import { Typography, Stack, Switch,  MenuItem, Slider, Box, TextField} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import {debounce} from 'lodash';
import {locales} from 'utils/locales'
import {Select} from "components/select"
import {bookmarksApi, extractFolders} from 'utils/bookmarks_adapter'
import {DualLabelSwitch} from 'components/base'

import {useSettingsStore} from 'stores/settings'
import {useCalDAVStore} from 'stores/caldav'

export const LocaleSelector = () => {
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

export const ModeSlider = () => {
  const {mode, switchMode} = useSettingsStore()
  return <DualLabelSwitch
           leftLabel="Light" rightLabel="Dark"
           checked={(mode==="dark")} onChange={switchMode}
         />
}

export const ControlledColorPicker = ({ propName}) => {
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


export const BookmarksFolderPicker = () => {
  const [choices, setChoices] = useState([])
  const {bookmarksFolder, setValue} = useSettingsStore()
  useEffect(() => {
    bookmarksApi.getTree().then(
      tree => {
        const folders = extractFolders(tree[0])
        const newChoices = folders.map(folder => ({id: folder.id, name: folder.title}))
        setChoices(newChoices)
      }
    )
  }, [setChoices])

  const setBookmarksFolder = newValue => {setValue("bookmarksFolder", newValue)}

  return (
    <Select value={bookmarksFolder} handleChange={setBookmarksFolder} label="Bookmarks folder">
      <MenuItem value="">Disabled</MenuItem>
      {
        choices.map(choice => <MenuItem key={choice.id} value={choice.id}>{choice.name}</MenuItem>)
      }
    </Select>
  )
}

export const BlurSelector = ({propName}) => {
  const {[propName]: value, setValue} = useSettingsStore()
  const handleChange = (event) => {
    const newValue = event.target.value
    setValue(propName, newValue)
  }
  return (
    <Box>
      <Typography>{propName}</Typography>
      <Slider
        size="small"
        value={value}
        valueLabelDisplay="auto"
        steps={20} marks min={0} max={20}
        onChange={handleChange}
      />
    </Box>
  )
}


export const CalDAVInputs = () => {
  const {username, password, url, set } = useCalDAVStore()
  const makeHandleChange = (field) => (event) => {
    const value = event.target.value
    set({[field]: value})
  }
  return (
    <Stack>
      <TextField label="url" value={url} onChange={makeHandleChange("url")}/>
      <TextField label="username" value={username} onChange={makeHandleChange("username")}/>
      <TextField label="password" value={password} type="password" onChange={makeHandleChange("password")}/>
    </Stack>)
}
