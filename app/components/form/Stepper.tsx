import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import { HStack, VStack } from "@/app/components/layout/Stack"
import { FadeInOut } from "@/app/components/form/FadeInOut"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Spacer } from "@/app/components/form/Spacer"

export interface Step {
  label: string
  content: React.ReactNode
  validator: () => boolean
}

export interface StepperProps {
  currentStep: number
  steps: Step[]
  onStepChange?: (step: number) => void
  onNext?: () => void
  onPrevious?: () => void
  onSubmit: () => void
  animationDuration?: number
  activeColor?: string
  inactiveColor?: string
  disabledColor?: string
  errorColor?: string
  disabledStep?: number
  submitLabel?: string
}

export const Stepper = (props: StepperProps) => {
  const {
    currentStep,
    onStepChange,
    steps,
    onNext,
    onSubmit,
    activeColor = "#7C20FE",
    inactiveColor = "#686868",
    disabledColor = "#3b3b3e",
    disabledStep,
    animationDuration = 0.2,
    submitLabel = "Zapisz",
  } = props

  return (
    <VStack className="w-full h-full">
      <HStack className="px-6 shadow py-4 rounded-xl w-full justify-around relative">
        {steps.map((step, index) => (
          <VStack key={index} className="relative gap-4 justify-center w-full items-center">
            <motion.div
              className={cn("rounded-full w-10 h-10 flex items-center justify-center text-[#fff] z-20", {
                "cursor-pointer": index <= currentStep,
              })}
              initial={{ backgroundColor: inactiveColor }}
              animate={{
                backgroundColor:
                  index <= currentStep ? activeColor : disabledStep === index ? disabledColor : inactiveColor,
              }}
              transition={{
                duration: animationDuration,
                delay: index === currentStep ? animationDuration : 0,
              }}
              onClick={() => {
                if (onStepChange && index <= currentStep) {
                  onStepChange(index)
                }
              }}
            >
              {index + 1}
            </motion.div>
            <div className="text-sm text-neutral-400">{step.label}</div>
            {index !== steps.length - 1 && <div className="absolute w-full h-0.5 bg-primary left-1/2 top-5 z-0" />}
            {index !== steps.length - 1 && (
              <motion.div
                className="absolute h-0.5 left-1/2 top-5 z-0"
                initial={{ width: 0, backgroundColor: inactiveColor }}
                animate={{
                  width: index < currentStep ? "100%" : 0,
                  backgroundColor: index < currentStep ? activeColor : inactiveColor,
                }}
                transition={{
                  duration: animationDuration + 0.1,
                  ease: "easeInOut",
                }}
              />
            )}
          </VStack>
        ))}
      </HStack>

      <FadeInOut duration={0.35} isVisible={true} key={currentStep} className="h-full">
        <div className="h-full">{steps[currentStep].content}</div>
      </FadeInOut>
      <Spacer />
      <Button
        className="w-52 self-center mb-20"
        disabled={!steps[currentStep].validator()}
        onClick={() => {
          if (currentStep < steps.length - 1) {
            if (!steps[currentStep].validator()) {
              return
            }
            if (onStepChange) {
              onStepChange(currentStep + 1)
            }
            onNext && onNext()
          } else {
            onSubmit()
          }
        }}
      >
        {currentStep < steps.length - 1 ? "Continue" : submitLabel}
        {currentStep < steps.length - 1 && <ArrowRight />}
      </Button>
    </VStack>
  )
}
