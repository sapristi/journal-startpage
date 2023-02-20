import {Paper, Typography, Stack,  Button} from '@mui/material';
import {saveFile, filterObject, makeLogger} from 'utils'
import {storage} from 'stores/storage_adapter'
import {FileUpload} from 'components/file_upload'

const log = makeLogger("Actions")

export const ActionsPanel = () => {

  const handleJournalExport = () => {
    storage.get(null, obj => {
      log("GOT", obj)
      const journalEntries = filterObject(obj, key => key.startsWith("journal-")) 
      log("entries", journalEntries)
      const blob = new Blob([JSON.stringify(journalEntries)], { type: 'application/json' });
      saveFile("journal.json", blob)
    })
  }

  const handler = ({name, content}) => {
    const entries = JSON.parse(content)
    console.log(`Read json file '${name}'`)
    const journalEntries = filterObject(entries, key => key.startsWith("journal-")) 
    const wrongEntries = filterObject(entries, key => !key.startsWith("journal-"))
    const wrongKeys = Object.keys(wrongEntries)
    if (wrongKeys.length > 0) {
      console.warn("JSON file contains unsupported entries: ", wrongKeys)
    }
    console.log(`Found ${Object.keys(journalEntries).length} entries to import`)
    storage.set(journalEntries)
  }

  return (
    <Paper elevation={4} sx={{padding: "20px"}}>
      <Stack spacing={3}>
        <Typography component="h2" variant="h4">Actions</Typography>
        <Button onClick={handleJournalExport} variant="outlined">Export journal</Button>
        <FileUpload id="journal-import" label="Import Journal" accept="application/json" handler={handler}
                    readerMethod="readAsBinaryString"/>
      </Stack>
    </Paper>
  )
}
