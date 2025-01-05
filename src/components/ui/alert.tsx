import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        gray: "bg-gray-50 text-gray-600 dark:text-gray-400 dark:bg-gray-900/20 border-gray-500/10 dark:border-gray-600/50",
        red: "bg-red-50 text-red-700 dark:text-red-400 dark:bg-red-900/20 border-red-600/10 dark:border-red-600/30",
        yellow: "bg-yellow-50 text-yellow-800 dark:text-yellow-400 dark:bg-yellow-900/20 border-yellow-600/20 dark:border-yellow-600/30",
        green: "bg-green-50 text-green-700 dark:text-green-400 dark:bg-green-900/20 border-green-600/20 dark:border-green-600/30",
        blue: "bg-blue-50 text-blue-700 dark:text-blue-400 dark:bg-blue-900/20 border-blue-700/10 dark:border-blue-600/30",
        indigo: "bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/20 border-indigo-700/10 dark:border-indigo-600/30",
        purple: "bg-purple-50 text-purple-700 dark:text-purple-400 dark:bg-purple-900/20 border-purple-700/10 dark:border-purple-600/30",
        pink: "bg-pink-50 text-pink-700 dark:text-pink-400 dark:bg-pink-900/20 border-pink-700/10 dark:border-pink-600/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
