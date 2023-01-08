import React, {useState} from 'react';
import create from 'zustand';
import {getTimestamp, DateElem} from '../utils'
import { Card, Button, Icon } from 'semantic-ui-react'
import {EditableMarkdown} from "./editable"

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


const useTasksStore = create((set) => ({
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
}))

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
    <Card fluid>
      <Card.Content>
        <Button icon floated="right" onClick={() => removeEntry(creationDate)}><Icon name='delete'/></Button>
        <Card.Meta><DateElem timestamp={creationDate}/></Card.Meta>
        <Card.Description>
          <EditableMarkdown value={content} onChange={handleContentChange}/>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export const TaskList = () => {
  const entries = useTasksStore((state) => state.entries)
  const addTask = useTasksStore((state) => state.addEntry)

  const addEmptyTask = () => addTask({name: "name", content: "content"})
  return (
    <Card.Group style={{flexDirection: "column", display: "flex"}}>
      <Card fluid>
        <Card.Header><Button onClick={addEmptyTask}>Add entry</Button></Card.Header>
      </Card>
      {
        entries.map( (entry, i) => <Task key={entry.creationDate} {...entry}/>)
      }
    </Card.Group>
  )
}

