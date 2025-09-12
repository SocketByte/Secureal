import { HStack, VStack } from "@/app/components/layout/Stack"
import { LabeledFormInput } from "@/app/components/form/LabeledFormInput"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import React from "react"
import { Textarea } from "@/app/components/ui/textarea"

export interface JoinServerStepProps {
  onSubmit: (data: JoinServerFormData) => void
}

const formSchema = z.object({
  address: z.string().min(1, {
    message: "Server address is required",
  }),
  port: z
    .string()
    .min(1, {
      message: "Server port is required",
    })
    .max(5, {
      message: "Invalid port",
    }),
  username: z
    .string()
    .min(4, {
      message: "Username must be between 4 and 32 characters",
    })
    .max(32, {
      message: "Password must be between 4 and 32 characters",
    }),
  serverKey: z.string().min(1, {
    message: "Server key is required",
  }),
})

export type JoinServerFormData = z.infer<typeof formSchema>

const onSubmit = (data: JoinServerFormData) => {
  console.log(data)
}

export const JoinServerStep = (props: JoinServerStepProps) => {
  //const { onSubmit } = props
  const form = useForm<JoinServerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      port: "",
      username: "",
      serverKey: "",
    },
  })

  return (
    <VStack className="w-full h-full items-center justify-center">
      <p className="text-2xl">It's time to join the server!</p>
      <p className="text-sm text-gray-300">It's time to setup your verification keys</p>

      <div className="w-96">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack className="gap-4">
              <HStack className="pt-6 w-full gap-4">
                <LabeledFormInput name="address" type="text" label="Address" form={form} className="w-2/3">
                  {(field) => <Input type="text" {...field} placeholder="Address" />}
                </LabeledFormInput>

                <LabeledFormInput name="port" label="Port" form={form} className="w-1/3" hideErrors>
                  {(field) => <Input type="number" {...field} placeholder="Port" />}
                </LabeledFormInput>
              </HStack>

              <LabeledFormInput name="username" label="Username" form={form}>
                {(field) => <Input type="text" className="w-full" {...field} placeholder="Username" />}
              </LabeledFormInput>

              <LabeledFormInput
                name="serverKey"
                label="Server key"
                tooltip="Encryption key is used on the server"
                form={form}
              >
                {(field) => (
                  <Textarea
                    className="font-mono max-h-20 resize-none"
                    wrap="hard"
                    {...field}
                    placeholder="Server key"
                  />
                )}
              </LabeledFormInput>

              <Button type="submit">chuj</Button>
            </VStack>
          </form>
        </Form>
      </div>
    </VStack>
  )
}
