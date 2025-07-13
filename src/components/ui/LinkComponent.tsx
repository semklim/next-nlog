import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link, { LinkProps } from "next/link";

interface LinkComponentProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'clean';
}

export const linkVariants = cva(
  '',
  {
    variants: {
      variant: {
        default: 'text-gray-900 hover:text-gray-700 hover:underline transition-colors',
        clean: '',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export default function LinkComponent(props: LinkComponentProps) {
  const { className = '', href, children, variant = 'default', ...otherProps } = props;


  return (
    <Link href={href} className={cn(linkVariants({ variant }), className)} {...otherProps}>
      {children}
    </Link>
  );
};
