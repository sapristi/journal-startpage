import React from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware'

import {  Button, Paper, Typography, Divider , Checkbox } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import {getTimestamp} from '../utils'
import {EditableMarkdown} from "./editable"
import {MainPaper, CardList, HFlex, VFlex} from "./base"

const initData = [
  {
    creationDate: 0,
    content: `
this is a task
- with some
- items
`
  },{
    creationDate: 1,
    content: `
this is done task
- with one item
`
  }
]


const useTasksStore = create(
  persist(
    (set) => ({
      todo: initData,
      done: [],
      addEntry: (status, entry) => set((state) =>
        {return {[status]: [{creationDate: getTimestamp(), ...entry}, ...state[status]]}}
      ),
      editEntry: (status, creationDate, field, newValue) => set((state) => {
        const newEntries = state[status].map((entry) => {
          if (creationDate === entry.creationDate) {
            return {...entry, [field]: newValue}
          } else {return entry}
        });
        return {[status]: newEntries};
      }),
      removeEntry: (status, creationDate) => set( (state) => {
        return {
          [status]: state[status].filter(entry => entry.creationDate !== creationDate)
        }})
    })
  ,
  {
    name: "tasks-storage",
    version: 1
  }
  ))

const Task = ({creationDate, status, content}) => {
  const addEntry = useTasksStore((state) => state.addEntry)
  const editEntry = useTasksStore((state) => state.editEntry)
  const removeEntry = useTasksStore((state) => state.removeEntry)

  const switchStatus = () => {
    const newStatus = (status === "todo")? "done" : "todo";
    removeEntry(status, creationDate);
    addEntry(newStatus, {creationDate, content});
  }
  const handleContentChange = (newValue) => {
    editEntry(status, creationDate, "content", newValue)
  }
  const textColor = (status == "done")? "text.disabled": "text.primary";
  return (
    <Paper elevation={8} sx={{p: 1, pl: 2, color: textColor}}>
      <HFlex style={{justifyContent: "space-between", display: "flex"}}>
        <div>
          <Checkbox sx={{p: 0, pr:1 }} onChange={switchStatus} checked={status==="done"} />
        </div>
        <div style={{flex: 1}}>
          <EditableMarkdown value={content} onChange={handleContentChange}/>
        </div>
        <VFlex>
          <Button onClick={() => removeEntry(status, creationDate)}><ClearIcon/></Button>
        </VFlex>
      </HFlex>
    </Paper>
  )
}

export const Tasks = () => {
  const todoTasks = useTasksStore((state) => state.todo)
  const doneTasks = useTasksStore((state) => state.done)
  const addTask = useTasksStore((state) => state.addEntry)

  const addEmptyTask = () => addTask("todo", {name: "name", content: "TODO"})
  return (

    <MainPaper style={{display: "flex", flexDirection: "column", gap: "20px"}}>
      <div>
      <Typography variant="h3">Tasks</Typography>
      <Button onClick={addEmptyTask}>Add entry</Button>
        <Divider/>
      </div>

      <div>
        <Typography variant="h5">Todo</Typography>
        <CardList>
          {
            todoTasks.map( (entry, i) => <Task key={entry.creationDate} status="todo" {...entry}/>)
          }
        </CardList>
      </div>

      <div>
        <Typography variant="h5">Done</Typography>
        <CardList>
          {
            doneTasks.map( (entry, i) => <Task key={entry.creationDate} status="done" {...entry}/>)
          }
        </CardList>
      </div>

    </MainPaper>
  )
}

