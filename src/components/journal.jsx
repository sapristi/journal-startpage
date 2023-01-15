import React from 'react';

import {EditableMarkdown} from "./editable"
import { DateElem, displayDate} from '../utils'

import ClearIcon from '@mui/icons-material/Clear';
import {Paper, Typography, Button, Divider, Link} from '@mui/material';
import {MainPaper, CardList, HFlex, VFlex} from "./base"
import {makePersistedStore} from '../store'

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

export const useJournalStore = makePersistedStore({
  name: "journal",
  version: 1,
  initData
})



const Entry = ({itemKey, date, content}) => {
  const {editItem, deleteItem} = useJournalStore((state) => state.actions)

  const handleContentChange = (newValue) => {
    editItem(itemKey, "content", newValue)
  }
  const handleDelete = () => {deleteItem(itemKey)}

  return (
    <Paper elevation={8} sx={{p: 1, pl: 2}}>
      <VFlex>
      <HFlex style={{justifyContent: "space-between"}}>
        <div>
          <Typography variant="h5">{displayDate(date)}</Typography>
          <Typography color="text.secondary"><DateElem timestamp={date}/></Typography>
        </div>
        <div>
          <Button onClick={handleDelete}><ClearIcon/></Button>
        </div>
      </HFlex>
      <Divider/>
      <EditableMarkdown value={content} onChange={handleContentChange}/>
      </VFlex>
    </Paper>
  )
}

const extractItems = (items) => {
  const nonDeleted = Object.entries(items).filter(([key, value]) => (!value.deleted))
  nonDeleted.sort(([key1, value1], [key2, value2])=> {return value2.date - value1.date})
  return nonDeleted
}

export const Journal = () => {
  const items = useJournalStore((state) => state.items)
  const addItem = useJournalStore((state) => state.actions.addItem)

  const extractedItems = extractItems(items)

  const addEmptyEntry = () => addItem({content: "Dear diary, today I ..."})
  return (
    <MainPaper>
      <Link/>
      <Typography variant="h3">Journal</Typography>
      <Button onClick={addEmptyEntry}>Add entry</Button>
      <CardList>
        {
          extractedItems.map( ([itemKey, item]) => <Entry key={itemKey} itemKey={itemKey} {...item}/>)
        }
      </CardList>
    </MainPaper>
  )
}
