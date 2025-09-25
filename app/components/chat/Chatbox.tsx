import { Check, Paperclip } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useState } from "react"
import {
  cryptoKeyToBase64,
  decryptMessage,
  deriveSharedKeyHKDFFromBase64,
  encryptMessage,
  generateKeyPair,
  KeyPair,
} from "@/app/crypto/crypto"
import { useClientData, useContact } from "@/app/state/data.state"
import { useSocket } from "@/app/socket"
import { io, Socket } from "socket.io-client"
import { useIsOtherTyping } from "./Header"

const SevenTVIcon = () => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="logo">
        <path
          d="M20.7465 5.48825L21.9799 3.33745L22.646 2.20024L21.4125 0.0494437V0H14.8259L17.2928 4.3016L17.9836 5.48825H20.7465Z"
          className="fill-muted-foreground"
        ></path>
        <path
          d="M7.15395 19.9258L14.5546 7.02104L15.4673 5.43884L13.0004 1.13724L12.3097 0.0247596H1.8995L0.666057 2.17556L0 3.31276L1.23344 5.46356V5.51301H9.12745L2.96025 16.267L2.09685 17.7998L3.33029 19.9506V20H7.15395"
          className="fill-muted-foreground"
        ></path>
        <path
          d="M17.4655 19.9257H21.2398L26.1736 11.3225L27.037 9.83924L25.8036 7.68844V7.63899H22.0046L19.5377 11.9406L19.365 12.262L16.8981 7.96038L16.7255 7.63899L14.2586 11.9406L13.5679 13.1272L17.2682 19.5796L17.4655 19.9257Z"
          className="fill-muted-foreground"
        ></path>
      </g>
    </svg>
  )
}

// const messages: Message[] = [
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   {
//     sender: "B",
//     position: "right",
//     type: "text",
//     time: Date.now(),
//     message: "elo co tam, dawno sie nie widzielismy",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "ty sluchaj bo mam taka potezna propozycje finansowa, mowie ci gosciu 100% skorzystasz, wystarczy ze wplacisz hajs na tej stronce i powiesz innym zeby wplacili i oni ci wyplaca 5x twoja kwote, mowie ci no scam, tylko zrob to z mojego linku",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   { sender: "B", position: "right", type: "text", time: Date.now(), message: "elo co tam, dawno sie nie widzielismy" },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "ty sluchaj bo mam taka potezna propozycje finansowa, mowie ci gosciu 100% skorzystasz, wystarczy ze wplacisz hajs na tej stronce i powiesz innym zeby wplacili i oni ci wyplaca 5x twoja kwote, mowie ci no scam, tylko zrob to z mojego linku",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   { sender: "B", position: "right", type: "text", time: Date.now(), message: "elo co tam, dawno sie nie widzielismy" },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "ty sluchaj bo mam taka potezna propozycje finansowa, mowie ci gosciu 100% skorzystasz, wystarczy ze wplacisz hajs na tej stronce i powiesz innym zeby wplacili i oni ci wyplaca 5x twoja kwote, mowie ci no scam, tylko zrob to z mojego linku",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   { sender: "B", position: "right", type: "text", time: Date.now(), message: "elo co tam, dawno sie nie widzielismy" },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "ty sluchaj bo mam taka potezna propozycje finansowa, mowie ci gosciu 100% skorzystasz, wystarczy ze wplacisz hajs na tej stronce i powiesz innym zeby wplacili i oni ci wyplaca 5x twoja kwote, mowie ci no scam, tylko zrob to z mojego linku",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   { sender: "B", position: "right", type: "text", time: Date.now(), message: "elo co tam, dawno sie nie widzielismy" },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "ty sluchaj bo mam taka potezna propozycje finansowa, mowie ci gosciu 100% skorzystasz, wystarczy ze wplacisz hajs na tej stronce i powiesz innym zeby wplacili i oni ci wyplaca 5x twoja kwote, mowie ci no scam, tylko zrob to z mojego linku",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message: "Siema ziomek",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "Siema ziomek awefwaefawe fawe fa wofiwaj efja woejfoaw ejfoiwae jfowaje ofajwoe fjaowej fowajeo fajweo fjaweo fjwoaie fjwa",
//   },
//   {
//     sender: "B",
//     position: "right",
//     type: "text",
//     time: Date.now(),
//     message:
//       "elo co tam, dawno sie nie widzielismy aqfweaf awef awef awef awef awefaw ef asdfasdf awer gawer awear wae ",
//   },
//   {
//     sender: "B",
//     position: "right",
//     type: "text",
//     time: Date.now(),
//     message: "elo co tam, dawno sie nie widzielismy",
//   },
//   {
//     sender: "B",
//     position: "right",
//     type: "text",
//     time: Date.now(),
//     message: "elo co tam, dawno sie nie widzielismy",
//   },
//   {
//     sender: "B",
//     position: "right",
//     type: "text",
//     time: Date.now(),
//     message: "elo co tam, dawno sie nie widzielismy",
//   },

//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "ty sluchaj bo mam taka potezna propozycje finansowa, mowie ci gosciu 100% skorzystasz, wystarczy ze wplacisz hajs na tej stronce i powiesz innym zeby wplacili i oni ci wyplaca 5x twoja kwote, mowie ci no scam, tylko zrob to z mojego linku",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "photo",
//     time: Date.now(),
//     message: "",
//     metadata: {
//       url: "https://www.ciechanowiec.pl/images/stories/historia/honorowi_obywatele/006.jpg",
//     },
//   },
//   {
//     sender: "B",
//     position: "right",
//     type: "text",
//     time: Date.now(),
//     message: "elo co tam, dawno sie nie widzielismy",
//   },
//   {
//     sender: "A",
//     position: "left",
//     type: "text",
//     time: Date.now(),
//     message:
//       "fwefwefwefwefwefwefwefwefwefwefwefwefwefwefwee, mowie ci no scam, tylko zrob to z mojego linku vefgerwgwergwergwergwergwerg",
//   },
// ]

interface Message {
  id: string
  sender: string
  position: "right" | "left"
  time: number
  type: "text" | "photo" | "file"
  message: any
  metadata?: any
  readBy: string[]
}

interface ChatBubbleProps {
  index: number
  lastIndex: number
  order: "start" | "inset" | "end"
  data: Message
}

const ChatBubble = (props: ChatBubbleProps) => {
  const { index, lastIndex, order, data } = props

  const formatTime = (time: number) => {
    const date = new Date(time)

    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const Indicator = () => {
    return (
      <>
        <span className="text-xs text-muted-foreground">{formatTime(data.time)}</span>
        {data.position === "right" && <Check size={16} className="text-accent" />}
      </>
    )
  }

  return (
    <div
      className={cn("flex flex-row items-center", {
        "justify-start": data.position === "left",
        "justify-end": data.position === "right",
        "mb-0.5": order === "end",
        "mt-0.5": order === "start",
        "mb-3": index === lastIndex,
      })}
    >
      <div
        className={cn("rounded-md max-w-2/3 relative", {
          "bg-secondary rounded-r-2xl": data.position === "left",
          "bg-secondary/60 rounded-l-2xl": data.position === "right",
          "rounded-tr-2xl": data.position === "right" && order === "start",
          "rounded-tl-2xl": data.position === "left" && order === "start",
          "rounded-br-md": data.position === "right" && order === "end",
          "rounded-bl-md": data.position === "left" && order === "end",
          "pl-3 pr-2 pt-1.5": data.type === "text",
        })}
      >
        {data.type === "text" && (
          <div className="flex flex-row items-end justify-between gap-2">
            <span className="whitespace-pre-wrap break-words pb-1.5">{data.message}</span>
            <div className="flex flex-row items-end justify-end mb-1 text-xs flex-shrink-0 gap-2">
              <Indicator />
            </div>
          </div>
        )}
        {data.type === "photo" && (
          <div className="relative group">
            <img
              src={data.metadata.url}
              alt={data.message}
              className="rounded-md max-h-[400px] cursor-pointer hover:opacity-75 duration-150"
            />
            <div className="hidden absolute bottom-0 right-0 group-hover:flex flex-row items-end justify-end bg-background/75 rounded-xl px-2 py-0.5 gap-2 m-1">
              <Indicator />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function useReadReceipts(messages, setMessages, chatId, myUserId) {
  const { socket } = useSocket()
  const contact = useContact()

  useEffect(() => {
    function handleFocus() {
      if (!contact || !chatId || !messages?.length) return

      const unreadIds = messages.filter((m) => !m.readBy.includes(myUserId) && m.sender !== myUserId).map((m) => m.id)

      if (unreadIds.length > 0 && socket) {
        socket.emit("read_messages", {
          chatId,
          messageIds: unreadIds,
        })

        // Update messages state
        setMessages((prev) =>
          prev.map((m) => (unreadIds.includes(m.id) ? { ...m, readBy: [...m.readBy, myUserId] } : m))
        )
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [socket, contact, messages, chatId, myUserId])
}

export const Chatbox = () => {
  const [data] = useClientData()
  const contact = useContact()
  const { socket } = useSocket()

  const [messages, setMessages] = useState<Message[]>()
  const [input, setInput] = useState<string>("")

  const parentRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const isTyping = useRef(false)

  const [sharedKey, setSharedKey] = useState<CryptoKey>()
  const [isOtherTyping, setIsOtherTyping] = useIsOtherTyping()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (parentRef.current && messages && messages.length > 0) {
      parentRef.current.scrollTo({
        top: parentRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, parentRef])

  // Typing indicator listeners
  useEffect(() => {
    if (!socket || !contact) return

    socket.on("user_typing", ({ chatId, userId }) => {
      if (chatId === contact.id && userId === contact.otherUser.id) {
        setIsOtherTyping(true)
      }
    })

    socket.on("user_stop_typing", ({ chatId, userId }) => {
      if (chatId === contact.id && userId === contact.otherUser.id) {
        setIsOtherTyping(false)
      }
    })

    return () => {
      socket.off("user_typing")
      socket.off("user_stop_typing")
    }
  }, [socket, contact])

  // Convert DB message
  const convertDbMessage = async (messageData): Promise<Message | null> => {
    if (!contact) return null

    const findSender = (id: string) => (id === data.id ? data.username : contact.otherUser.username)
    const findPosition = (id: string) => (id === data.id ? "right" : "left")

    return {
      id: messageData.messageId,
      sender: findSender(messageData.senderId),
      position: findPosition(messageData.senderId),
      time: new Date(messageData.createdAt).getTime(),
      type: "text",
      message: await decrypt(messageData.iv, messageData.ciphertext),
      readBy: messageData.readBy,
    }
  }

  // Handle new messages from socket
  useEffect(() => {
    if (!socket || !contact || !sharedKey) return

    socket.on("receive_message", async (messageData) => {
      const message = await convertDbMessage(messageData)
      if (!message) return
      setMessages((m) => (m ? [...m, message] : [message]))
    })

    return () => {
      socket.off("receive_message")
    }
  }, [socket, contact, sharedKey])

  // Derive shared key
  useEffect(() => {
    if (data && contact) {
      deriveSharedKeyHKDFFromBase64(data.privateKey, contact.otherUser.publicKey).then(setSharedKey)
    }
  }, [data, contact])

  // Fetch history
  useEffect(() => {
    if (!data || !contact || !sharedKey) return

    fetch(`http://${data.serverAddress}:${data.serverPort}/chat/${contact.id}/messages`, {
      method: "GET",
      headers: { Authorization: `Bearer ${data.serverKey}` },
    })
      .then((res) => res.json())
      .then(async (json) => {
        const messagePromises: Promise<Message | null>[] = json.messages.map(async (m) => {
          const decrypted = await convertDbMessage(m)
          if (!decrypted) return null
          return {
            ...decrypted,
            readBy: m.reads?.map((r) => r.userId) || [], // include read info
          }
        })
        const messagesResolved = await Promise.all(messagePromises)
        const messages: Message[] = messagesResolved
          .filter((msg): msg is Message => msg !== null)
          .sort((a, b) => a.time - b.time)
        setMessages(messages)
      })
  }, [data, contact, sharedKey])

  // Send message
  const sendMessage = async (message: string) => {
    if (!sharedKey || !socket || !contact) return
    const encryptedMessage = await encryptMessage(sharedKey, message)
    socket.emit("send_message", {
      chatId: contact.id,
      ciphertext: encryptedMessage.ciphertext,
      iv: encryptedMessage.iv,
    })
    socket.emit("stop_typing", { chatId: contact.id, recipients: [contact.otherUser.id] }) // stop typing immediately
    isTyping.current = false
  }

  const decrypt = async (iv: string, ciphertext: string) => {
    if (!contact || !data || !sharedKey) return null
    return await decryptMessage(sharedKey, iv, ciphertext)
  }

  const calculateMessageOrder = (lastMessage?: Message, nextMessage?: Message, currMessage?: Message) => {
    if (!currMessage) return "inset"
    if (!lastMessage || lastMessage.sender !== currMessage.sender) return "start"
    if (!nextMessage || nextMessage.sender !== currMessage.sender) return "end"
    return "inset"
  }

  // Handle typing events
  const handleTyping = () => {
    if (!socket || !contact) return
    if (!isTyping.current) {
      socket.emit("typing", { chatId: contact.id, recipients: [contact.otherUser.id] })
      isTyping.current = true
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId: contact.id, recipients: [contact.otherUser.id] })
      isTyping.current = false
    }, 2000)
  }

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={92} className="relative">
        <div className="absolute w-full h-full overflow-y-scroll contain-strict" ref={parentRef}>
          {messages &&
            messages
              .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
              .map((message, idx) => (
                <div key={message.id} className="pb-0.5 px-3 break-all">
                  <ChatBubble
                    index={idx}
                    lastIndex={messages.length - 1}
                    order={calculateMessageOrder(messages[idx - 1], messages[idx + 1], message)}
                    data={message}
                  />
                </div>
              ))}
          {isOtherTyping && (
            <div className="px-3 py-1 text-sm text-muted-foreground italic">
              {contact?.otherUser.username} is typing...
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={8}>
        <div className="flex flex-row items-start h-full">
          <Input
            placeholder="Write a message..."
            className="h-full rounded-none border-none bg-background!"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              handleTyping()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (input.trim() !== "") {
                  sendMessage(input.trim())
                  setInput("")
                }
              }
            }}
          />
          <Button className="h-full rounded-none cursor-pointer" variant="secondary">
            <SevenTVIcon />
          </Button>
          <Button className="h-full rounded-none cursor-pointer" variant="secondary">
            <Paperclip className="size-5 text-muted-foreground" />
          </Button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
