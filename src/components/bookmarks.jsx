import {useEffect, useState} from 'react'
import {getBookmarksApi} from 'utils/bookmarks_adapter'
import { Stack, Link} from '@mui/material';
import {ForegroundPaper} from 'components/base'
import {useSettingsStore} from 'stores/settings'
import {makeLogger } from 'utils'


const log = makeLogger("bookmarks")

const bookmarksApi = getBookmarksApi()

const getSubTree = (tree, path) => {
  log("Tree", tree, path)
  if (path.length === 0) {return tree.children}
  const [child_title, ...path_tail] = path
  if (! tree.children) {return null}
  for (const child of tree.children) {
    if (child.title === child_title) {
      return getSubTree(child, path_tail)
    }
  }
  return null
}

export const Bookmark = ({title, url})=> {
  const imgSrc = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`
  return (
    <ForegroundPaper sx={{ padding: 1, height: "min-content"}}>
      <Link href={url}>
        {/* <Stack> */}
        <img src={imgSrc} alt={title}/>
          {/* <Typography variant="caption" sx={{}}> */}
          {/*   {title} */}
          {/* </Typography> */}
        {/* </Stack> */}
      </Link>
    </ForegroundPaper>
  )
}

export const Bookmarks = () => {
  const {bookmarksFolder} = useSettingsStore()
  const [bookmarks, setBookmarks] = useState([])
  useEffect(
    () => {
      bookmarksApi.getTree().then(

        bookmarks => {
          log("All Bookmarks", bookmarks)
          const allChildren = getSubTree(bookmarks[0], bookmarksFolder.split("/"))
          log("children", allChildren)
          if (! allChildren) return 
          const selectedChildren = allChildren.filter(
            child => child.type === "bookmark"
          )
          setBookmarks(selectedChildren)
        }
      )

    },
    [setBookmarks, bookmarksFolder]
  )

  if (!bookmarks) {return null}
  return (
    <Stack direction="row" sx={{flexWrap: "wrap", gap:2, rowGap: 2}} alignContent="center">
      {bookmarks.map(Bookmark)}
    </Stack>
  )
}
