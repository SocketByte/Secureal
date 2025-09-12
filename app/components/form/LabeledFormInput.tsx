import React from "react"
import { HStack, VStack } from "@/app/components/layout/Stack"
import { Input } from "@/app/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip"
import { Info } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/app/components/ui/form"
import { Control, useFormContext } from "react-hook-form"
import { Textarea } from "@/app/components/ui/textarea"
import { ControllerRenderProps } from "react-hook-form/dist/types/controller"

export interface LabeledFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  tooltip?: string
  form: { control: Control<any> }
  children: (field: ControllerRenderProps<any, string>) => React.ReactNode
  className?: string
  hideErrors?: boolean
}

export const LabeledFormInput = (props: LabeledFormInputProps) => {
  const { label, name, tooltip, form, children, className, hideErrors } = props
  const context = useFormContext()

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem className={className}>
              <Tooltip>
                <FormLabel>
                  <p>{label}</p>
                  {tooltip && (
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                  )}
                </FormLabel>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
              <FormControl>{children(field)}</FormControl>

              {context.getFieldState(name).error !== undefined && hideErrors ? (
                <div className="h-[22px]"></div>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )
        }}
      />
    </>
  )
}
