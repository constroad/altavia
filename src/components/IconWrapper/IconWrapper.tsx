// src/components/IconWrapper.tsx
import { IconType } from 'react-icons';

type IconWrapperProps = {
  icon: IconType;
  className?: string;
  size?: string | number;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
};

export const IconWrapper = ({
  icon: Icon,
  className,
  size,
  color,
  fontSize,
  fontWeight,
}: IconWrapperProps) => {
  return (
    //@ts-ignore
    <Icon className={className} size={size} color={color} fontSize={fontSize} fontWeight={fontWeight} />
  );
};
