import { cn } from "@/lib/utils"

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode

  direction?: "col" | "row"
  className?: string

  ref?: any
}

export const Stack = (props: StackProps) => {
  const { children, className = "", direction = "col", ref, ...rest } = props

  return (
    <div
      ref={ref}
      {...rest}
      className={cn(
        "flex",
        {
          "flex-col": direction === "col",
          "flex-row": direction === "row",
        },
        className
      )}
    >
      {children && children}
    </div>
  )
}

export const VStack = (props: StackProps) => {
  return <Stack {...props} direction="col" children={props.children} />
}

export const HStack = (props: StackProps) => {
  return <Stack {...props} direction="row" children={props.children} />
}
