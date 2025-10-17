import {
  AlertCircle,
  Check,
  CheckCircle,
  CircleQuestionMarkIcon,
  Copy,
  Cross,
  EllipsisVertical,
  Search,
  ShieldUser,
  Wifi,
  WifiOff,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { cn } from "@/lib/utils"
import { useClientData, useSelectedContact } from "@/app/state/data.state"
import { Spacer } from "../form/Spacer"
import { useSocket } from "@/app/socket"
import { atom, useAtom } from "jotai"
import { useEffect, useState } from "react"

const EMOJI_POOL = [
  "\u{1F34E}",
  "\u{1F34C}",
  "\u{1F347}",
  "\u{1F34A}",
  "\u{1F349}",
  "\u{1F353}",
  "\u{1F352}",
  "\u{1F951}",
  "\u{1F955}",
  "\u{1F33D}",
  "\u{1F34D}",
  "\u{1F95D}",
  "\u{1F965}",
  "\u{1F346}",
  "\u{1F34B}",
  "\u{1F350}",
  "\u{1F954}",
  "\u{1F966}",
  "\u{1F436}",
  "\u{1F431}",
  "\u{1F430}",
  "\u{1F43C}",
  "\u{1F98A}",
  "\u{1F438}",
  "\u{1F414}",
  "\u{1F422}",
  "\u{1F41F}",
  "\u{1F981}",
  "\u{1F428}",
  "\u{1F41D}",
  "\u{1F984}",
  "\u{1F40D}",
  "\u{26BD}",
  "\u{1F3C0}",
  "\u{1F3C8}",
  "\u{26BE}",
  "\u{1F3BE}",
  "\u{1F3D0}",
  "\u{1F3B8}",
  "\u{1F941}",
  "\u{1F3B9}",
  "\u{1F3AE}",
  "\u{1F3B2}",
  "\u{1F697}",
  "\u{2708}\u{FE0F}",
  "\u{1F680}",
  "\u{1F6A4}",
  "\u{1F4F1}",
  "\u{1F4BB}",
  "\u{1F3A5}",
  "\u{1F4F7}",
  "\u{1F4FA}",
  "\u{1F4D6}",
  "\u{270F}\u{FE0F}",
  "\u{1F4CC}",
  "\u{1F511}",
  "\u{1F4A1}",
  "\u{1F570}\u{FE0F}",
  "\u{1F512}",
  "\u{1F528}",
  "\u{1F527}",
  "\u{1F381}",
  "\u{2764}\u{FE0F}",
  "\u{2B50}",
  "\u{1F525}",
]

const keyToEmojis = async (base64Key) => {
  try {
    const binary = atob(base64Key)
    const bytes = new Uint8Array([...binary].map((ch) => ch.charCodeAt(0)))

    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes)
    const hash = new Uint8Array(hashBuffer)

    const emojis: string[] = []
    const used = new Set()
    let i = 0

    while (emojis.length < 8 && i < hash.length) {
      const idx = hash[i] % EMOJI_POOL.length
      if (!used.has(idx)) {
        emojis.push(EMOJI_POOL[idx])
        used.add(idx)
      }
      i++
    }

    return emojis.join(" ")
  } catch (e) {}
}

function useAnimatedDots(delay: number = 500) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, delay)
    return () => clearInterval(interval)
  }, [delay])

  return dots
}

function timeAgo(date: Date | null): string {
  if (!date) return "never 😢"
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD} day${diffD > 1 ? "s" : ""} ago`
}

const isOtherTypingAtom = atom(false)

export const useIsOtherTyping = () => {
  return useAtom(isOtherTypingAtom)
}

export const Header = () => {
  const [selectedContact] = useSelectedContact()
  const [data] = useClientData()
  const contact = data.contacts.find((c) => c.otherUser.id === selectedContact)
  const { socket, connected } = useSocket()
  const [isOtherTyping] = useIsOtherTyping()
  const dots = useAnimatedDots()

  // Local state for online / last seen
  const [online, setOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState<Date | null>(null)

  // Listen for socket events
  useEffect(() => {
    if (!socket || !contact) return

    const handleOnline = ({ userId }) => {
      if (userId === contact.otherUser.id) {
        setOnline(true)
        setLastSeen(null)
      }
    }

    const handleOffline = ({ userId, lastSeen }) => {
      if (userId === contact.otherUser.id) {
        setOnline(false)
        setLastSeen(new Date(lastSeen))
      }
    }

    socket.on("user_online", handleOnline)
    socket.on("user_offline", handleOffline)

    // Cleanup
    return () => {
      socket.off("user_online", handleOnline)
      socket.off("user_offline", handleOffline)
    }
  }, [socket, contact])

  const [emojiA, setEmojiA] = useState("")
  const [emojiB, setEmojiB] = useState("")

  useEffect(() => {
    if (!contact || !data) {
      return
    }

    keyToEmojis(contact.otherUser.publicKey).then((e) => setEmojiA(e || ""))
    keyToEmojis(data.publicKey).then((e) => setEmojiB(e || ""))
  }, [contact, data])

  return (
    <div className="flex flex-row w-full h-full items-center justify-start p-4">
      <div className="flex flex-row items-center justify-start gap-4 w-full">
        <div className="relative">
          <Avatar>
            <AvatarImage src={contact?.otherUser.avatarUrl} alt="@user" />
            <AvatarFallback>{contact?.otherUser.username.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "size-2 ring-2 ring-background rounded-full absolute bottom-0 right-0",
              online ? "bg-green-500" : "bg-neutral-500"
            )}
          ></div>
        </div>

        <div className="flex flex-col items-start justify-center">
          <div className="flex flex-row items-center justify-center gap-2">
            {contact && <p className="font-medium truncate">{contact?.otherUser.username}</p>}
          </div>

          {/* Status line */}
          {isOtherTyping ? (
            <p className="text-accent text-xs">typing{dots}</p>
          ) : online ? (
            <p className="text-green-500 text-xs">online</p>
          ) : (
            <p className="text-muted-foreground text-xs">last seen {timeAgo(lastSeen)}</p>
          )}
        </div>

        <Spacer />

        {connected ? (
          <span className="text-green-500 flex flex-row items-center gap-1">
            <Wifi className="size-5" />
          </span>
        ) : (
          <span className="text-red-500 flex flex-row items-center gap-1">
            <WifiOff className="size-5" />
          </span>
        )}

        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            {contact && <ShieldUser className="text-foreground size-5 cursor-pointer" />}
          </HoverCardTrigger>
          <HoverCardContent className="border-secondary bg-muted w-[300px] select-none mx-4">
            <h1 className="font-medium">Manual user verification</h1>
            <p className="text-xs text-muted-foreground">
              Ask this user through mail, SMS, or voice call whether their emojis match yours to make sure you are
              messaging the correct person.
            </p>
            <p className="mt-4">
              Verification emojis for <span className="text-accent">{contact?.otherUser.username}</span>:
            </p>
            <p className="text-xl">{emojiA}</p>
            <p className="mt-4">Your verification emojis:</p> <p className="text-xl">{emojiB}</p>
          </HoverCardContent>
        </HoverCard>

        <Search className="text-muted-foreground size-5 cursor-pointer hover:text-foreground" />
        <EllipsisVertical className="text-muted-foreground size-5 cursor-pointer hover:text-foreground" />
      </div>
    </div>
  )
}
