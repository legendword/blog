import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import pluginQuasar from "@quasar/app-vite/eslint";

export default [
    {
        /**
         * Ignore the following files.
         * Please note that pluginQuasar.configs.recommended() already ignores
         * the "node_modules" folder for you (and all other Quasar project
         * relevant folders and files).
         *
         * ESLint requires "ignores" key to be the only one in this object
         */
        ignores: [
            "src-capacitor/**",
            "src-electron/dist/**"
        ]
    },

    ...pluginQuasar.configs.recommended(),
    js.configs.recommended,

    /**
     * https://eslint.vuejs.org
     *
     * pluginVue.configs["flat/essential"]
     *   -> base, plus rules to prevent errors or unintended behavior.
     */
    ...pluginVue.configs["flat/essential"],

    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                ...globals.browser,
                ...globals.node, // Electron, config files
                process: "readonly", // process.env.*
                cordova: "readonly",
                Capacitor: "readonly"
            }
        },

        rules: {
            "no-undef": "warn",
            "no-unused-vars": "warn",
            "vue/multi-word-component-names": "off",
            "vue/no-unused-components": "warn",
            "indent": [
                "error",
                4
            ],
            "linebreak-style": [
                "error",
                "unix"
            ],
            "quotes": [
                "error",
                "double"
            ],
            "semi": [
                "error",
                "always"
            ]
        }
    },

    {
        files: ["src-pwa/sw/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.serviceworker
            }
        }
    },

    {
        files: ["test/cypress/**/*.js", "cypress.config.js"],
        languageOptions: {
            globals: {
                cy: "readonly",
                Cypress: "readonly",
                describe: "readonly",
                it: "readonly",
                beforeEach: "readonly",
                expect: "readonly"
            }
        }
    }
];
