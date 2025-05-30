import { Button, ButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface CustomIconButtonProps extends Omit<ButtonProps, 'children' | 'size'> {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { boxSize: '30px', fontSize: '18px' },
  md: { boxSize: '40px', fontSize: '22px' },
  lg: { boxSize: '50px', fontSize: '26px' },
} as const

export function CustomIconButton({
  icon,
  size = 'md',
  variant = 'plain',
  ...props
}: CustomIconButtonProps) {
  const { boxSize, fontSize } = sizeMap[size]

  return (
    <Button
      variant={variant}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={0}
      w={boxSize}
      h={boxSize}
      fontSize={fontSize}
      {...props}
    >
      {icon}
    </Button>
  )
}
