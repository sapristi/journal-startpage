import React from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware'

import {EditableMarkdown} from "./editable"
import {getTimestamp, DateElem, displayDate} from '../utils'

import ClearIcon from '@mui/icons-material/Clear';
import {Paper, Typography, Button, Divider} from '@mui/material';
import {MainPaper, CardList, HFlex} from "./base"

const initData = [{
  creationDate: 1573286497768,
  content: `
- Double click to edit
- Only one journal entry per day
`
}]


const useEntriesStore = create(
  persist(
  (set) => ({
    entries: initData,
    addEntry: (entry) => set((state) =>
      {return {entries: [{creationDate: getTimestamp(), ...entry}, ...state.entries]}}
    ),
    editEntry: (creationDate, field, newValue) => set((state) => {
      const newEntries = state.entries.map((entry) => {
        if (creationDate === entry.creationDate) {
          return {...entry, [field]: newValue}
        } else {return entry}
      });
      return {entries: newEntries};
    }),
    removeEntry: (creationDate) => set( (state) => {
      return {
        entries: state.entries.filter(entry => entry.creationDate !== creationDate)
      }})
  }),
    {
      name: "journal-storage",
    }
  )
)


const Entry = ({creationDate, content}) => {
  const editEntry = useEntriesStore((state) => state.editEntry)
  const removeEntry = useEntriesStore((state) => state.removeEntry)

  const handleContentChange = (newValue) => {
    editEntry(creationDate, "content", newValue)
  }

  return (
    <Paper elevation={8} sx={{p: 1, pl: 2}}>
      <HFlex style={{justifyContent: "space-between"}}>
        <div>
          <Typography variant="h5">{displayDate(creationDate)}</Typography>
          <Typography color="text.secondary"><DateElem timestamp={creationDate}/></Typography>
        </div>
        <div>
          <Button onClick={() => removeEntry(creationDate)}><ClearIcon/></Button>
        </div>
      </HFlex>
      <Divider/>
      <EditableMarkdown value={content} onChange={handleContentChange}/>

    </Paper>
  )
}

export const Journal = () => {
  const entries = useEntriesStore((state) => state.entries)
  const addEntry = useEntriesStore((state) => state.addEntry)

  const addEmptyEntry = () => addEntry({content: "Dear diary, today I ..."})
  return (
    <MainPaper>
      <Typography variant="h3">Journal</Typography>
      <Button onClick={addEmptyEntry}>Add entry</Button>
      <CardList>
        {
          entries.map( (entry, i) => <Entry key={entry.creationDate} {...entry}/>)
        }
      </CardList>
    </MainPaper>
  )
}
