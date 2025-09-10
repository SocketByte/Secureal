import { cn } from "@/lib/utils"
import React, { forwardRef } from "react"
import { HStack } from "@/app/components/layout/Stack"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip"

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  isDisabled?: boolean
  headerClassName?: string
  customError?: string
  tooltip?: string
}

export const FormTextArea = forwardRef<HTMLInputElement, FormFieldProps>((props) => {
  const { name, label, customError, isDisabled, headerClassName, tooltip } = props

  const isError = false

  return (
    <div className={cn("h-[3.5rem]", headerClassName)}>
      {label && tooltip && (
        <Tooltip>
          <TooltipTrigger>
            <Label className="text-md" htmlFor={name}>
              {label}
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {label && !tooltip && (
        <Label className="text-md" htmlFor={name}>
          {label}
        </Label>
      )}

      <Textarea
        className={cn("bg-accent w-full", {
          "border-red-500": isError || customError,
          "opacity-50 cursor-not-allowed": isDisabled,
        })}
        disabled={isDisabled}
      />
      {isError || customError ? <p className="text-xs text-red-500">{customError}</p> : null}
    </div>
  )
})
