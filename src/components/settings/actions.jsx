import { saveFile, filterObject, makeLogger } from "utils";
import { storage } from "utils/storage_adapter";
import { FileUpload } from "components/file_upload";
import { Button } from "components/base";

const log = makeLogger("Actions");

export const DataExport = () => {
  const handleJournalExport = () => {
    storage.get(null, (obj) => {
      log("GOT", obj);
      const selectedEntries = filterObject(
        obj,
        ([key, value]) =>
          key.startsWith("journal-") ||
          key.startsWith("notes-") ||
          key.startsWith("tasks-"),
      );
      log("entries", selectedEntries);
      const blob = new Blob([JSON.stringify(selectedEntries)], {
        type: "application/json",
      });
      const dateStr = new Date().toISOString().replaceAll(":", "-");
      saveFile(`journal-startpage-${dateStr}.json`, blob);
    });
  };
  return (
    <Button onClick={handleJournalExport} variant="contained">
      Export data
    </Button>
  );
};

export const DataImport = () => {
  const handler = ({ name, content }) => {
    const entries = JSON.parse(content);
    console.log(`Read json file '${name}'`);
    const selectedEntries = filterObject(
      entries,
      ([key, value]) =>
        key.startsWith("journal-") ||
        key.startsWith("notes-") ||
        key.startsWith("tasks-"),
    );
    // const wrongEntries = filterObject(entries, ([key, value])  => !key.startsWith("journal-"))
    // const wrongKeys = Object.keys(wrongEntries)
    // if (wrongKeys.length > 0) {
    //   console.warn("JSON file contains unsupported entries: ", wrongKeys)
    // }
    console.log(
      `Found ${Object.keys(selectedEntries).length} entries to import`,
    );
    storage.set(selectedEntries);
  };

  return (
    <FileUpload
      id="data-import"
      label="Import  data"
      accept="application/json"
      handler={handler}
      readerMethod="readAsBinaryString"
      buttonProps={{ variant: "contained", sx: { width: "100%" } }}
    />
  );
};
