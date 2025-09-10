import { VStack } from "@/app/components/layout/Stack"
import { Button } from "@/app/components/ui/button"

export const WelcomeLayout = () => {
  return (
    <VStack className="h-full w-full justify-center items-center">
      <img src="icon.png" width="128" height="128" />
      <p className="text-2xl pt-4">Welcome to Secureal!</p>
      <p className="text-sm text-gray-300">Actually privacy-focused E2EE, self-hosted chat application</p>
    </VStack>
  )
}
