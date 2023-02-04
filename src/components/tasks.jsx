import React from 'react';

import {  Button, Paper, Typography, Divider , Checkbox, Stack } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import {EditableMarkdown} from "./editable"
import {MainPaper, CardList} from "./base"
import {useSyncEntriesStore} from 'stores/sync'

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


const Task = ({entryKey, state, setEntry, removeEntry}) => {


  const {status, content} = state
  const handleDelete = () => {removeEntry(entryKey)}

  const switchStatus = () => {
    const newStatus = (status === "todo")? "done" : "todo";
    setEntry(entryKey, {...state, status: newStatus})
  }
  const handleContentChange = (newValue) => {
    setEntry(entryKey, {...state, content: newValue})
  }
  const textColor = (status === "done")? "text.disabled": "text.primary";
  return (
    <Paper elevation={8} sx={{p: 1, pl: 2, color: textColor}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Checkbox sx={{p: 0, pr:1 }} onChange={switchStatus} checked={status==="done"} />
        </div>
        <div style={{flex: 1, display: "flex"}}>
          <EditableMarkdown value={content} onChange={handleContentChange}/>
        </div>
        <Button onClick={handleDelete}><ClearIcon/></Button>
      </Stack>
    </Paper>
  )
}

const extractTasks = (entries) => {
  const todo = []
  const done = []
  for (const [key, entry] of Object.entries(entries)) {
    if (entry === null) {continue}
    if (entry.deleted) {continue}
    if (entry.status === "todo") {todo.push([key, entry])}
    else {done.push([key, entry])}
  }
  return {todo, done}
}

export const Tasks = () => {

  const {entries, setEntry, addEntry, removeEntry} = useSyncEntriesStore(
    {
      name: "tasks",
      initData
    })

  const addEmptyTask = () => addEntry({status: "todo", content: "TODO"})
  const {todo, done} = extractTasks(entries)
  return (

    <MainPaper style={{display: "flex", flexDirection: "column", gap: "20px"}}>
      <div>
      <Typography variant="h3" component="h1">Tasks</Typography>
      <Button onClick={addEmptyTask}>Add entry</Button>
        <Divider/>
      </div>

      <div>
        <Typography variant="h5">Todo</Typography>
        <CardList>
          {
            todo.map( ([key, entry]) => <Task key={key} entryKey={key}
                                              setEntry={setEntry}
                                              removeEntry={removeEntry}
                                              state={entry}

                                        />)
          }
        </CardList>
      </div>

      <div>
        <Typography variant="h5">Done</Typography>
        <CardList>
          {
            done.map( ([key, entry]) =>
              <Task key={key} entryKey={key}
                    setEntry={setEntry}
                    removeEntry={removeEntry}
                    state={entry}
                    />
            )
          }
        </CardList>
      </div>

    </MainPaper>
  )
}

