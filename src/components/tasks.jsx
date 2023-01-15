import React from 'react';

import {  Button, Paper, Typography, Divider , Checkbox } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import {EditableMarkdown} from "./editable"
import {MainPaper, CardList, HFlex, VFlex} from "./base"
import {makePersistedStore} from '../store'
const initData = {
  0: {
    lastModified: 0,
    status: "todo",
    content: `
this is a task
- with some
- items
`
  },
  1:{
    lastModified: 1,
    status: "done",
    content: `
this is done task
- with one item
`
  }
}

export const useTasksStore = makePersistedStore({
  name: "tasks",
  version: 1,
  initData
})


const Task = ({itemKey, status, content}) => {

  const {editItem, deleteItem} = useTasksStore((state) => state.actions)

  const handleDelete = () => {deleteItem(itemKey)}

  const switchStatus = () => {
    const newStatus = (status === "todo")? "done" : "todo";
    editItem(itemKey, "status", newStatus)
  }
  const handleContentChange = (newValue) => {
    editItem(itemKey, "content", newValue)
  }
  const textColor = (status === "done")? "text.disabled": "text.primary";
  return (
    <Paper elevation={8} sx={{p: 1, pl: 2, color: textColor}}>
      <HFlex style={{justifyContent: "space-between", display: "flex"}}>
        <div>
          <Checkbox sx={{p: 0, pr:1 }} onChange={switchStatus} checked={status==="done"} />
        </div>
        <div style={{flex: 1, display: "flex"}}>
          <EditableMarkdown value={content} onChange={handleContentChange}/>
        </div>
        <VFlex>
          <Button onClick={handleDelete}><ClearIcon/></Button>
        </VFlex>
      </HFlex>
    </Paper>
  )
}

const extractTasks = (items) => {
  console.log("extract", items)
  const todo = []
  const done = []
  for (const [key, item] of Object.entries(items)) {
    if (item.deleted) {continue}
    if (item.status === "todo") {todo.push([key, item])}
    else {done.push([key, item])}
  }
  return {todo, done}
}

export const Tasks = () => {
  const items = useTasksStore((state) => state.items)
  const addItem = useTasksStore((state) => state.actions.addItem)

  const addEmptyTask = () => addItem({status: "todo", content: "TODO"})
  const {todo, done} = extractTasks(items)
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
            todo.map( ([key, entry]) => <Task key={key} itemKey={key} {...entry}/>)
          }
        </CardList>
      </div>

      <div>
        <Typography variant="h5">Done</Typography>
        <CardList>
          {
            done.map( ([key, entry]) => <Task key={key} itemKey={key} {...entry}/>)
          }
        </CardList>
      </div>

    </MainPaper>
  )
}

