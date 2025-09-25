import { BrowserWindow, shell, app } from "electron"
import { join } from "path"
import appIcon from "@/resources/build/icon.png?asset"
import { registerResourcesProtocol } from "./protocols"
import { registerWindowHandlers } from "@/lib/conveyor/handlers/window-handler"
import { registerAppHandlers } from "@/lib/conveyor/handlers/app-handler"

export function createAppWindow(): void {
  registerResourcesProtocol()

  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 790,
    show: false,
    backgroundColor: "#1c1c1c",
    icon: appIcon,
    frame: false,
    titleBarStyle: "hiddenInset",
    title: "Secureal",
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
      sandbox: false,
    },
  })

  registerWindowHandlers(mainWindow)
  registerAppHandlers(mainWindow)

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }
}
