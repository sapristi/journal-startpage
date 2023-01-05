import React, {useState} from 'react';
import create from 'zustand';
import {EditableInput, EditableArea} from "./editable"

const useEntriesStore = create((set) => ({
  entries: [{
              key: "today",
              content: "some stuff",
            }
           ],
  addEntry: (entry) => set((state) => {return {entries: [entry, ...state.entries]}}),
  editEntry: (index, field, newValue) => set((state) => {
    console.log("EDIT", index, field, newValue)
    const newEntries = state.entries.map((entry, i) => {
      if (index == i) {
        return {...entry, [field]: newValue}
      } else {return entry}
    });
    return {entries: newEntries};
  })
}))


const Entry = ({i, entry}) => {
  const addEntry = useEntriesStore((state) => state.addEntry)
  const editEntry = useEntriesStore((state) => state.editEntry)

  const handleContentChange = (newValue) => {
    editEntry(i, "content", newValue)
  }
  const handleKeyChange = (newValue) => {
    editEntry(i, "key", newValue)
  }

  return (
    <div className="card">
      <div className="card-content">

        <EditableArea value={entry.content} onChange={handleContentChange}/>
      </div>
      <footer className="card-footer">
        <p className="card-footer-item">
          <EditableInput value={entry.key} onChange={handleKeyChange}/>
        </p>
      </footer>
    </div>
  )
}

export const EntryList = () => {

  const entries = useEntriesStore((state) => state.entries)
  console.log("ENTRIES", entries)
  return (
    <div>
      {
        entries.map( (entry, i) => <Entry key={i} i={i} entry={entry}/>)
      }
    </div>
  )
}
