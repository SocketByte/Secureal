import { HStack, VStack } from "@/app/components/layout/Stack"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip"
import { Info } from "lucide-react"
import { useState } from "react"

export const VerificationKeysSetupStep = () => {
  const [selected, setSelected] = useState("generate")

  return (
    <VStack className="w-full h-full items-center justify-center">
      <p className="text-2xl">Verification keys setup</p>
      <p className="text-sm text-gray-300">Enter or generate user verification keypair</p>
    </VStack>
  )
}
