<p align="center">
  <img width="256" height="256" src="https://raw.githubusercontent.com/legendword/blog/main/public/favicon.ico" />
</p>

<h1 align="center">
  Legendword Blog (WordBlog)
</h1>

<p align="center">
  <img src="https://img.shields.io/github/downloads/legendword/blog/total" />
  <img src="https://img.shields.io/github/commits-since/legendword/blog/latest?include_prereleases" />
  <img src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Fblog.legendword.com" />
</p>


Legendword Blog is an elegant, open-source blog system by Legendword, built with Quasar.

Feel free to use any of the component settings, layouts, and styles in your own projects. Issues and feature requests can be posted in the [Issues page](https://github.com/legendword/blog/issues).

## Using the platform

Access Legendword Blog here: [https://blog.legendword.com/](https://blog.legendword.com/)

### Desktop and Mobile Clients

Because it is responsive and built with Quasar, Legendword Blog is optimized for all kinds of screens.

Currently supported platforms: **MacOS, Windows, Linux**, iOS*

*: iOS app will be published to the App Store in a future release.

[View the latest release](https://github.com/legendword/blog/releases/latest)

### Key Features:
- User Accounts: Set custom username and create an author profile linked to the user.
- Posts: View posts (articles), and compose posts using a custom-made Markdown editor.
- Authors: Follow your favourite authors and see their new posts in the Following page.
- Categories and Tags: Each post falls under a category and has optional tags. You can browse posts by category or tag.
- Collections: Bookmark posts by adding them to a collection of yours. You can create multiple collections, and decide if you want the collection to be public. Share your collection by sending the collection URL to others.
- Comments: Comment on posts in the comment section. You can like others' comments or reply to a comment.
- Creator Tools: See total view, follower, and comment count in the Overview tab. Manage or add posts in the Posts tab. View newest comments in the Comments tab.
- Multi-Language Support: Set your preferred interface language in the User Settings page.

### How to Install:

To download files, go to [Releases](https://github.com/legendword/blog/releases).

#### Web App
You can access the Legendword Blog Web App from anywhere with a browser. The URL of the Web App is [https://blog.legendword.com](https://blog.legendword.com)
#### MacOS
Download **Legendword.Blog-[version]-darwin-x64.zip** and unzip it. Move `Legendword Blog.app` to your `~/Applications` folder.
#### Windows
Download **Legendword.Blog-[version]-win32-x64.zip** and unzip it. Move all files in the directory to your `Program Files` folder. Create a shortcut for the executable file `Legendword Blog.exe`. You can now run the application using this shortcut.
#### Linux
Download **Legendword.Blog-[version]-linux-x64.zip** and unzip it. Run `Legendword Blog`.


## Debugging/Developing the project on your local machine

### Requirements

Node.js 22.22 or newer (24 and 26 are supported as well) and npm.

### Libraries Used

This project uses [Quasar 2](https://quasar.dev/) with [Quasar CLI (Vite)](https://quasar.dev/quasar-cli-vite/), [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), [Pinia](https://pinia.vuejs.org/), [Axios](https://github.com/axios/axios) and [Vue i18n](https://vue-i18n.intlify.dev/).

Posts are rendered with [markdown-it](https://github.com/markdown-it/markdown-it) and sanitized with [DOMPurify](https://github.com/cure53/DOMPurify); formulas, diagrams and charts use [KaTeX](https://katex.org/), [mermaid](https://mermaid.js.org/), [Apache ECharts](https://echarts.apache.org/) and [flowchart.js](https://flowchart.js.org/). See [docs/markdown.md](docs/markdown.md) for the supported syntax and for the rules to follow when changing the renderer.

### Install Dependencies
```bash
npm install
```

The lock files (`package-lock.json` here and in `src-pwa`, `src-electron` and `src-capacitor`) are committed. Use `npm ci` for reproducible installs and run `npm audit` after changing dependencies.

The `overrides` entries in `package.json` and `src-pwa/package.json` pin patched releases of two transitive build/test packages (`glob`, `minimatch`). Remove them once `workbox-build` and `js-beautify` depend on fixed versions themselves.

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npx quasar dev                    # web app
npx quasar dev -m pwa             # progressive web app
npx quasar dev -m electron        # desktop app
npx quasar dev -m capacitor -T ios
```

### Lint and test
```bash
npm run lint:check
npm run test:unit
npm run test:e2e:ci
```

### Build the app for production
```bash
npx quasar build                  # web app, output in dist/spa
npx quasar build -m pwa
npx quasar build -m electron
npx quasar build -m capacitor -T ios
```
