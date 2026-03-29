import forwardRef from '../internal/forward-ref';
import { CommonProps, SizeProps } from '../types/common-props';
import { iconVariants } from './icon.css';
import { clsx } from 'clsx';

export interface IconProps extends 
  CommonProps,
  Omit<SizeProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  color?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'inherit';
  label?: string;
  decorative?: boolean;
  testId?: string;
  children: React.ReactNode;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ 
    className,
    size = 'md',
    color = 'neutral',
    label,
    decorative = false,
    testId,
    children,
    ...props 
  }, ref) => {
    return (
      <svg
        ref={ref}
        className={clsx(iconVariants({ size, color }), className)}
        aria-label={decorative ? undefined : label}
        aria-hidden={decorative ? 'true' : undefined}
        role="img"
        focusable="false"
        viewBox="0 0 24 24"
        fill="currentColor"
        data-testid={testId}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
