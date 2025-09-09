import { app, BrowserWindow } from "electron"
import { electronApp, optimizer } from "@electron-toolkit/utils"
import { createAppWindow } from "./app"

app.whenReady().then(() => {
  electronApp.setAppUserModelId("org.secureal")
  createAppWindow()

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
