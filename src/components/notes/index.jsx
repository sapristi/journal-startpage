import React, { useState, memo } from 'react';

import { Typography, Divider, Stack, TextField } from '@mui/material';
import { CardList, BackgroundPaper, ForegroundPaper, IconButton, Button, DeleteButton } from "components/base"
import { EditableMarkdown, EditableInput } from "components/editable"
import { DateElem } from 'components/date_elem'
import { getTimestamp } from 'utils'
import { useSyncEntriesStore } from 'stores/sync_entries'
import { useTransientSettings } from "stores/transient"

import { TabularNoteBody } from "./table"
import { AddBoxIcon } from "icons"
import TableViewIcon from '@mui/icons-material/TableView';

const TextualNoteBody = ({ entryKey, state, setEntry, handleDelete }) => {
  const { content, isDraft } = state
  const handleContentChange = (newValue) => {
    setEntry(entryKey, {
      ...state,
      content: newValue,
      lastModified: getTimestamp(),
      isDraft: false
    })
  }
  return (
    <EditableMarkdown value={content} onChange={handleContentChange}
      isDraft={isDraft} handleCancelDraft={handleDelete}
      textFieldProps={{ placeholder: "..." }}
    />

  )
}

const Note = memo(({ entryKey, state, setEntry, removeEntry }) => {

  const { lastModified, title, type } = state
  const handleTitleChange = (newValue) => {
    setEntry(entryKey, {
      ...state,
      title: newValue,
      lastModified: getTimestamp()
    })
  }
  const BodyComponent = (type === "table") ? TabularNoteBody : TextualNoteBody

  const handleDelete = () => { removeEntry(entryKey) }

  return (
    <ForegroundPaper sx={{ p: 1, pl: 2 }}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div style={{ flexGrow: 1 }}>
            <EditableInput
              value={title}
              onChange={handleTitleChange}
              Component={Typography}
              componentProps={{ variant: "h5" }}
            />
            {/* <Typography variant="h5">{title}</Typography> */}
            <Typography color="text.secondary"><DateElem timestamp={lastModified} /></Typography>
          </div>
          <div>
            <DeleteButton onClick={handleDelete} />
          </div>
        </Stack>
        <Divider />
        <BodyComponent entryKey={entryKey} state={state} setEntry={setEntry}
          handleDelete={handleDelete}
        />
      </Stack>
    </ForegroundPaper>
  )
})

const extractEntries = (entries, search) => {
  let selected
  if (search === "") {
    selected = Object.entries(entries).filter(
      ([key, value]) => (
        value !== null
        && !value.deleted
      )
    )
  } else {
    selected = Object.entries(entries).filter(
      ([key, value]) => (
        value !== null
        && !value.deleted
        && (
          value.title.toLowerCase().includes(search.toLowerCase())
          || (value.type !== "table" && value.content.toLowerCase().includes(search.toLowerCase()))
        )
      )
    )
  }
  selected.sort(([key1, value1], [key2, value2]) => { return value2.lastModified - value1.lastModified })
  return selected
}
export const Notes = () => {
  const { switchActiveTab } = useTransientSettings()
  const { entries, setEntry, addEntry, removeEntry } = useSyncEntriesStore(
    {
      name: "notes",
      initData: {}
    }
  )
  const [search, setSearch] = useState(() => "")
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const extractedEntries = extractEntries(entries, search)

  const addEmptyEntry = () => addEntry({
    title: "New note",
    content: "",
    lastModified: getTimestamp(),
    isDraft: true,
    type: "note",
  })
  const addEmptyTabularEntry = () => addEntry({
    title: "New table",
    columns: ["Name", "Value"],
    rows: [],
    lastModified: getTimestamp(),
    type: "table",
  })

  return (
    <BackgroundPaper>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography component="h1" variant="h3">Notes</Typography>

            <IconButton onClick={addEmptyEntry}><AddBoxIcon /></IconButton>
            <IconButton onClick={addEmptyTabularEntry}><TableViewIcon /></IconButton>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={switchActiveTab}>Show Journal</Button>
            <TextField label="search" value={search} onChange={handleSearchChange} />
          </Stack>
        </Stack>

        <Divider />
        <CardList>
          {
            extractedEntries.map(([entryKey, entry]) =>
              <Note
                key={entryKey}
                entryKey={entryKey}
                setEntry={setEntry}
                removeEntry={removeEntry}
                state={entry}
              />
            )
          }
        </CardList>
      </Stack>
    </BackgroundPaper>
  )
}
