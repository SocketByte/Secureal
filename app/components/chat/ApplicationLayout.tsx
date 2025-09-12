import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable"
import { Channels } from "./Channels"
import { Chatbox } from "./Chatbox"
import { Header } from "./Header"
import { Users } from "./Users"

export const ApplicationLayout = () => {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full bg-background/60 select-text">
      <ResizablePanel defaultSize={35}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={40}>
            <Users />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <Channels />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={65}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={10}>
            <Header />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={90}>
            <Chatbox />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
