import { useEffect, useState } from "react";
import { Stack, Link } from "@mui/material";
import { ForegroundPaper } from "components/base";
import { useSettingsStore } from "stores/settings";
import { makeLogger } from "utils";
import { bookmarksApi, createFaviconURL } from "utils/bookmarks_adapter";

const log = makeLogger("bookmarks");

export const Bookmark = ({ title, url }) => {
  return (
    <ForegroundPaper sx={{ padding: 1, height: "min-content" }}>
      <Link href={url}>
        <img src={createFaviconURL(url)} alt={title} />
      </Link>
    </ForegroundPaper>
  );
};

export const Bookmarks = () => {
  const { bookmarksFolder } = useSettingsStore();
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => {
    bookmarksApi.getSubTree(bookmarksFolder).then((bookmarks) => {
      log("BOOKMARKS", bookmarks);
      if (bookmarks === null) {
        setBookmarks([]);
        return;
      }
      if (!bookmarks[0]) {
        log("MISSING BOOKMARK");
        return;
      }
      const selectedChildren = bookmarks[0].children.filter((child) =>
        Boolean(child.url),
      );
      setBookmarks(selectedChildren);
    });
  }, [setBookmarks, bookmarksFolder]);

  if (!bookmarks) {
    return null;
  }
  return (
    <Stack
      direction="row"
      sx={{ flexWrap: "wrap", gap: 2, rowGap: 2 }}
      alignContent="center"
    >
      {bookmarks.map((bookmark) => (
        <Bookmark key={bookmark.id} title={bookmark.title} url={bookmark.url} />
      ))}
    </Stack>
  );
};
