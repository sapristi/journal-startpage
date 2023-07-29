import { makeSyncEntriesStore } from "utils/make_sync_entries_store";

const initData = {
  0: {
    lastModified: 0,
    status: "todo",
    content: `
this is a task
- with some
- items
`,
  },
  1: {
    lastModified: 1,
    status: "done",
    content: `
this is done task
- with one item
`,
  },
};

const {
  useStore: useTasksStore,
  setEntry: setTask,
  addEntry: addTask,
  removeEntry: removeTask,
} = makeSyncEntriesStore("tasks", initData);

const addEmptyTask = () =>
  addTask({ status: "todo", content: "", isDraft: true });

export { useTasksStore, addEmptyTask, setTask, removeTask };
