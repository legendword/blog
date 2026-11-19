// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from "#q-app";

export default defineConfig((/* ctx */) => {
    return {
        // app boot file (/src/boot)
        // --> boot files are part of "main.js"
        // https://v2.quasar.dev/quasar-cli-vite/boot-files
        boot: [
            "i18n",
            "notify",
            "authentication"
        ],

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
        css: [
            "app.scss"
        ],

        // https://github.com/quasarframework/quasar/tree/dev/extras
        extras: [
            "ionicons-v4",
            "material-icons-outlined",

            "roboto-font", // optional, you are not bound to it
            "material-icons" // optional, you are not bound to it
        ],

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
        build: {
            target: {
                // browser: "baseline-widely-available",
                // node: "node22"
            },

            vueRouterMode: "history", // available values: "hash", "history"

            // the app is written with the Options API
            vueOptionsAPI: true
        },

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
        devServer: {
            https: false,
            port: 8080,
            open: true // opens browser window automatically
        },

        // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
        framework: {
            iconSet: "material-icons", // Quasar icon set
            lang: "en-US", // Quasar language pack
            config: {
                dark: false,
                screen: {
                    bodyClasses: true
                }
            },

            // Quasar plugins
            plugins: [
                "Dialog",
                "LocalStorage",
                "Meta",
                "Notify"
            ]
        },

        // https://v2.quasar.dev/options/animations
        animations: "all",

        // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
        pwa: {
            workboxMode: "GenerateSW" // "GenerateSW" or "InjectManifest"
        },

        // https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
        capacitor: {
            hideSplashscreen: true
        },

        // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
        electron: {
            // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
            preloadScripts: [ "electron-preload" ],

            // specify the debugging port to use for the Electron app when running in development mode
            inspectPort: 5858,

            bundler: "packager", // "packager" or "builder"

            packager: {
                // https://electron.github.io/packager/main/interfaces/Options.html
                platform: "all"
            },

            builder: {
                // https://www.electron.build/configuration
                appId: "blog"
            }
        }
    };
});
