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
  removeEntry: removeJournalEntry
} = makeSyncEntriesStore("journal", initData)

const addEmptyJournalEntry = () => addJournalEntry({ isDraft: true, content: "" })

export {
  useJournalStore,
  setJournalEntry,
  addEmptyJournalEntry,
  removeJournalEntry
}
