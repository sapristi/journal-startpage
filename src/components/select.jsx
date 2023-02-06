import { Select as MuiSelect, InputLabel, FormControl} from '@mui/material';


export const Select = ({id, label, value, handleChange, children, sx}) => {
  const handleChangeWrapper = (event) => {
    const newValue = event.target.value;
    handleChange(newValue)
  }
  return (
    <FormControl sx={sx}>
      <InputLabel id={id}>{label}</InputLabel>
      <MuiSelect value={value} onChange={handleChangeWrapper} label={label} labelId={id}>
        {children}
      </MuiSelect>
    </FormControl>
  )
}
