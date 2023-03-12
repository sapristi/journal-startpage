import { makeSyncEntriesStore } from 'utils/make_sync_entries_store'
import { getTimestamp, helpText } from 'utils'

const initData = {
  0: {
    date: getTimestamp(),
    content: "# Welcome to Journal Startpage !\n" + helpText
  }
}


const {
  useStore: useJournalStore,
  setEntry: setJournalEntry,
  addEntry: addJournalEntry,
  removeEntry: removeJournalEntry,
  getEntries: getJournalEntries,
} = makeSyncEntriesStore("journal", initData)

const addEmptyJournalEntry = () => addJournalEntry({ isDraft: true, content: "" })

const selectEntries = ({entries, search, maxShown}) => {
  const nonDeleted = Object.entries(entries).filter(
    ([key, value]) => (
      value !== null &&
        !value.deleted &&
        (!search || value.content.toLowerCase().includes(search.toLowerCase()))
    )
  )
  nonDeleted.sort(([key1, value1], [key2, value2]) => { return value2.date - value1.date })
  return {
    selectedEntries: nonDeleted.slice(0, maxShown),
    hasMore: maxShown < Object.keys(entries).length
  }
}

const editLastJournalEntry = () => {
  getJournalEntries(
    entries => {
      const [firstKey, firstEntry] = selectEntries(entries, "")[0]
      setJournalEntry(firstKey, {...firstEntry, isDraft: true})
    }
  )
}

export {
  useJournalStore,
  setJournalEntry,
  addEmptyJournalEntry,
  removeJournalEntry,
  selectEntries,
  editLastJournalEntry,
}
