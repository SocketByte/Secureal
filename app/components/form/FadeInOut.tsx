import { AnimatePresence, motion } from "framer-motion"
import React from "react"

export interface FadeInProps {
  duration?: number
  children: React.ReactNode
  className?: string
}

export interface FadeInOutProps extends FadeInProps {
  isVisible: boolean
}

export const FadeIn = (props: FadeInProps) => {
  const { duration = 0.25 } = props

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration, ease: "easeInOut" }}
      {...props}
    />
  )
}

export const FadeInOut = (props: FadeInOutProps) => {
  const { duration = 0.25 } = props

  return (
    <AnimatePresence>
      {props.isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration, ease: "easeInOut" }}
          {...props}
        />
      )}
    </AnimatePresence>
  )
}
