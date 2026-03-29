import type { ComponentPropsWithoutRef, ElementRef, ForwardRefExoticComponent, Ref } from 'react';

export type { ComponentPropsWithoutRef, ElementRef, ForwardRefExoticComponent, Ref };

export interface PolymorphicProps<T extends React.ElementType = 'button'> {
  as?: T;
}

export type PolymorphicComponentProps<T extends React.ElementType, P = Record<string, never>> = P & 
  Omit<ComponentPropsWithoutRef<T>, keyof P> & 
  PolymorphicProps<T>;

export interface CommonProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SizeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToneProps {
  tone?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

export interface VariantProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
}
