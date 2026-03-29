import { useState, useCallback } from 'react';

/**
 * Hook for managing state that can be controlled externally or uncontrolled internally
 */
export function useControllableState<T>(
  defaultValue: T,
  controlledValue?: T,
  onChange?: (value: T) => void
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const setValue = useCallback((newValue: T) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  return [value, setValue] as const;
}
