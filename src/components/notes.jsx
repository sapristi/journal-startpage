import React, {useState, memo} from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import {Paper, Typography, Button, Divider, Stack, TextField} from '@mui/material';

import {MainPaper, CardList} from "./base"
import {EditableMarkdown, EditableInput} from "./editable"
import {DateElem} from './date_elem'
import { getTimestamp} from 'utils'
import { displayDate} from 'utils/locales'
import {useSyncEntriesStore} from 'stores/sync_entries'
import {useTransientSettings} from "stores/transient"


const Note = memo(({entryKey, state, setEntry, removeEntry}) => {

    const {lastModified, content, title, isDraft} = state
  const handleContentChange = (newValue) => {
    setEntry(entryKey, {
      ...state,
      content: newValue,
        lastModified: getTimestamp(),
        isDraft: false
    })
  }
  const handleTitleChange = (newValue) => {
    setEntry(entryKey, {
      ...state,
      title: newValue,
      lastModified: getTimestamp()
    })
  }

  const handleDelete = () => {removeEntry(entryKey)}

  return (
    <Paper elevation={8} sx={{p: 1, pl: 2}}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div style={{flexGrow: 1}}>
            <EditableInput
              value={title}
              onChange={handleTitleChange}
              Component={Typography}
              componentProps={{variant:"h5"}}
            />
            {/* <Typography variant="h5">{title}</Typography> */}
            <Typography color="text.secondary"><DateElem timestamp={lastModified}/></Typography>
          </div>
          <div>
            <Button onClick={handleDelete}><ClearIcon/></Button>
          </div>
        </Stack>
        <Divider/>
        <EditableMarkdown value={content} onChange={handleContentChange}
                          isDraft={isDraft} handleCancelDraft={handleDelete}
                          textFieldProps={{ placeholder: "..." }}
        />
      </Stack>
    </Paper>
  )
})

const extractEntries = (entries, search) => {
  const nonDeleted = Object.entries(entries).filter(
    ([key, value]) => (
      value !== null &&
        !value.deleted && value.content.toLowerCase().includes(search.toLowerCase())
    )
  )
  nonDeleted.sort(([key1, value1], [key2, value2])=> {return value2.lastModified - value1.lastModified})
  return nonDeleted
}
export const Notes = () => {
  const {switchActiveTab} = useTransientSettings()
  const {entries, setEntry, addEntry, removeEntry} = useSyncEntriesStore(
    {
      name: "notes",
      initData: {}
    }
  )
  const [search, setSearch] = useState(() => "")
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const extractedEntries = extractEntries(entries, search)

  const addEmptyEntry = () => addEntry({
    title: "New note",
    content: "",
      lastModified: getTimestamp(),
      isDraft: true,
  })
  return (
    <MainPaper>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <Typography component="h1" variant="h3">Notes</Typography>
        <div>
          <Button onClick={switchActiveTab}>Show Journal</Button>
          <TextField label="search" value={search} onChange={handleSearchChange} />
        </div>
      </div>
      <Button onClick={addEmptyEntry}>Add note</Button>
      <CardList>
        {
          extractedEntries.map( ([entryKey, entry]) =>
            <Note
              key={entryKey}
              entryKey={entryKey}
              setEntry={setEntry}
              removeEntry={removeEntry}
              state={entry}
            />
          )
        }
      </CardList>
    </MainPaper>
  )
}
