const mockBookmarks = [{
  "id": "root________",
  "title": "",
  "index": 0,
  "dateAdded": 1664713841404,
  "type": "folder",
  "dateGroupModified": 1676487364574,
  "children": [
    {
      "id": "menu________",
      "title": "Bookmarks Menu",
      "index": 0,
      "dateAdded": 1664713841404,
      "type": "folder",
      "parentId": "root________",
      "dateGroupModified": 1664713841670,
      "children": [
        {
          "id": "tHj2BMXWj2yO",
          "title": "Journal Startpage",
          "index": 0,
          "dateAdded": 1570993025970,
          "type": "folder",
          "parentId": "menu________",
          "dateGroupModified": 1670792585000,
          "children": [
            {
              "id": "Q7fnJC-tmZji",
              "title": "Firefox",
              "index": 0,
              "dateAdded": 1664478595712,
              "type": "bookmark",
              "url": "https://www.mozilla.org/fr/firefox/new/",
              "parentId": "tHj2BMXWj2yO"
            },
            {
              "id": "IwSn26weZvae",
              "title": "",
              "index": 5,
              "dateAdded": 1528576183846,
              "type": "separator",
              "url": "data:",
              "parentId": "menu________"
            },
            {
              "id": "tHj2BMXWj2yO",
              "title": "Test folder",
              "index": 0,
              "dateAdded": 1570993025970,
              "type": "folder",
              "parentId": "menu________",
              "dateGroupModified": 1670792585000,
              "children": []
            },
            {
              "title": "Youtube",
              "type": "bookmark",
              "url": "https://www.youtube.com/",
            },
            {
              "title": "Reddit",
              "type": "bookmark",
              "url": "https://www.reddit.com/",
            },
            {
              "title": "Discord",
              "type": "bookmark",
              "url": "https://discord.com/app",
            },
            {
              "title": "Mastodon",
              "type": "bookmark",
              "url": "https://mastodon.social/explore",
            },
            {
              "title": "Stackoverflow",
              "type": "bookmark",
              "url": "https://stackoverflow.com/",
            },

          ]
        },
        {
          "id": "IwSn26weZvae",
          "title": "",
          "index": 5,
          "dateAdded": 1528576183846,
          "type": "separator",
          "url": "data:",
          "parentId": "menu________"
        },
        {
          "id": "tLYEl7uW6JDj",
          "title": "",
          "index": 11,
          "dateAdded": 1519979270582,
          "type": "separator",
          "url": "data:",
          "parentId": "menu________"
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
  return {getTree}
}

export const getBookmarksApi = () => {
  if (process.env.REACT_APP_MOCK_BOOKMARKS === "true") {
    return makeBookmarksAdapter()
  } else {
    /* eslint-disable */
    return browser.bookmarks
    /* eslint-enable */
  }
}
