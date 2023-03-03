import React, {useState} from 'react';
import {
  Paper, Stack, TextField,  InputAdornment, Button as MuiButton, IconButton as MuiIconButton,
  FormGroup, FormControlLabel, Switch as MuiSwitch, Typography
} from '@mui/material';
import {DeleteIcon} from "icons"
import {useSettingsStore} from 'stores/settings'

export const BackgroundPaper = ({children, ...props}) => {
  const {panelBlur} = useSettingsStore()
  const sxProps = props.sx || {}
  return (
      <Paper elevation={3} {...props} sx={{p: 3, backdropFilter: `blur(${panelBlur}px)`, ...sxProps}}>
      {children}
    </Paper>
  )
}

export const ForegroundPaper = ({children, ...props}) => {
  return (
    <Paper elevation={6} {...props}>
      {children}
    </Paper>
  )
}

export const CardList = ({children}) => (
  <Stack spacing={1}>
    {children}
  </Stack>
)

export const Button = ({children, ...props}) => {
  return <MuiButton variant="outlined" {...props}>{children}</MuiButton>
}

export const IconButton = ({children, color, ...props}) => {
  const colorProp = (color !== undefined)? color : "primary"
  return <MuiIconButton color={colorProp} {...props}>{children}</MuiIconButton>
}

export const DeleteButton = (props) => {
  return <IconButton {...props} variant="outlined" {...props}><DeleteIcon/></IconButton>
}



export const ActionInput = ({currentValue, action, textFieldProps, label, Icon}) => {
  const [value, setValue] = useState(currentValue)
  const handleInputChange = (event) => {const value = event.target.value; setValue(value)}
  const handleClick = () => action(value)
  const adornment = (
    <InputAdornment position="end">
      <IconButton onClick={handleClick} disabled={value === currentValue}>
        <Icon/>
      </IconButton>
    </InputAdornment>
  )
  return (
    <TextField
      label={label}
      value={value}
      onChange={handleInputChange}
      InputProps={{
        endAdornment: adornment
      }}
      {...textFieldProps}
    />
  )
}


export const Switch = ({label, ...props}) => {
  return (
    <FormGroup>
      <FormControlLabel control={<MuiSwitch {...props} />} label={label} />
    </FormGroup>
  )
}

export const DualLabelSwitch = ({leftLabel, rightLabel, ...props}) => {
  return (
    <Stack direction="row" alignItems="center">
      <Typography>{leftLabel}</Typography>
      <MuiSwitch {...props}/>
      <Typography>{rightLabel}</Typography>
    </Stack>
  )

}
