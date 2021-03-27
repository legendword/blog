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

##### Current Version: v0.1.1 (Public Beta)

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
Download **Legendword.Blog-[version]-darwin-x64.zip** below and unzip it. Move `Legendword Blog.app` to your `~/Applications` folder.
#### Windows
Download **Legendword.Blog-[version]-win32-x64.zip** below and unzip it. Move all files in the directory to your `Program Files` folder. Create a shortcut for the executable file `Legendword Blog.exe`. You can now run the application using this shortcut.
#### Linux
Download **Legendword.Blog-[version]-linux-x64.zip** below and unzip it. Run `Legendword Blog`.


## Debugging/Developing the project on your local machine

### Learn about the libraries used

This project uses [Quasar](https://quasar.dev/), [Quasar CLI](https://quasar.dev/quasar-cli/), [Axios](https://github.com/axios/axios), [Vue i18n](https://kazupon.github.io/vue-i18n/), and [MarkDownItVue](https://github.com/ravenq/markdown-it-vue).

### Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```
