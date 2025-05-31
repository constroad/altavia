import { Link, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

type FooterProps = {
  href: string
  icon: ReactNode
  label: string
  target?: string
}

export const FooterLink = (props: FooterProps) => {
  return (
    <Link
      href={props.href}
      display='flex'
      alignItems='center'
      marginTop='5px'
      gap='8px'
      target={ props.target ?? undefined }
    >
      {props.icon}
      <Text width='100%' textAlign='justify' fontSize={{ base: 14, md: 16 }} fontWeight={600} className='font-logo' mt='4px' color='white'>
        {props.label}
      </Text>
    </Link>
  )
}
