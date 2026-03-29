import forwardRef from '../internal/forward-ref';
import { CommonProps, SizeProps, VariantProps } from '../types/common-props';
import { buttonVariants } from './button.simple.css';
import { clsx } from '../internal/classnames';
import { tokens } from '../styles/tokens';

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
    size = 'md',
    tone = 'neutral',
    variant = 'solid',
    disabled,
    loading,
    type = 'button',
    onClick,
    children,
    ...props 
  }, ref) => {
    const getStyles = () => {
      const styles: React.CSSProperties = {
        ...buttonVariants.base,
        ...buttonVariants.sizes[size],
        ...buttonVariants.tones[tone],
        ...buttonVariants.variants[variant],
      };

      if (disabled) {
        styles.opacity = '0.6';
        styles.cursor = 'not-allowed';
      }

      return styles;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={clsx('button', className)}
        style={getStyles()}
        {...props}
      >
        {loading && (
          <span
            style={{
              width: tokens.sizing.md,
              height: tokens.sizing.md,
              border: `2px solid currentColor`,
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
