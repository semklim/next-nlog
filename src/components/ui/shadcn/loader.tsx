import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

const loaderVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
      },
      variant: {
        default: 'text-primary',
        secondary: 'text-secondary-foreground',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600'
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'default'
    }
  }
)

export interface LoaderProps extends VariantProps<typeof loaderVariants> {
  className?: string
  text?: string
  fullScreen?: boolean
}

export function Loader({
  className,
  size,
  variant,
  text,
  fullScreen = false
}: LoaderProps) {
  const loader = (
    <div className={cn(
      'flex items-center justify-center',
      fullScreen && 'min-h-screen',
      !fullScreen && 'py-8'
    )}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn(loaderVariants({ size, variant }), className)} />
        {text && (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  )

  return loader
}

// Preset loader components for common use cases
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return <Loader fullScreen size="lg" text={text} />
}

export function CardLoader({ text }: { text?: string }) {
  return <Loader size="default" text={text} />
}

export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'default' }) {
  return <Loader2 className={cn(loaderVariants({ size }), 'mr-2')} />
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className={loaderVariants({ size: 'sm' })} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
} 