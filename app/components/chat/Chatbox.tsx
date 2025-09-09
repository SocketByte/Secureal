import { Paperclip, Smile } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable"
import { Textarea } from "../ui/textarea"

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

export const Chatbox = () => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={92}>
        <div className="flex h-full items-center justify-center">
          <span className="font-semibold">Chatbox</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={8}>
        <div className="flex flex-row items-start">
          <Input placeholder="Write a message..." className="h-full rounded-none border-none" />
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
