import { app, type BrowserWindow } from "electron"
import { handle } from "@/lib/main/shared"
import ping from "ping"

export const registerAppHandlers = (_window: BrowserWindow) => {
  // App operations
  handle("version", () => app.getVersion())
  handle("pingServer", (host: string) => {
    return ping.promise
      .probe(host, { timeout: 2 })
      .then((res) => ({
        alive: res.alive,
        // Only return a number if res.time is a valid number
        time: res.time !== "unknown" && !isNaN(Number(res.time)) ? Number(res.time) : null,
      }))
      .catch((err: any) => ({
        alive: false,
        time: null,
        error: err.message,
      }))
  })
}
