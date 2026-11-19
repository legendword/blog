import { app, BrowserWindow, session, shell } from "electron";
import path from "node:path";
import os from "node:os";
import {
    registerQuasarRuntime,
    resolveElectronAssetsPath
} from "#q-app/electron/main";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

// The only schemes a link inside the app may hand over to the operating system.
const EXTERNAL_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);

/**
 * Posts are written by other people. Links in them must never load inside the
 * app window (which talks to the blog API with the user's session); they are
 * opened in the user's default browser instead.
 */
function openExternally (url) {
    try {
        if (EXTERNAL_PROTOCOLS.has(new URL(url).protocol)) {
            void shell.openExternal(url);
        }
    }
    catch {
        // not a URL: ignore
    }
}

function isAppUrl (url) {
    try {
        const target = new URL(url);
        if (import.meta.env.QUASAR_DEV) {
            return target.origin === new URL(import.meta.env.QUASAR_APP_URL).origin;
        }
        return target.protocol === "file:";
    }
    catch {
        return false;
    }
}

async function createWindow () {
    /**
     * Initial window options
     */
    const mainWindow = new BrowserWindow({
        icon: resolveElectronAssetsPath("icons/icon.png"), // Windows and Linux
        width: 1000,
        height: 600,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            sandbox: true,
            webSecurity: true,
            webviewTag: false,
            // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.join(import.meta.dirname, "electron-preload.cjs")
        }
    });

    // window.open() / target="_blank": never create another app window
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        openExternally(url);
        return { action: "deny" };
    });

    // the window itself only ever shows the app
    mainWindow.webContents.on("will-navigate", (event, url) => {
        if (!isAppUrl(url)) {
            event.preventDefault();
            openExternally(url);
        }
    });

    if (import.meta.env.QUASAR_DEV) {
        await mainWindow.loadURL(import.meta.env.QUASAR_APP_URL);
    }
    else {
        await mainWindow.loadFile("index.html");
    }

    if (import.meta.env.QUASAR_DEBUG) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools();
    }
    else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on("devtools-opened", () => {
            mainWindow.webContents.closeDevTools();
        });
    }
}

// no embedded <webview> content, ever
app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (attachEvent) => {
        attachEvent.preventDefault();
    });
});

void app.whenReady().then(() => {
    registerQuasarRuntime();

    // the blog needs no camera, microphone, location, notifications, ...
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        callback(false);
    });
    session.defaultSession.setPermissionCheckHandler(() => false);

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (platform !== "darwin") {
        app.quit();
    }
});
