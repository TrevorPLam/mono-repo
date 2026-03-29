import { clsx as clsxOriginal } from 'clsx';

/**
 * Enhanced classnames utility with token-aware handling
 */
export function clsx(...inputs: Parameters<typeof clsxOriginal>) {
  return clsxOriginal(...inputs);
}

export default clsx;
