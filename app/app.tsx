import { ApplicationLayout } from "./components/chat/ApplicationLayout"
import "./styles/app.css"
import { WelcomeLayout } from "@/app/components/welcome/WelcomeLayout"
import { JoinServerLayout } from "@/app/components/welcome/JoinServerLayout"
import { useState } from "react"
import { Stepper } from "@/app/components/form/Stepper"
import { VerificationKeysSetupLayout } from "@/app/components/welcome/VerificationKeysSetupLayout"

export default function App() {
  const [step, setStep] = useState<number>(0)
  return (
    <div className="w-full h-full">
      <Stepper
        currentStep={step}
        submitLabel="Continue"
        onStepChange={(step) => {
          setStep(step)
        }}
        onNext={() => {}}
        onPrevious={() => {}}
        steps={[
          {
            label: "Welcome to Secureal!",
            content: <WelcomeLayout />,
            validator: () => {
              return true
            },
          },
          {
            label: "Join the server",
            content: <JoinServerLayout />,
            validator: () => {
              return true
            },
          },
          {
            label: "Setup verification keys",
            content: <VerificationKeysSetupLayout />,
            validator: () => {
              return true
            },
          },
          {
            label: "Create application password",
            content: <></>,
            validator: () => {
              return true
            },
          },
        ]}
        onSubmit={() => {}}
      />
    </div>
  )
}
