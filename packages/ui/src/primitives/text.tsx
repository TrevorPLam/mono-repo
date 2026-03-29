import forwardRef from '../internal/forward-ref';
import { CommonProps, SizeProps } from '../types/common-props';
import { textVariants } from './text.css';
import { clsx } from 'clsx';

export interface TextProps extends 
  CommonProps,
  SizeProps {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  tone?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  decoration?: 'none' | 'underline' | 'overline' | 'line-through';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  leading?: 'none' | 'tight' | 'normal' | 'relaxed' | 'loose';
  tracking?: 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  truncate?: boolean;
  italic?: boolean;
  testId?: string;
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  ({ 
    className,
    as: Element = 'span',
    size,
    tone,
    weight,
    align,
    decoration,
    transform,
    leading,
    tracking,
    truncate = false,
    italic = false,
    testId,
    children,
    ...props 
  }, ref) => {
    return (
      <Element
        ref={ref as any}
        className={clsx(
          textVariants({ 
            size, 
            tone, 
            weight, 
            align, 
            decoration, 
            transform, 
            leading, 
            tracking, 
            truncate, 
            italic 
          }),
          className
        )}
        data-testid={testId}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Text.displayName = 'Text';
