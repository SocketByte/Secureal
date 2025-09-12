import { ApplicationLayout } from "./components/chat/ApplicationLayout"
import "./styles/app.css"
import { WelcomeLayout } from "@/app/components/setup/WelcomeLayout"
import { JoinServerFormData, JoinServerStep, JoinServerStepProps } from "@/app/components/setup/steps/JoinServerStep"
import { useState } from "react"
import { Stepper } from "@/app/components/form/Stepper"
import { VerificationKeysSetupStep } from "@/app/components/setup/steps/VerificationKeysSetupStep"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const client = new QueryClient()

export default function App() {
  const [step, setStep] = useState<number>(0)
  const [isWelcomePage, setWelcomePage] = useState(true)
  return (
    <QueryClientProvider client={client}>
      <ApplicationLayout />
    </QueryClientProvider>

    // <div className="w-full h-full">
    //   {isWelcomePage && (
    //     <WelcomeLayout
    //       onContinue={() => {
    //         setWelcomePage(false)
    //       }}
    //     />
    //   )}
    //   {!isWelcomePage && (
    //     <Stepper
    //       currentStep={step}
    //       submitLabel="Continue"
    //       onStepChange={(step) => {
    //         setStep(step)
    //       }}
    //       onNext={() => {}}
    //       onPrevious={() => {}}
    //       steps={[
    //         {
    //           label: "Join the server",
    //           content: (
    //             <JoinServerStep
    //               onSubmit={(data: JoinServerFormData) => {
    //                 console.log(data)
    //               }}
    //             />
    //           ),
    //           validator: () => {
    //             return false
    //           },
    //         },
    //         {
    //           label: "Setup verification keys",
    //           content: <VerificationKeysSetupStep />,
    //           validator: () => {
    //             return true
    //           },
    //         },
    //         {
    //           label: "Create application password",
    //           content: <></>,
    //           validator: () => {
    //             return true
    //           },
    //         },
    //       ]}
    //       onSubmit={() => {}}
    //     />
    //   )}
    // </div>
  )
}
