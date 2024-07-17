import React from 'react'
import { Text } from '@chakra-ui/react'
import { CONSTROAD_COLORS } from 'src/styles/shared'
import { useScreenSize } from 'src/common/hooks'

interface SubtitleComponentProps {
  text: string;
  fontsize?: number;
}

export const SubtitleComponent = (props: SubtitleComponentProps) => {
  const { isMobile } = useScreenSize()
  return (
    <Text
      as='h2'
      fontSize={{ base: props.fontsize ?? 22, md: 40 }}
      fontWeight={800}
      color='black'
      className='font-logo'
      w='fit-content'
      position='relative'
      _after={{
        content: '""',
        position: 'absolute',
        left: '0px',
        bottom: isMobile ? '6px' : '15px', // Ajusta esta distancia si es necesario
        width: '80%', // Controla el ancho del subrayado aquí
        height: '4px',
        backgroundColor: CONSTROAD_COLORS.darkOrange // Cambia esto al color que prefieras
      }}
    >
      {props.text}
    </Text>
  )
}

export default SubtitleComponent
