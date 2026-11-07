import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90',
        destructive: 'rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700',
        outline: 'rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium hover:bg-secondary',
        secondary: 'rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:opacity-80',
        ghost: 'rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary',
        link: 'text-sm font-medium text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-9',
        sm: 'min-h-8 px-3 text-xs',
        lg: 'min-h-11 px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button }
