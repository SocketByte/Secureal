import { EllipsisVertical, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export const Header = () => {
  return (
    <div className="flex flex-row w-full h-full items-center justify-start p-4">
      <div className="flex flex-row items-center justify-start gap-4 w-full">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center">
          <p className="font-medium truncate">Adam Grzegorzewski</p>
          <p className="text-muted-foreground text-xs">last seen 46 minutes ago</p>
        </div>
        <div className="flex flex-grow"></div>
        <Search className="text-muted-foreground size-5" />
        <EllipsisVertical className="text-muted-foreground size-5" />
      </div>
    </div>
  )
}
