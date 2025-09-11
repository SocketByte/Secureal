import { VStack } from "@/app/components/layout/Stack"
import { Button } from "@/app/components/ui/button"
import { ArrowRight } from "lucide-react"

export interface WelcomeLayoutProps {
  onContinue: () => void
}

export const WelcomeLayout = (props: WelcomeLayoutProps) => {
  const { onContinue } = props
  return (
    <VStack className="h-full w-full justify-center items-center">
      <img src="icon.png" width="128" height="128" />
      <p className="text-2xl pt-4">Welcome to Secureal!</p>
      <p className="text-sm text-gray-300">Actually privacy-focused E2EE, self-hosted chat application</p>
      <Button onClick={onContinue} className="mt-8">
        Continue <ArrowRight />
      </Button>
    </VStack>
  )
}
