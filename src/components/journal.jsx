import React, { useState, memo } from 'react';

import { Typography, Divider, Stack, TextField } from '@mui/material';

import { CardList, BackgroundPaper, ForegroundPaper, Button, DeleteButton, IconButton,  DateElem } from "./base"
import { EditableMarkdown } from "./editable"
import { displayDate } from 'utils/locales'
import { useLocalSettings } from "stores/local"
import { AddBoxIcon } from "icons"

import { useJournalStore,   setJournalEntry,
         addEmptyJournalEntry,
         removeJournalEntry,
         selectEntries,
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


export const Journal = () => {
  const { switchActiveTab } = useLocalSettings()
  const {entries} = useJournalStore()
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
            <Typography component="h1" variant="h3">Journal</Typography>
            <IconButton onClick={addEmptyJournalEntry}><AddBoxIcon /></IconButton>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={switchActiveTab}>Show Notes</Button>
            <TextField label="search" value={search} onChange={handleSearchChange} size="small"/>
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
