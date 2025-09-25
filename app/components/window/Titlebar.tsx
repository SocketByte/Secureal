import { useEffect, useState } from "react"
import { useWindowContext } from "./WindowContext"
import { TitlebarMenu } from "./TitlebarMenu"
import { useConveyor } from "@/app/hooks/use-conveyor"
import {
  BellOff,
  Moon,
  Settings,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Sun,
  Unplug,
  UserPen,
  WifiOff,
} from "lucide-react"
import { useClientData } from "@/app/state/data.state"
import { cn } from "@/lib/utils"

function PingSignal({ ping, isDead, message }: { ping: number; isDead: boolean; message: string }) {
  if (isDead) {
    return (
      <div className={cn("flex flex-row gap-1 items-center", "text-red-500")}>
        <span>{message}</span>
        <WifiOff className="size-4 pb-[1px]" />
      </div>
    )
  }

  let ForegroundIcon = SignalLow
  let colorClass = "text-red-500"

  if (ping < 50) {
    ForegroundIcon = Signal
    colorClass = "text-green-500"
  } else if (ping < 100) {
    ForegroundIcon = SignalHigh
    colorClass = "text-green-500"
  } else if (ping < 200) {
    ForegroundIcon = SignalMedium
    colorClass = "text-yellow-500"
  } else {
    ForegroundIcon = SignalLow
    colorClass = "text-red-500"
  }

  return (
    <div className="flex flex-row gap-1 items-center">
      <span className={cn(colorClass)}>{ping}ms</span>
      <div className="relative">
        <Signal className="absolute text-secondary size-4 pb-[1px]" />
        <ForegroundIcon className={cn(colorClass, "size-4 pb-[1px] relative")} />
      </div>
    </div>
  )
}

const SVG_PATHS = {
  close: "M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z",
  maximize: "M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z",
  minimize: "M 0,5 10,5 10,6 0,6 Z",
} as const

export const Titlebar = () => {
  const { icon, titleCentered } = useWindowContext().titlebar
  const { window: wcontext } = useWindowContext()
  const [data] = useClientData()

  const [ping, setPing] = useState(1)
  const [isDead, setIsDead] = useState(false)
  const [serverMessage, setServerMessage] = useState("Unreachable")
  const [isDarkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"))

  const checkPing = async () => {
    const startTime = performance.now()

    try {
      const response = await fetch(`http://${data.serverAddress}:${data.serverPort}/ping`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.serverKey}`,
        },
      })

      if (response.status === 401) {
        setServerMessage("Unauthorized")
        setIsDead(true)
        return
      }

      if (response.status === 403) {
        setServerMessage("Forbidden")
        setIsDead(true)
        return
      }

      if (!response.ok) {
        setServerMessage("Server error")
        setIsDead(true)
        return
      }

      const text = await response.text()
      if (text !== "pong") {
        setServerMessage("Bad response")
        setIsDead(true)
        return
      }

      const endTime = performance.now()
      setPing(Math.round(endTime - startTime))
      setIsDead(false)
      setServerMessage("") // clear any previous error
    } catch (err) {
      console.error(err)
      setServerMessage("Unreachable")
      setIsDead(true)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (data.serverAddress) {
      checkPing()
      interval = setInterval(() => {
        checkPing()
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [data.serverAddress])

  return (
    <div className={`window-titlebar ${wcontext?.platform ? `platform-${wcontext.platform}` : ""}`}>
      {wcontext?.platform === "win32" && (
        <div className="window-titlebar-icon">
          <img src={icon} />
        </div>
      )}

      <div
        className="window-titlebar-title flex flex-row gap-4 items-center pt-0.5"
        {...(titleCentered && { "data-centered": true })}
        style={{ visibility: "visible" }}
      >
        <p className="font-medium text-xs">Secureal</p>
        <p className="font-normal text-xs">
          {data.serverAddress}
          {data.serverPort && ":" + data.serverPort}
        </p>
        <PingSignal ping={ping} isDead={isDead} message={serverMessage} />
        <div className="flex flex-row items-center gap-2 window-settings">
          <Settings className="text-muted-foreground size-4" />
          <UserPen className="text-muted-foreground size-4" />
          <Unplug className="text-muted-foreground size-4" />
          <BellOff className="text-muted-foreground size-4" />
          {!isDarkMode && (
            <Moon
              className="text-muted-foreground size-4 cursor-pointer"
              onClick={() => {
                setDarkMode(true)
                document.documentElement.classList.toggle("dark")
              }}
            />
          )}
          {isDarkMode && (
            <Sun
              className="text-muted-foreground size-4 cursor-pointer"
              onClick={() => {
                setDarkMode(false)
                document.documentElement.classList.toggle("dark")
              }}
            />
          )}
        </div>
      </div>

      {wcontext?.platform === "win32" && <TitlebarControls />}
    </div>
  )
}

const TitlebarControls = () => {
  const { window: wcontext } = useWindowContext()

  return (
    <div className="window-titlebar-controls">
      {wcontext?.minimizable && <TitlebarControlButton label="minimize" svgPath={SVG_PATHS.minimize} />}
      {wcontext?.maximizable && <TitlebarControlButton label="maximize" svgPath={SVG_PATHS.maximize} />}
      <TitlebarControlButton label="close" svgPath={SVG_PATHS.close} />
    </div>
  )
}

const TitlebarControlButton = ({ svgPath, label }: { svgPath: string; label: string }) => {
  const { windowMinimize, windowMaximizeToggle, windowClose } = useConveyor("window")

  const handleAction = () => {
    const actions = {
      minimize: windowMinimize,
      maximize: windowMaximizeToggle,
      close: windowClose,
    }
    actions[label as keyof typeof actions]?.()
  }

  return (
    <div aria-label={label} className="titlebar-controlButton" onClick={handleAction}>
      <svg width="10" height="10">
        <path fill="currentColor" d={svgPath} />
      </svg>
    </div>
  )
}

export interface TitlebarProps {
  title: string
  titleCentered?: boolean
  icon?: string
  menuItems?: TitlebarMenu[]
}
