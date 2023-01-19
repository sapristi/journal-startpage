# Journal startpage

![screenshot](./assets/screenshot.png)


This browser extension provides a journal and todo apps in the startpage of your browser. [Try it !](https://sapristi.github.io/journal-startpage/index.html)

- [Mozilla add-on](https://addons.mozilla.org/fr/firefox/addon/journal-startpage/)

Inspired by [Elegant New Tab](https://addons.mozilla.org/en-US/firefox/addon/elegant-startage-new-tab/)

## Roadmap

### Todo

- Reorder tasks
- rework journal:
  - ~~limit to one entry per day ?~~ -> rather display time as well as date
  - allow to change date 
  - integrate with calendar
- double click to delete entry
- firefox sync
- integrate calendar (to show upcoming events)

### Done

- Customize colors
- improve calendar display
- handle multiple open tabs: data is not overriden
- select locale
- Search journal

# Develop

Run:

- `pnpm start` to run in develop mode
- `pnpm build` to build the production assets
