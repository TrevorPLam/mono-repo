import forwardRef from '../internal/forward-ref';
import { CommonProps, SizeProps, VariantProps } from '../types/common-props';
import { buttonVariants } from './button.css';
import { clsx } from 'clsx';

export interface ButtonProps extends 
  CommonProps,
  SizeProps,
  VariantProps {
  tone?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    size,
    tone,
    variant,
    disabled,
    loading,
    type = 'button',
    onClick,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={clsx(buttonVariants({ size, tone, variant }), className)}
        {...props}
      >
        {loading && (
          <span
            style={{
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
