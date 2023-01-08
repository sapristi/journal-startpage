import React, {useState} from 'react';
import create from 'zustand';
import {EditableInput, EditableMarkdown} from "./editable"
import { Card, Button, Icon } from 'semantic-ui-react'
import {getTimestamp, DateElem} from '../utils'

const initData = [{
  creationDate: 1000000,
  name: "Some entry",
  content: `
this is a journal entry
- with some
- items
`
}]


const useEntriesStore = create((set) => ({
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


const Entry = ({creationDate, name, content}) => {
  const editEntry = useEntriesStore((state) => state.editEntry)
  const removeEntry = useEntriesStore((state) => state.removeEntry)

  const handleContentChange = (newValue) => {
    editEntry(creationDate, "content", newValue)
  }
  const handleNameChange = (newValue) => {
    editEntry(creationDate, "name", newValue)
  }

  return (
    <Card fluid>
      <Card.Content>
        <Button icon floated="right" onClick={() => removeEntry(creationDate)}><Icon name='delete'/></Button>
        <Card.Header>
          <EditableInput value={name} onChange={handleNameChange}/>
        </Card.Header>
        <Card.Meta><DateElem timestamp={creationDate}/></Card.Meta>
        <Card.Description>
          <EditableMarkdown value={content} onChange={handleContentChange}/>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export const EntryList = () => {
  const entries = useEntriesStore((state) => state.entries)
  const addEntry = useEntriesStore((state) => state.addEntry)

  const addEmptyEntry = () => addEntry({name: "name", content: "content"})
  return (
    <Card.Group style={{flexDirection: "column", display: "flex"}}>
      <Card fluid>
        <Card.Header><Button onClick={addEmptyEntry}>Add entry</Button></Card.Header>
      </Card>
      {
        entries.map( (entry, i) => <Entry key={entry.creationDate} {...entry}/>)
      }
    </Card.Group>
  )
}
