import { makeSyncEntriesStore } from 'utils/make_sync_entries_store'
import { getTimestamp } from 'utils'

const initData = {}


const {
  useStore: useNotesStore,
  setEntry: setNote,
  addEntry: addNote,
  removeEntry: removeNote,
  getEntries: getNoteEntries,
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

const selectEntries = ({entries, search, maxShown}) => {
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
  return {
    selectedEntries: selected.slice(0, maxShown),
    hasMore: maxShown < Object.keys(selected).length
  }
}


const editLastNote = () => {
  getNoteEntries(
    entries => {
      const [firstKey, firstEntry] = selectEntries(entries, "")[0]
      if (firstEntry.type !== "note") {return}
      setNote(firstKey, {...firstEntry, isDraft: true})
    }
  )
}

export {
  useNotesStore,
  addEmptyNote,
  addEmptyTabularNote,
  setNote,
  removeNote,
  selectEntries,
  editLastNote,
}
