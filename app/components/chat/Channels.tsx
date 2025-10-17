import { Hash, Headphones, Mic, PhoneMissed, Plus, ScreenShare, Settings, Volume2, Wifi } from "lucide-react"
import { Spacer } from "../form/Spacer"
import { HStack, VStack } from "../layout/Stack"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useClientData } from "@/app/state/data.state"
import { generateKeyPair } from "@/app/crypto/crypto"

interface ConnectedUserProps {
  avatarUrl?: string
  name: string
}

const ConnectedUser = (props: ConnectedUserProps) => {
  const { name, avatarUrl } = props
  return (
    <HStack className="gap-2 items-center cursor-pointer hover:bg-muted px-2 py-1 rounded-md">
      <Avatar className="w-6 h-6">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <p>{name}</p>
    </HStack>
  )
}

interface ChannelProps {
  type: "text" | "voice"
  name: string
  children?: React.ReactNode
}

const Channel = (props: ChannelProps) => {
  const { type, name, children } = props
  return (
    <div className="flex flex-col w-full gap-0.5">
      <div className="flex flex-row gap-2 items-center text-foreground hover:bg-muted w-full p-2 rounded-md cursor-pointer group">
        {type === "text" && <Hash size={16} />}
        {type === "voice" && <Volume2 size={16} />}
        <span className="text-md">{name}</span>
        <Spacer />
        <Settings
          size={16}
          className="group-hover:block hidden text-muted-foreground cursor-pointer hover:text-foreground"
        />
      </div>
      {children && <VStack className="gap-0.5 ml-6">{children}</VStack>}
    </div>
  )
}

const ChannelList = (props: { children: React.ReactNode }) => {
  const { children } = props

  return <div className="flex flex-col gap-0.5 items-start w-full select-none">{children}</div>
}

const ChannelHeader = (props: { name: string }) => {
  const { name } = props
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <p className="text-muted-foreground font-medium text-xs mx-2 mt-2">{name}</p>
      <Plus size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
    </div>
  )
}

const ChannelUserPanel = () => {
  const [data, _] = useClientData()
  return (
    <VStack className="absolute bottom-0 left-0 right-0 w-full">
      <HStack className="bg-secondary w-full px-2 py-1 rounded-t-xl">
        <p className="text-muted-foreground">
          Connected to: <span className="text-foreground">kanał papieski</span>
        </p>
        <Spacer />
        <HStack className="items-center gap-1">
          <Wifi className="text-green-500" size={14} />
          <p className="text-green-500 text-xs">Excellent</p>
        </HStack>
      </HStack>
      <HStack className="items-center p-4 bg-muted gap-3 w-full">
        <div className="relative">
          <Avatar>
            <AvatarImage src={data.avatarUrl} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="size-2 ring-2 ring-background rounded-full bg-green-500 absolute bottom-0 right-0"></div>
        </div>
        <VStack className="items-start">
          <p className="font-medium">{data.username}</p>
          <HStack className="items-center">
            <p className="text-muted-foreground text-xs">
              {data.visibility.charAt(0).toUpperCase() + data.visibility.slice(1, data.visibility.length)}
            </p>
          </HStack>
        </VStack>
        <Spacer />
        <HStack className="items-center bg-secondary rounded-md px-3 py-2 gap-2">
          <Mic size={16} className="text-muted-foreground hover:text-foreground cursor-pointer" />
          <Headphones size={16} className="text-muted-foreground hover:text-foreground cursor-pointer" />
        </HStack>
        <HStack className="items-center bg-secondary rounded-md px-3 py-2 gap-2">
          <ScreenShare size={16} className="text-muted-foreground hover:text-foreground cursor-pointer" />
          <PhoneMissed size={16} className="text-muted-foreground hover:text-foreground cursor-pointer" />
        </HStack>
      </HStack>
    </VStack>
  )
}

export const Channels = () => {
  return (
    <div className="w-full h-full relative">
      <div className="flex flex-col w-full h-full items-start justify-start gap-2 p-4 absolute overflow-auto">
        <ChannelHeader name="Text channels" />
        <ChannelList>
          <Channel type="text" name="ogólny" />
          <Channel type="text" name="dj-wiotki-kutas" />
        </ChannelList>
        <ChannelHeader name="Voice channels" />
        <ChannelList>
          <Channel type="voice" name="kanał papieski">
            <ConnectedUser name="SocketByte" avatarUrl="https://github.com/shadcn.png" />
            <ConnectedUser name="mikigal" avatarUrl="https://s2.coinmarketcap.com/static/img/coins/200x200/24478.png" />
          </Channel>
          <Channel type="voice" name="ogólny" />
        </ChannelList>
      </div>
      <Spacer />
      <ChannelUserPanel />
    </div>
  )
}
