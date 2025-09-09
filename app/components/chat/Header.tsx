import { AlertCircle, Check, CheckCircle, CircleQuestionMarkIcon, Copy, EllipsisVertical, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Separator } from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

interface VerificationBadgeProps {
  publicKey: string
  isVerifiedByServer: boolean
  isVerifiedByClient: boolean
}

const VerificationBadge = (props: VerificationBadgeProps) => {
  const { publicKey, isVerifiedByClient, isVerifiedByServer } = props

  let verificationStatus = "This user has been verified to be legitimate by the server and your client."
  if (!isVerifiedByClient && isVerifiedByServer) {
    verificationStatus =
      "This user has not been verified by your client but it was verified as legitimate by the authority server. The server might be compromised."
  }
  if (isVerifiedByClient && !isVerifiedByServer) {
    verificationStatus =
      "This user has not been verified by the authority server, but it was verified as legitimate by your client. Your client might be compromised."
  }
  if (!isVerifiedByClient && !isVerifiedByServer) {
    verificationStatus =
      "This user has not been verified by either the authority server or your client. That user may not be legitimate and cannot be trusted."
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        {isVerifiedByClient && isVerifiedByServer && <CheckCircle className="size-4 text-green-500 mt-0.5" />}
        {!isVerifiedByClient && isVerifiedByServer && (
          <CircleQuestionMarkIcon className="size-4 text-yellow-500 mt-0.5" />
        )}
        {isVerifiedByClient && !isVerifiedByServer && (
          <CircleQuestionMarkIcon className="size-4 text-yellow-500 mt-0.5" />
        )}
        {!isVerifiedByClient && !isVerifiedByServer && <AlertCircle className="size-4 text-red-500 mt-0.5" />}
      </HoverCardTrigger>
      <HoverCardContent className="border-none">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            {isVerifiedByServer ? (
              <Badge className="bg-green-700 text-xs w-[60%] text-white text-start flex flex-row items-center justify-start">
                <Check />
                Verified (Server)
              </Badge>
            ) : (
              <Badge className="bg-red-700 text-xs w-[60%] text-white text-start flex flex-row items-center justify-start">
                <Check />
                Unverified (Server)
              </Badge>
            )}
            <p className="text-muted-foreground text-xs">3 hours ago</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            {isVerifiedByClient ? (
              <Badge className="bg-green-700 text-xs text-white w-[60%] text-start flex flex-row items-center justify-start">
                <Check />
                Verified (Client)
              </Badge>
            ) : (
              <Badge className="bg-red-700 text-xs w-[60%] text-white text-start flex flex-row items-center justify-start">
                <Check />
                Unverified (Client)
              </Badge>
            )}
            <p className="text-muted-foreground text-xs">2 minutes ago</p>
          </div>
          <div className="w-full h-[1px] bg-muted"></div>
          <div className="flex flex-row items-center gap-2">
            <p className="font-medium">Public Key (RSA)</p>
            <Copy
              className="text-muted-foreground size-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(publicKey)
              }}
            />
          </div>
          <code className="overflow-auto text-muted-foreground text-xs">{publicKey}</code>
          <p
            className={cn("text-green-500 text-xs", {
              "text-yellow-500":
                (!isVerifiedByClient && isVerifiedByServer) || (isVerifiedByClient && !isVerifiedByServer),
              "text-red-500": !isVerifiedByClient && !isVerifiedByServer,
            })}
          >
            {verificationStatus}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export const Header = () => {
  const isVerifiedServer = true
  const isVerifiedClient = true

  return (
    <div className="flex flex-row w-full h-full items-center justify-start p-4">
      <div className="flex flex-row items-center justify-start gap-4 w-full">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="font-medium truncate">Adam Grzegorzewski</p>
            <VerificationBadge
              isVerifiedByClient={isVerifiedClient}
              isVerifiedByServer={isVerifiedServer}
              publicKey="MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFGjA8h8JMNWesSERifxjCP9xJj72CnSDwKvLiIJIZKUXHztCy4JM+JO/GJO62n82fUKM3jALviD7EoyhDz5/vN6fZqqmt9xIAMwyEgAI1RQ1FatV8Fjc8obnTYhZGe7PnQIK1x23OoOo2reo1gL7v24R7XU xtHK6yRz0qqdTzNfAgMBAAE="
            />
          </div>

          <p className="text-muted-foreground text-xs">last seen 46 minutes ago</p>
        </div>
        <div className="flex flex-grow"></div>
        <Search className="text-muted-foreground size-5" />
        <EllipsisVertical className="text-muted-foreground size-5" />
      </div>
    </div>
  )
}
