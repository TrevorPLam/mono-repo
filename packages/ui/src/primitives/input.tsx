import forwardRef from '../internal/forward-ref';
import { CommonProps, SizeProps } from '../types/common-props';
import { inputVariants } from './input.css';
import { clsx } from 'clsx';

export interface InputProps extends 
  CommonProps,
  SizeProps {
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'error';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  state?: 'default' | 'error' | 'success';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    size,
    tone,
    state,
    type = 'text',
    placeholder,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    min,
    max,
    step,
    onChange,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={clsx(inputVariants({ size, tone, state }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
