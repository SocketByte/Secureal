import { VStack } from "@/app/components/layout/Stack"
import { Input } from "@/app/components/ui/input"
import { FormField } from "@/app/components/form/FormField"
import { Button } from "@/app/components/ui/button"
import { FormTextArea } from "@/app/components/form/FormTextArea"

export const JoinServerLayout = () => {
  return (
    <VStack className="w-full h-full items-center justify-center">
      <p className="text-2xl">It's time to join the server!</p>
      <p className="text-sm text-gray-300">It's time to setup your verification keys</p>

      <FormField
        type="text"
        name="address"
        label="Address and port"
        required={true}
        className="w-96"
        headerClassName="mt-6"
        tooltip="Address and port of the server, e. g. 10.10.40.3:5454"
      />

      <div className="w-96 mt-6">
        <FormTextArea
          name="key"
          label="Server key"
          required={true}
          tooltip="Encryption key is used on the server – you need to obtain it from the person who invited you. The key should be sent only over a secure connection or during an in-person meeting. If you are the first person on the server, use the 'Generate' option."
        />
      </div>
      <FormField
        type="text"
        name="username"
        label="Username"
        required={true}
        className="w-96"
        headerClassName="mt-5"
        tooltip="Your name on the server"
      />
    </VStack>
  )
}
