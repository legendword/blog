# The Mixins, Explained

## mixins/requireLoggedIn.js

1. Imports the NeedToLogIn component for use in `<template>`

2. Adds `isLoggedIn` to the computed

3. Watches changes to `isLoggedIn` to trigger `init()` method

**IMPORTANT: to use this mixin, make sure to have an `init()` method in the component that triggers initial data fetching.**

This was implemented as part of the fix to [Issue #18](https://github.com/legendword/blog/issues/18).
