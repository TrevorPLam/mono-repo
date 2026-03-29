import forwardRef from '../internal/forward-ref';
import { CommonProps } from '../types/common-props';
import { boxBase, boxVariants, spacingStyles } from './box.css';

export interface BoxProps extends CommonProps {
  as?: keyof JSX.IntrinsicElements;
  display?: keyof typeof boxVariants.display;
  overflow?: keyof typeof boxVariants.overflow;
  position?: keyof typeof boxVariants.position;
  // Spacing props
  p?: keyof typeof spacingStyles.p;
  px?: keyof typeof spacingStyles.px;
  py?: keyof typeof spacingStyles.py;
  pt?: keyof typeof spacingStyles.pt;
  pr?: keyof typeof spacingStyles.pr;
  pb?: keyof typeof spacingStyles.pb;
  pl?: keyof typeof spacingStyles.pl;
  m?: keyof typeof spacingStyles.m;
  mx?: keyof typeof spacingStyles.mx;
  my?: keyof typeof spacingStyles.my;
  mt?: keyof typeof spacingStyles.mt;
  mr?: keyof typeof spacingStyles.mr;
  mb?: keyof typeof spacingStyles.mb;
  ml?: keyof typeof spacingStyles.ml;
  // Layout props
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  // Flexbox props
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  gap?: string | number;
  // Grid props
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string | number;
  gridColumn?: string;
  gridRow?: string;
  // Border props
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  // Background props
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  // Other common props
  opacity?: number;
  visibility?: 'visible' | 'hidden';
  cursor?: string;
  zIndex?: number;
  transform?: string;
  transition?: string;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ 
    className,
    display,
    overflow,
    position,
    // Spacing
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    // Layout
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    // Flexbox
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
    gap,
    // Grid
    gridTemplateColumns,
    gridTemplateRows,
    gridGap,
    gridColumn,
    gridRow,
    // Border
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderRadius,
    // Background
    backgroundColor,
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    // Other
    opacity,
    visibility,
    cursor,
    zIndex,
    transform,
    transition,
    ...props 
  }, ref) => {
    const classNames = [
      boxBase,
      display && boxVariants.display[display],
      overflow && boxVariants.overflow[overflow],
      position && boxVariants.position[position],
      p && spacingStyles.p[p],
      px && spacingStyles.px[px],
      py && spacingStyles.py[py],
      pt && spacingStyles.pt[pt],
      pr && spacingStyles.pr[pr],
      pb && spacingStyles.pb[pb],
      pl && spacingStyles.pl[pl],
      m && spacingStyles.m[m],
      mx && spacingStyles.mx[mx],
      my && spacingStyles.my[my],
      mt && spacingStyles.mt[mt],
      mr && spacingStyles.mr[mr],
      mb && spacingStyles.mb[mb],
      ml && spacingStyles.ml[ml],
      className,
    ].filter(Boolean).join(' ');

    const style = {
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      flexDirection,
      justifyContent,
      alignItems,
      flexWrap,
      flexGrow,
      flexShrink,
      flexBasis,
      gap,
      gridTemplateColumns,
      gridTemplateRows,
      gridGap,
      gridColumn,
      gridRow,
      border,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      borderRadius,
      backgroundColor,
      backgroundImage,
      backgroundSize,
      backgroundPosition,
      backgroundRepeat,
      opacity,
      visibility,
      cursor,
      zIndex,
      transform,
      transition,
    };

    return (
      <div
        ref={ref}
        className={classNames}
        style={style}
        {...props}
      />
    );
  }
);

Box.displayName = 'Box';
