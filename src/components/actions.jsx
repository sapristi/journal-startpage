import {Paper, Typography, Stack, Switch, Select, MenuItem, Divider, Button} from '@mui/material';
import {saveFile, filterObject} from 'utils'
import {storage} from 'stores/storage_adapter'

export const ActionsPanel = () => {

  const handleJournalExport = () => {
    storage.get(null, obj => {
      console.log("GOT", obj)
      const journalEntries = filterObject(obj, key => key.startsWith("journal-")) 
      console.log("entries", journalEntries)
      const blob = new Blob([JSON.stringify(journalEntries)], { type: 'application/json' });
      saveFile("journal.json", blob)
    })
  }
  const handleJournalImport = (event) => {
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
      const entries = JSON.parse(result)
      console.log("Read json file")
      const journalEntries = filterObject(entries, key => key.startsWith("journal-")) 
      const wrongEntries = filterObject(entries, key => !key.startsWith("journal-"))
      const wrongKeys = Object.keys(wrongEntries)
      if (wrongKeys.length > 0) {
        console.warn("JSON file contains unsupported entries: ", wrongKeys)
      }
      console.log(`Found ${Object.keys(journalEntries).length} entries to import`)
      storage.set(journalEntries)
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Paper elevation={4} sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h2" variant="h4">Actions</Typography>
        <Button onClick={handleJournalExport} variant="outlined">Export journal</Button>
        <input
          accept="application/json"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleJournalImport}
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
