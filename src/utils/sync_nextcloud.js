import {makeLogger} from 'utils'
import {useSettingsStore, useTransientSettings} from 'stores'
import {getNoteEntriesAsync, updateNote, removeNote} from 'stores/notes'
import { checkUrlPermission } from 'utils/perms_adapter'
import {PermSnackBarMessage} from 'components/base'

const log = makeLogger("NextCloud sync")

const NCCAT = 'journal-notes'

const nextCloud = (baseURL, credentials) => {
  const headers =  {
    Authorization: `Basic ${btoa(credentials)}`,
    "Origin": window.origin
  }
  const listNotes = async () => {
    const url = `${baseURL}/index.php/apps/notes/api/v1/notes?`

    const params =  new URLSearchParams({
      category: NCCAT,
      exclude: "content,title,category,favorite",
    })

    const result = await fetch(url + params, {
      headers,
    } ).then(response => response.json())
    return result
  }

  const getNote = async (ncId) => {
    const url = `${baseURL}/index.php/apps/notes/api/v1/notes/${ncId}`
    return await fetch(url, {headers}).then(response => response.json())
  }

  const makeNote = async (data) => {
    const url = `${baseURL}/index.php/apps/notes/api/v1/notes`
    const body = JSON.stringify({
      ...data,
      category: NCCAT,
    })
    return await fetch(url, {
      method: "POST",
      headers: {...headers, "Content-Type": "application/json"},
      body
    } ).then(response => response.json())

  }
  const updateNote = async (ncId, data) => {
    const url = `${baseURL}/index.php/apps/notes/api/v1/notes/${ncId}`
    const body = JSON.stringify(data)
    return await fetch(url, {
      method: "PUT",
      headers: {...headers, "Content-Type": "application/json"},
      body
    } ).then(response => response.json())
  }
  const deleteNote = async (ncId) => {
    const url = `${baseURL}/index.php/apps/notes/api/v1/notes/${ncId}`
    return await fetch(url, {
      method: "DELETE",
      headers,
    } ).then(response => response.json())
  }
  return {listNotes, makeNote, getNote, updateNote, deleteNote}
}




/* Sync algo
   ---------

If a note is local but not on cloud:
    if the note has never been synced
  then we sync it

    if last sync happened before the note last modif
  then we push the note on cloud
  else we remove the note from local

If a note is on cloud but not local:
    if last sync happened before the note last modif
  then we create the note in local
  else we remove the note from local

*/
const mergeNotes = async (NC) => {
  const local = await getNoteEntriesAsync()
  const cloud = await NC.listNotes()
  const nextcloudLastSync = useSettingsStore.getState().nextcloud.lastSync

  const cloudById = Object.fromEntries(cloud.map(note => [note.id, note]))
  const localCloudIds = new Set()
  for (let [noteId, note] of Object.entries(local)) {
    const noteModifiedSec = Math.trunc(note.lastModified / 1000)
    if (note.ncId) {
      localCloudIds.add(note.ncId)
      const cloudNote = cloudById[note.ncId]
      if (cloudNote) {
        log("NOTE", note, cloudNote)
        if (cloudNote.modified === noteModifiedSec) {
          log("Same modified, skip")
          continue
        }
        if (cloudNote.modified > noteModifiedSec) {
          const completeCloudNote = await NC.getNote(note.ncId)
          log("Cloud", completeCloudNote)
          updateNote(noteId, {
            title: completeCloudNote.title, content: completeCloudNote.content,
            lastModified: completeCloudNote.modified * 1000
          })
        } else {
          NC.updateNote(note.ncId, {title: note.title, content: note.content, modified: noteModifiedSec})
        }
      } else {
        // note was removed on server, deleting
        // This is a pretty safe delete, since we know the note has been synced, and
        // does not exist anymore on nextcloud
        removeNote(noteId)
      }
    } else {
      // note has never been synced -> we add it to nextCloud
      const noteRes = await NC.makeNote({title: note.title, content: note.content, modified: noteModifiedSec})
      if (noteRes.id) {
        log("Created note on cloud", noteRes)
        updateNote(noteId, {ncId: noteRes.id})
      } else {
        //FIXME notes failing to sync will be removed  !!
        log("Failed to create note", noteRes)
      }
    }
  }

  log("Local notes", localCloudIds)
  for (let ncId of Object.keys(cloudById)) {
    if (! localCloudIds.has(ncId)) {
      //  we can't differentiate right now between a note that was removed from local
      // or a note added to cloud - so we don't do anything

      // const note = await NC.getNote(ncId)
      // log("New note", note)
      // addNote({
      //   title: note.title,
      //   content: note.content,
      //   lastModified: note.modified * 1000,
      //   type: "note",
      //   ncId: ncId
      // })
    }
  }
}


export const syncNotes = async () => {

  const setSnackbar = useTransientSettings.getState().setSnackbar
  const {url, username, password} = useSettingsStore.getState().nextcloud
  const hasPerm = await checkUrlPermission(url)
  if (! hasPerm) {
    setSnackbar({
      message: <PermSnackBarMessage/>,
      severity: "warning"})
    return
  }

  const NC = nextCloud(url, `${username}:${password}`)
  mergeNotes(NC)
  useSettingsStore.setState({nextcloudLastSync: Date.now()})
}

