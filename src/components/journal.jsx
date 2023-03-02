import React, { useState, memo } from 'react';

import { Typography, Divider, Stack, TextField } from '@mui/material';

import { CardList, BackgroundPaper, ForegroundPaper, Button, DeleteButton, IconButton } from "./base"
import { EditableMarkdown } from "./editable"
import { DateElem } from './date_elem'
import { displayDate } from 'utils/locales'
import { useTransientSettings } from "stores/transient"
import { AddBoxIcon } from "icons"

import { useJournalStore,   setJournalEntry,
         addEmptyJournalEntry,
         removeJournalEntry
 } from 'stores/journal'





const Entry = memo(({ entryKey, state }) => {

  const { date, content, isDraft } = state
  const handleContentChange = (newValue) => {
    setJournalEntry(entryKey, {
      ...state,
      content: newValue,
      isDraft: false,
    })
  }
  const handleDelete = () => { removeJournalEntry(entryKey) }

  return (
    <ForegroundPaper sx={{ p: 1, pl: 2 }}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h5">{displayDate(date)}</Typography>
            <Typography color="text.secondary"><DateElem timestamp={date} /></Typography>
          </div>
          <div>
            <DeleteButton onClick={handleDelete} />
          </div>
        </Stack>
        <Divider />
        <EditableMarkdown value={content} onChange={handleContentChange}
          isDraft={isDraft} handleCancelDraft={handleDelete}
          textFieldProps={{ placeholder: "Dear diary, today I..." }}
        />
      </Stack>
    </ForegroundPaper>
  )
})

const extractEntries = (entries, search) => {
  const nonDeleted = Object.entries(entries).filter(
    ([key, value]) => (
      value !== null &&
      !value.deleted && value.content.toLowerCase().includes(search.toLowerCase())
    )
  )
  nonDeleted.sort(([key1, value1], [key2, value2]) => { return value2.date - value1.date })
  return nonDeleted
}

export const Journal = () => {
  const { switchActiveTab } = useTransientSettings()
  const {entries} = useJournalStore()
  console.log("JOURNAL ENTRIES", entries)
  const [search, setSearch] = useState(() => "")
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const extractedEntries = extractEntries(entries, search)

  return (
    <BackgroundPaper>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography component="h1" variant="h3">Journal</Typography>
            <IconButton onClick={addEmptyJournalEntry}><AddBoxIcon /></IconButton>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={switchActiveTab}>Show Notes</Button>
            <TextField label="search" value={search} onChange={handleSearchChange} />
          </Stack>
        </Stack>
        <Divider />
        <CardList>
          {
            extractedEntries.map(([entryKey, entry]) =>
              <Entry
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
