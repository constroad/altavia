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
      <Text width='100%' textAlign='justify' fontSize={14} fontWeight={400}>
        {props.label}
      </Text>
    </Link>
  )
}
