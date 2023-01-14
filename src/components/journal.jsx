import React from 'react';

import {EditableMarkdown} from "./editable"
import { DateElem, displayDate} from '../utils'

import ClearIcon from '@mui/icons-material/Clear';
import {Paper, Typography, Button, Divider, Link} from '@mui/material';
import {MainPaper, CardList, HFlex} from "./base"
import {useJournalStore} from '../stores/journal'


const Entry = ({creationDate, content}) => {
  const editEntry = useJournalStore((state) => state.editEntry)
  const removeEntry = useJournalStore((state) => state.removeEntry)

  const handleContentChange = (newValue) => {
    editEntry(creationDate, "content", newValue)
  }

  return (
    <Paper elevation={8} sx={{p: 1, pl: 2}}>
      <HFlex style={{justifyContent: "space-between"}}>
        <div>
          <Typography variant="h5">{displayDate(creationDate)}</Typography>
          <Typography color="text.secondary"><DateElem timestamp={creationDate}/></Typography>
        </div>
        <div>
          <Button onClick={() => removeEntry(creationDate)}><ClearIcon/></Button>
        </div>
      </HFlex>
      <Divider/>
      <EditableMarkdown value={content} onChange={handleContentChange}/>

    </Paper>
  )
}

export const Journal = () => {
  const entries = useJournalStore((state) => state.entries)
  const addEntry = useJournalStore((state) => state.addEntry)

  const addEmptyEntry = () => addEntry({content: "Dear diary, today I ..."})
  return (
    <MainPaper>
      <Link/>
      <Typography variant="h3">Journal</Typography>
      <Button onClick={addEmptyEntry}>Add entry</Button>
      <CardList>
        {
          entries.map( (entry, i) => <Entry key={entry.creationDate} {...entry}/>)
        }
      </CardList>
    </MainPaper>
  )
}
