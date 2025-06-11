import React from 'react'
import { Text } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'

interface SubtitleComponentProps {
  text: string;
  fontsize?: number;
  color?: string;
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
        bottom: isMobile ? '6px' : '15px',
        width: '80%',
        height: '4px',
        backgroundColor: 'primary.400'
      }}
    >
      {props.text}
    </Text>
  )
}

export default SubtitleComponent
