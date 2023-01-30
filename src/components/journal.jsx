import React, {useState, memo} from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import {Paper, Typography, Button, Divider, Stack, TextField} from '@mui/material';

import {MainPaper, CardList} from "./base"
import {makeMergingStore} from 'stores/merging_store'
import {EditableMarkdown} from "./editable"
import { DateElem, displayDate} from 'utils'
import {useSyncItemsStore} from 'stores/sync'

const initData = {
  0: {
    date: 0,
    lastModified: 0,
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




const Entry = memo(({itemKey, state, setItem, removeItem}) => {

  const {date, content} = state
  const handleContentChange = (newValue) => {
    setItem(itemKey, {
      ...state,
      content: newValue
    })
  }
  const handleDelete = () => {removeItem(itemKey)}

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

const extractItems = (items, search) => {
  const nonDeleted = Object.entries(items).filter(
    ([key, value]) => (
      value !== null &&
      !value.deleted && value.content.toLowerCase().includes(search.toLowerCase())
    )
  )
  nonDeleted.sort(([key1, value1], [key2, value2])=> {return value2.date - value1.date})
  return nonDeleted
}

export const Journal = () => {
  const [items, setItem, addItem, removeItem] = useSyncItemsStore("journal")
  const [search, setSearch] = useState(() => "")
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const extractedItems = extractItems(items, search)

  const addEmptyEntry = () => addItem({content: "Dear diary, today I ..."})
  return (
    <MainPaper>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <Typography component="h1" variant="h3">Journal</Typography>
        <TextField label="search" value={search} onChange={handleSearchChange} />
      </div>
      <Button onClick={addEmptyEntry}>Add entry</Button>
      <CardList>
        {
          extractedItems.map( ([itemKey, item]) =>
            <Entry
              key={itemKey}
              itemKey={itemKey}
              setItem={setItem}
              removeItem={removeItem}
              state={item}
            />
          )
        }
      </CardList>
    </MainPaper>
  )
}
