import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useClientData } from "./state/data.state"

let globalSocket: Socket | null = null

export const getSocket = (serverAddress: string, serverPort: string, serverKey: string, userId: string): Socket => {
  if (!globalSocket) {
    globalSocket = io(`http://${serverAddress}:${serverPort}`, {
      auth: { token: serverKey },
      autoConnect: false,
      reconnectionDelayMax: 10000,
    })

    globalSocket.on("connect", () => {
      console.log("Socket connected", globalSocket!.id)
      globalSocket!.emit("register", userId)
    })

    globalSocket.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    globalSocket.connect()
  }

  return globalSocket
}

export const useSocket = (): { socket: Socket | null; connected: boolean } => {
  const [data] = useClientData()
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!data.id || !data.serverKey) return

    socketRef.current = getSocket(data.serverAddress, data.serverPort, data.serverKey, data.id)

    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)

    socketRef.current.on("connect", handleConnect)
    socketRef.current.on("disconnect", handleDisconnect)

    return () => {
      socketRef.current?.off("connect", handleConnect)
      socketRef.current?.off("disconnect", handleDisconnect)
    }
  }, [data.id, data.serverKey, data.serverAddress, data.serverPort])

  return { socket: socketRef.current, connected }
}
