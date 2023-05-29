
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![license-shield]][license-url]




<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Journal Startpage</h3>

  <p align="center">
    Provides a startpage with productivity tools!
    <br />
    <br />
    <a href="https://sapristi.github.io/journal-startpage/index.html">View Demo</a>
    ·
    <a href="https://github.com/sapristi/journal-startpage/issues">Report Bug</a>
    ·
    <a href="https://github.com/sapristi/journal-startpage/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#develop">Develop</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#credits">Credits</a></li>

  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![product-screenshot]

### Tools:
-   Journal
-   Notes (textual or tabular)
-   Tasks
-   Display calendar
-   Show bookmarks from selected folder
-   Show future events from a caldav public link

Global shortcuts allow for keyboard-first usage.

It uses your browser sync storage, so that your data is safely backed-up, and can be shared between computers.
<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- INSTALLATION -->
## Installation

|[![](./assets/f.svg)](https://addons.mozilla.org/fr/firefox/addon/journal-startpage/)<br>Firefox|[![](./assets/c.svg)](https://chrome.google.com/webstore/detail/journal-startpage/bkafbgknnlmlmkhpbenogcjmcdhmieec)<br>Chrome|[![](./assets/e.svg)](https://chrome.google.com/webstore/detail/journal-startpage/bkafbgknnlmlmkhpbenogcjmcdhmieec)<br>Edge|
|:---:|:---:|:---:|
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Download](https://addons.mozilla.org/fr/firefox/addon/journal-startpage/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Download](https://chrome.google.com/webstore/detail/journal-startpage/bkafbgknnlmlmkhpbenogcjmcdhmieec) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Download](https://chrome.google.com/webstore/detail/journal-startpage/bkafbgknnlmlmkhpbenogcjmcdhmieec) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



<!-- ROADMAP -->
## Roadmap
- [x] Customize colors
- [x] Improve calendar display
- [x] Handle multiple open tabs: data is not overriden
- [x] Select locale
- [x] Search journal
- [x] Browser sync storage
- [x] Tabular notes
- [x] Bookmarks
- [x] Show events from calDAV calendar
- [ ] Short term:
  - [ ] Display total space usage
  - [ ] Reorder tasks
  - [ ] Double click to delete entry

- [ ] Long term:
    - [ ] Rework journal:
      - [ ] Allow to change date ?
      - [ ] Integrate with calendar ?  
    - [ ] Sync data:
      - [ ] Notion ?
      - [ ] Nextcloud notes ? 

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- DEVELOP -->
## Develop


- `pnpm start` to run in develop mode (using localStorage instead of sync storage, because it cannot register as an extension this way)
- `pnpm build:dev` to build development version of the extension
- `pnpm build` to build the production assets
<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CREDITS -->
## Credits

- Inspired by [Elegant New Tab](https://addons.mozilla.org/en-US/firefox/addon/elegant-startage-new-tab/)
- Default wallpaper from https://www.publicdomainpictures.net/fr/view-image.php?image=85030&picture=blue-sunset-wallpaper
- Readme template: https://github.com/othneildrew/Best-README-Template

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/sapristi/journal-startpage.svg?style=for-the-badge
[contributors-url]: https://github.com/sapristi/journal-startpage/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sapristi/journal-startpage.svg?style=for-the-badge
[forks-url]: https://github.com/sapristi/journal-startpage/network/members
[stars-shield]: https://img.shields.io/github/stars/sapristi/journal-startpage.svg?style=for-the-badge
[stars-url]: https://github.com/sapristi/journal-startpage/stargazers
[issues-shield]: https://img.shields.io/github/issues/sapristi/journal-startpage.svg?style=for-the-badge
[issues-url]: https://github.com/sapristi/journal-startpage/issues
[license-shield]: https://img.shields.io/github/license/sapristi/journal-startpage.svg?style=for-the-badge
[license-url]: https://github.com/sapristi/journal-startpage/blob/master/LICENSE
[product-screenshot]: ./assets/screenshot.png
