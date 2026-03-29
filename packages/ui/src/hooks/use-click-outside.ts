import { useEffect, RefObject } from 'react';

/**
 * Hook for detecting clicks outside a specific element
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  onClickOutside: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, onClickOutside]);
}
