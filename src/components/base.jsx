import React, {useState, useEffect} from 'react';
import {Paper, Stack, TextField,  InputAdornment, Button as MuiButton, IconButton as MuiIconButton} from '@mui/material';


export const BackgroundPaper = ({children, ...props}) => (
  <Paper elevation={1} {...props}>
    {children}
  </Paper>
)

export const ForegroundPaper = ({children, ...props}) => (
  <Paper elevation={5} {...props}>
    {children}
  </Paper>
)

export const CardList = ({children}) => (
  <Stack spacing={1}>
    {children}
  </Stack>
)

export const Button = ({children, ...props}) => {
  return <MuiButton variant="outlined" {...props}>{children}</MuiButton>
}

export const IconButton = ({children, ...props}) => {
  return <MuiIconButton color="primary" {...props}>{children}</MuiIconButton>
}


export const ActionInput = ({currentValue, action, textFieldProps, label, Icon}) => {
  const [value, setValue] = useState(currentValue)
  const handleInputChange = (event) => {const value = event.target.value; setValue(value)}
  const handleClick = () => action(value)
  const adornment = (
    <InputAdornment position="end">
      <IconButton onClick={handleClick} disabled={value == currentValue}>
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

