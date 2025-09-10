import { HStack, VStack } from "@/app/components/layout/Stack"
import { Input } from "@/app/components/ui/input"
import { FormField } from "@/app/components/form/FormField"
import { Button } from "@/app/components/ui/button"
import { FormTextArea } from "@/app/components/form/FormTextArea"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip"
import { Info } from "lucide-react"
import { useState } from "react"

export const VerificationKeysSetupLayout = () => {
  const [selected, setSelected] = useState("generate")
  return (
    <VStack className="w-full h-full items-center justify-center">
      <p className="text-2xl">Verification keys setup</p>
      <p className="text-sm text-gray-300">Enter or generate user verification keypair</p>

      <HStack>
        <Tooltip>
          <Label className="text-sm text-gray-300 mr-1 mt-6 mb-2">
            Verification keys setup
            <TooltipTrigger>
              <Info size={16} />
            </TooltipTrigger>
          </Label>

          <TooltipContent>
            <p>
              The key is used to verify your identity. Other users can confirm that you are really you by using this
              key. You should use the same key on all of your devices. If you are setting up the application for the
              first time, use the 'Generate' option.
            </p>
          </TooltipContent>
        </Tooltip>
      </HStack>
      <RadioGroup defaultValue="generate" value={selected} onValueChange={setSelected}>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="generate" id="r1" defaultChecked={true} />
          <Label htmlFor="r1">Generate new keypair</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="manual" id="r2" />
          <Label htmlFor="r2">Use your keypair</Label>
        </div>
      </RadioGroup>

      <div className="w-96 mt-6">
        <FormTextArea name="key" label="Public key" required={true} isDisabled={selected === "generate"} />
      </div>
      <div className="w-96 mt-6">
        <FormTextArea name="key" label="Private key" required={true} isDisabled={selected === "generate"} />
      </div>
    </VStack>
  )
}
