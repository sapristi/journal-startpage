import {saveFile, filterObject, makeLogger} from 'utils'
import {storage} from 'utils/storage_adapter'
import {FileUpload} from 'components/file_upload'
import {Button} from 'components/base'

const log = makeLogger("Actions")

export const JournalExport = () => {
  const handleJournalExport = () => {
    storage.get(null, obj => {
      log("GOT", obj)
      const journalEntries = filterObject(obj, key => key.startsWith("journal-")) 
      log("entries", journalEntries)
      const blob = new Blob([JSON.stringify(journalEntries)], { type: 'application/json' });
      saveFile("journal.json", blob)
    })
  }
  return (
    <Button onClick={handleJournalExport} variant="contained">Export journal</Button>
  )
}

export const JournalImport = () => {
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
    <FileUpload id="journal-import" label="Import Journal" accept="application/json" handler={handler}
                readerMethod="readAsBinaryString" buttonProps={{variant: "contained", sx: {width: "100%"}}}/>
  )
}
