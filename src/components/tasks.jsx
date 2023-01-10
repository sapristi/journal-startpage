import React from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware'
import {getTimestamp} from '../utils'
import {EditableMarkdown} from "./editable"


import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { Card, Button, Paper} from '@mui/material';
import {MainPaper, CardList, HFlex, VFlex} from "./base"
const initData = [
  {
    creationDate: 0,
    status: "todo",
    content: `
this is a task
- with some
- items
`
  },{
    creationDate: 1,
    status: "done",
    content: `
this is done task
- with one item
`
  }
]


const useTasksStore = create(
  persist(
    (set) => ({
      entries: initData,
      addEntry: (entry) => set((state) =>
        {return {entries: [{creationDate: getTimestamp(), ...entry}, ...state.entries]}}
      ),
      editEntry: (creationDate, field, newValue) => set((state) => {
        console.log("EDIT", creationDate, field, newValue)
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
    })
  ,
  {name: "tasks-storage"}
  ))

const Task = ({creationDate, status, content}) => {
  const editEntry = useTasksStore((state) => state.editEntry)
  const removeEntry = useTasksStore((state) => state.removeEntry)
  const handleContentChange = (newValue) => {
    editEntry(creationDate, "content", newValue)
  }
  const handleStatusChange = (newValue) => {
    editEntry(creationDate, "status", newValue)
  }
  return (
    <Paper elevation={8} sx={{p: 1, pl: 2}}>
      <HFlex style={{justifyContent: "space-between"}}>
        <div style={{flexGrow: 1}}>
          <EditableMarkdown value={content} onChange={handleContentChange}/>
        </div>
        <VFlex>
          <Button onClick={() => removeEntry(creationDate)}><ClearIcon/></Button>
          <Button ><CheckIcon/></Button>
        </VFlex>
      </HFlex>
    </Paper>
  )
}

export const Tasks = () => {
  const entries = useTasksStore((state) => state.entries)
  const addTask = useTasksStore((state) => state.addEntry)

  const addEmptyTask = () => addTask({name: "name", content: "content"})
  return (

    <MainPaper title="Tasks">
      <Button onClick={addEmptyTask}>Add entry</Button>
      <CardList>
        {
          entries.map( (entry, i) => <Task key={entry.creationDate} {...entry}/>)
        }
      </CardList>
    </MainPaper>
  )
}

