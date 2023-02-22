const mockBookmarks = [{
  "id": "root________",
  "title": "",
  "type": "folder",
  "children": [
    {
      "id": "menu________",
      "title": "Bookmarks Menu",
      "type": "folder",
      "children": [
        {
          "id": "folder_journal",
          "title": "Journal Startpage",
          "type": "folder",
          "children": [
            {
              "id": "Q7fnJC-tmZji",
              "title": "Firefox",
              "type": "bookmark",
              "url": "https://www.mozilla.org/fr/firefox/new/",
            },
            {
              "id": "IwSn26weZvae",
              "title": "",
              "type": "separator",
              "url": "data:",
            },
            {
              "id": "folder_test",
              "title": "Test folder",
              "type": "folder",
              "children": []
            },
            {
              "id": "b1",
              "title": "Youtube",
              "type": "bookmark",
              "url": "https://www.youtube.com/",
            },
            {
              "id": "b2",
              "title": "Reddit",
              "type": "bookmark",
              "url": "https://www.reddit.com/",
            },
            {
              "id": "b3",
              "title": "Discord",
              "type": "bookmark",
              "url": "https://discord.com/app",
            },
            {
              "id": "b4",
              "title": "Mastodon",
              "type": "bookmark",
              "url": "https://mastodon.social/explore",
            },
            {
              "id": "b5",
              "title": "Stackoverflow",
              "type": "bookmark",
              "url": "https://stackoverflow.com/",
            },

          ]
        },
        {
          "id": "IwSn26weZvae",
          "title": "",
          "type": "separator",
          "url": "data:",
        },
      ]
    },
  ]
}]



const makeBookmarksAdapter = () => {
  const getTree = () => {
    return new Promise(resolve => {
      resolve(mockBookmarks)
    })
  }
  const getSubTreeInner = (id, tree) => {
    if (tree.id === id) {return tree}
    if (tree.type === "folder") {
      for (const child of tree.children) {
        const childRes = getSubTreeInner(id, child)
        if (childRes != null) {return childRes}
      }
    }
    return null
  }
  const getSubTree = (id) => {
    return new Promise(resolve => {
      const res = getSubTreeInner(id, mockBookmarks[0])
      resolve(res)
    })

  }
  return {getTree, getSubTree}
}

const getBookmarksApi = () => {
  if (process.env.REACT_APP_MOCK_BOOKMARKS === "true") {
    return makeBookmarksAdapter()
  } else {
    /* eslint-disable */
    return browser.bookmarks
    /* eslint-enable */
  }
}

export const bookmarksApi = getBookmarksApi()

const extractFoldersRec = (treeItem,  result) => {

  if (treeItem.type === "folder") {
    result.push(treeItem)
    for (const child of treeItem.children) {
      extractFoldersRec(child, result)
    }
  }
}
export const extractFolders = (tree) => {
  const result = []
  extractFoldersRec(tree, result)
  return result
}
