import {Paper, Typography, Stack, Switch, Select, MenuItem, Divider, Button} from '@mui/material';


export const ActionsPanel = () => {

  // const {importState} = useJournalStore((state) => state.actions)
  const saveFile = async (blob) => {
    const a = document.createElement('a');
    a.download = 'journal.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };


  function readFile(file) {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = x=> resolve(fr.result);
      fr.readAsText(file);
    })}

  const handleClick = () => {
    const blob = new Blob([JSON.stringify({items, ts})], { type: 'application/json' });
    saveFile(blob)
  }
  const handleFileUpload = (event) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const { name } = file;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
      const { result } = evt.target;
      importState(JSON.parse(result))
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Paper elevation={4} sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h2" variant="h4">Actions</Typography>
        <Button onClick={handleClick} variant="outlined">Export journal</Button>
        <input
          accept="application/json"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="raised-button-file">
          <Button variant="outlined" component="span" >
            Import journal
          </Button>
        </label>
      </Stack>
    </Paper>
  )
}
