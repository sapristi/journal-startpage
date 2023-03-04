# Journal startpage

![screenshot](./assets/screenshot.png)


This browser extension provides a startpage with productivity tools.  [Try it !](https://sapristi.github.io/journal-startpage/index.html)

Tools:
 - journal
 - notes (textual or tabular)
 - tasks
 - display calendar
 - show bookmarks from selected folder

Global shortcuts allow for keyboard-first usage.

It uses your browser sync storage, so that your data is safely backed-up, and can be shared between computers.

- [Mozilla add-on](https://addons.mozilla.org/fr/firefox/addon/journal-startpage/)


**Credit:**

- Inspired by [Elegant New Tab](https://addons.mozilla.org/en-US/firefox/addon/elegant-startage-new-tab/)
- Default wallpaper from https://www.publicdomainpictures.net/fr/view-image.php?image=85030&picture=blue-sunset-wallpaper

## Roadmap

### Todo

- **Short term:**
  - Reorder tasks
  - double click to delete entry

- **Long term**
  - rework journal:
    - allow to change date ?
    - integrate with calendar ?
  - integrate calendar (to show upcoming events)

### Done

- Customize colors
- improve calendar display
- handle multiple open tabs: data is not overriden
- select locale
- Search journal
- browser sync storage
- tabular notes
- bookmarks

# Develop

Run:

- `pnpm start` to run in develop mode (using localStorage instead of sync storage, because it cannot register as an extension this way)
- `pnpm build:dev` to build development version of the extension
- `pnpm build` to build the production assets
