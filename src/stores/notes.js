import { makeSyncEntriesStore } from 'utils/make_sync_entries_store'
import { getTimestamp } from 'utils'

const initData = {}


const {
  useStore: useNotesStore,
  setEntry: setNote,
  addEntry: addNote,
  removeEntry: removeNote
} = makeSyncEntriesStore("notes", initData)

const addEmptyNote = () => addNote({
  title: "New note",
  content: "",
  lastModified: getTimestamp(),
  isDraft: true,
  type: "note",
})

const addEmptyTabularNote = () => addNote({
  title: "New table",
  columns: ["Name", "Value"],
  rows: [],
  lastModified: getTimestamp(),
  type: "table",
})


export {
  useNotesStore,
  addEmptyNote,
  addEmptyTabularNote,
  setNote,
  removeNote,
}
