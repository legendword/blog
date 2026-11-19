import { defineConfig } from "cypress";

export default defineConfig({
    fixturesFolder: "test/cypress/fixtures",
    screenshotsFolder: "test/cypress/screenshots",
    videosFolder: "test/cypress/videos",
    video: true,
    e2e: {
        baseUrl: "http://localhost:8080/",
        specPattern: "test/cypress/integration/**/*.spec.js",
        supportFile: "test/cypress/support/index.js"
    }
});
