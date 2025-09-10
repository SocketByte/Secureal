import { cn } from "@/lib/utils"
import React, { forwardRef } from "react"
import { HStack } from "@/app/components/layout/Stack"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip"
import { Info } from "lucide-react"

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  isDisabled?: boolean
  headerClassName?: string
  customError?: string
  tooltip?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>((props, ref) => {
  const { name, type, label, customError, isDisabled, headerClassName, tooltip } = props

  const isError = false

  return (
    <div className={cn("h-[3.5rem]", headerClassName)}>
      {label && (
        <Tooltip>
          <Label className="text-md" htmlFor={name}>
            {label}
            {tooltip && (
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
            )}
          </Label>

          {tooltip && (
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      )}

      <Input
        ref={ref}
        className={cn("", {
          "border-red-500": isError || customError,
          "opacity-50 cursor-not-allowed": isDisabled,
        })}
        disabled={isDisabled}
        type={type}
        {...props}
      />
      {isError || customError ? <p className="text-xs text-red-500">{customError}</p> : null}
    </div>
  )
})
