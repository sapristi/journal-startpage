import React, { useState, memo } from 'react';

import { Typography, Divider, Stack, TextField } from '@mui/material';
import { CardList, BackgroundPaper, ForegroundPaper, IconButton, Button, DeleteButton } from "components/base"
import { EditableMarkdown, EditableInput } from "components/editable"
import { DateElem } from 'components/date_elem'
import { getTimestamp } from 'utils'
import { useLocalSettings } from "stores/local"

import { TabularNoteBody } from "./table"
import { AddBoxIcon , IconTableAdd} from "icons"
import {
  useNotesStore,
  addEmptyNote,
  addEmptyTabularNote,
  setNote,
  removeNote,
  selectEntries,
} from 'stores/notes'

const TextualNoteBody = ({ entryKey, state, handleDelete }) => {
  const { content, isDraft } = state
  const handleContentChange = (newValue) => {
    setNote(entryKey, {
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

const Note = memo(({ entryKey, state }) => {

  const { lastModified, title, type } = state
  const handleTitleChange = (newValue) => {
    setNote(entryKey, {
      ...state,
      title: newValue,
      lastModified: getTimestamp()
    })
  }
  const BodyComponent = (type === "table") ? TabularNoteBody : TextualNoteBody

  const handleDelete = () => { removeNote(entryKey) }

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
        <BodyComponent entryKey={entryKey} state={state}
                       handleDelete={handleDelete}
        />
      </Stack>
    </ForegroundPaper>
  )
})

export const Notes = () => {
  const { switchActiveTab } = useLocalSettings()
  const {entries} = useNotesStore()
  const [search, setSearch] = useState(() => "")
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const extractedEntries = selectEntries(entries, search)

  return (
    <BackgroundPaper>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography component="h1" variant="h3">Notes</Typography>

            <IconButton onClick={addEmptyNote}><AddBoxIcon /></IconButton>
            <IconButton onClick={addEmptyTabularNote}><IconTableAdd /></IconButton>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={switchActiveTab}>Show Journal</Button>
            <TextField label="search" value={search} onChange={handleSearchChange} size="small"/>
          </Stack>
        </Stack>

        <Divider />
        <CardList>
          {
            extractedEntries.map(([entryKey, entry]) =>
              <Note
                key={entryKey}
                entryKey={entryKey}
                state={entry}
              />
            )
          }
        </CardList>
      </Stack>
    </BackgroundPaper>
  )
}
