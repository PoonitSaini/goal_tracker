import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContentProps {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function PageContent({ children, className, narrow }: PageContentProps) {
  return (
    <div
      className={cn(
        "min-w-0 p-4 sm:p-6",
        narrow && "mx-auto max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  )
}
