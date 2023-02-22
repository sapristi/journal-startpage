import {useState, useEffect} from "react"
import { Typography, Stack, Switch,  MenuItem, Slider, Box} from '@mui/material';
import { MuiColorInput } from 'mui-color-input'
import {debounce} from 'lodash';
import {useSettingsStore} from 'stores/settings'
import {locales} from 'utils/locales'
import {Select} from "components/select"
import {FileUpload} from "components/file_upload"
import {ActionInput} from "components/base"
import SaveIcon from '@mui/icons-material/Save';
import {bookmarksApi, extractFolders} from 'utils/bookmarks_adapter'

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
  return (
    <Stack direction="row" alignItems="center">
      <Typography>Light</Typography>
      <Switch checked={(mode==="dark")} onChange={switchMode}/>
      <Typography>Dark</Typography>
    </Stack>
  )
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

export const BackgroundPicker = () => {
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
