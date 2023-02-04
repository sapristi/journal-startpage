import React, {useState, memo} from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import {Paper, Typography, Button, Divider, Stack, TextField} from '@mui/material';

import {MainPaper, CardList} from "./base"
import {EditableMarkdown} from "./editable"
import {DateElem} from './date_elem'
import { getTimestamp} from 'utils'
import { displayDate} from 'utils/locales'
import {useSyncEntriesStore} from 'stores/sync_entries'

const initData = {
  0: {
    date: getTimestamp(),
    content: `
# Welcome to Journal Startpage !

## Features

- Task list
- Journal entries

See [source and more](https://github.com/sapristi/journal-startpage).

## Shortcuts

- Double click to edit
- Ctrl+Enter to validate (or click outside)
- Escape to cancel edition
`
  }
}




const Entry = memo(({entryKey, state, setEntry, removeEntry}) => {

  const {date, content} = state
  const handleContentChange = (newValue) => {
    setEntry(entryKey, {
      ...state,
      content: newValue
    })
  }
  const handleDelete = () => {removeEntry(entryKey)}

  return (
    <Paper elevation={8} sx={{p: 1, pl: 2}}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h5">{displayDate(date)}</Typography>
            <Typography color="text.secondary"><DateElem timestamp={date}/></Typography>
          </div>
          <div>
            <Button onClick={handleDelete}><ClearIcon/></Button>
          </div>
        </Stack>
        <Divider/>
        <EditableMarkdown value={content} onChange={handleContentChange}/>
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
  nonDeleted.sort(([key1, value1], [key2, value2])=> {return value2.date - value1.date})
  return nonDeleted
}

export const Journal = () => {
  const {entries, setEntry, addEntry, removeEntry} = useSyncEntriesStore(
    {
      name: "journal",
      initData
    }
  )
  const [search, setSearch] = useState(() => "")
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const extractedEntries = extractEntries(entries, search)

  const addEmptyEntry = () => addEntry({content: "Dear diary, today I ..."})
  return (
    <MainPaper>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <Typography component="h1" variant="h3">Journal</Typography>
        <TextField label="search" value={search} onChange={handleSearchChange} />
      </div>
      <Button onClick={addEmptyEntry}>Add entry</Button>
      <CardList>
        {
          extractedEntries.map( ([entryKey, entry]) =>
            <Entry
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
