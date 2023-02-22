import {useEffect, useState} from 'react'
import { Stack, Link} from '@mui/material';
import {ForegroundPaper} from 'components/base'
import {useSettingsStore} from 'stores/settings'
import {makeLogger } from 'utils'
import {bookmarksApi} from 'utils/bookmarks_adapter'


const log = makeLogger("bookmarks")


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
      bookmarksApi.getSubTree(bookmarksFolder).then(
        bookmarks => {
          log("BOOKMARKS", bookmarks)
          if (bookmarks === null) {setBookmarks([]); return}
          const selectedChildren = bookmarks.children.filter(
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
      {
        bookmarks.map(bookmark =>
          <Bookmark key={bookmark.id} title={bookmark.title} url={bookmark.url}/>
        )
      }
    </Stack>
  )
}
