import { defineConfig, mergeConfig } from "vitest/config";
import { quasarViteTestingConfig } from "@quasar/quasar-app-extension-testing-unit-vitest/config";

// https://vitest.dev/config/
export default defineConfig(async () =>
    mergeConfig(await quasarViteTestingConfig(), {
        test: {
            environment: "jsdom",
            setupFiles: "test/vitest/setup-file.js",
            include: [
                // Matches vitest tests in any subfolder of "src" or into "test/vitest/__tests__"
                "src/**/*.vitest.{test,spec}.{js,mjs,cjs}",
                "test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs}"
            ],
            coverage: {
                reportsDirectory: "test/vitest/coverage",
                include: ["src/**/*.{js,vue}"]
            }
        }
    })
);
