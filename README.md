# Journal startpage

![screenshot](./assets/screenshot.png)


This browser extension provides a startpage with productivity tools.  [Try it !](https://sapristi.github.io/journal-startpage/index.html)

Tools:
 - journal
 - notes (textual or tabular)
 - tasks
 - display calendar

It uses your browser sync storage, so that your data is safely backed-up.

- [Mozilla add-on](https://addons.mozilla.org/fr/firefox/addon/journal-startpage/)


Inspired by [Elegant New Tab](https://addons.mozilla.org/en-US/firefox/addon/elegant-startage-new-tab/)

## Roadmap

### Todo

- **Short term:**
  - bookmarks
  - Reorder tasks
  - double click to delete entry
  - improve apperance customization:
     - background color (different than paper color)
     - blur
     - roundness ?
     - also better defaults

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

# Develop

Run:

- `pnpm start` to run in develop mode (using localStorage instead of sync storage, because it cannot register as an extension this way)
- `pnpm build:dev` to build development version of the extension
- `pnpm build` to build the production assets
