import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"

interface UserProps {
  name: string
  lastMessage: string
  lastMessageDate: number
  avatarUrl?: string
  selected?: boolean
}

const User = (props: UserProps) => {
  const { name, lastMessage, lastMessageDate, avatarUrl, selected } = props

  return (
    <div
      className={cn(
        "flex items-center w-full rounded-md p-2 bg-muted hover:bg-secondary/70 border border-border transition max-h-[50px]",
        {
          "bg-primary text-white": selected,
        }
      )}
    >
      <div className="mr-3 flex-shrink-0">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col flex-1 justify-center min-w-0">
        <div className="flex justify-between items-center min-w-0">
          <p className="font-medium truncate min-w-0 leading-5">{name}</p>
          <time
            className={cn("text-xs text-muted-foreground ml-2 flex-shrink-0", {
              "text-white": selected,
            })}
          >
            {new Date(lastMessageDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>

        <div className="min-w-0">
          <p
            className={cn("text-xs text-muted-foreground truncate", {
              "text-white": selected,
            })}
          >
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export const Users = () => {
  return (
    <div className="flex flex-col h-screen w-full p-2">
      <Input name="search" placeholder="Search..." className="mb-2" />

      <div className="flex-1 min-h-0 w-full">
        <div className="flex flex-col gap-2 min-w-0 overflow-auto pr-2">
          <User
            name="Adam Grzegorzewski"
            lastMessage="XDD"
            lastMessageDate={Date.now()}
            avatarUrl="https://github.com/shadcn.png"
            selected
          />
          <User
            name="Mike Wazowski"
            lastMessage="beka z ciebie typie, a tu jeszcze bardzo długa wiadomość żeby sprawdzić truncate"
            lastMessageDate={Date.now()}
            avatarUrl="https://i.pinimg.com/474x/4a/3a/78/4a3a782d6609fa600e98972c111a92fd.jpg"
          />
          <User
            name="Papaj"
            lastMessage="2137 JPGMD"
            lastMessageDate={Date.now()}
            avatarUrl="https://v.wpimg.pl/Njc5MzFkYQsCVztJaRBsHkEPbxMvSWJIFhd3WGlfflIbB39CaQ0nBgZHKAopRSkYFkUsDTZFPgZMVD0TaR1_RQdcPgoqCjdFBlgvHyJELAsFBitNIAljW1QGdVdyCCpbTg0oSHZGd1lQA3tNf1h_DgEGbwc"
          />
          <User name="Twój stary" lastMessage="jestes gejem?" lastMessageDate={Date.now()} />
        </div>
      </div>
    </div>
  )
}
