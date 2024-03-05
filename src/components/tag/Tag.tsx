import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon } from 'src/common/icons'
import { CONSTROAD_COLORS } from 'src/styles/shared'

interface TagProps {
  tag: string
  onDelete?: (tag: string) => void;
}

export const Tag = (props: TagProps) => {
  const { tag, onDelete } = props;
  return (
    <Flex
      justifyContent='space-between'
      alignItems='center'
      px='2px'
      rounded='6px'
      background={CONSTROAD_COLORS.yellow}
      color='black'
      h='16px'
      gap={onDelete ? '3px' : '0px'}
    >
      <Text
        fontSize={10}
        maxWidth='70px'
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        {tag}
      </Text>

      {onDelete && (
        <Flex p='1px' rounded='full' bg='black' color='white' cursor='pointer' onClick={() => onDelete(tag)}>
          <CloseIcon fontSize={11} />
        </Flex>
      )}
    </Flex>
  )
}

export default Tag
