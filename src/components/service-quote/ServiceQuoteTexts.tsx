import React, { useState } from 'react'
import { ServiceQuoteNote } from './utils'
import { Button, Flex, Text } from '@chakra-ui/react';
import { FormInput } from '../form';
import { PlusIcon, TrashIcon } from 'src/common/icons';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { useScreenSize } from 'src/common/hooks';

interface ServiceQuoteTextsProps {
  title: string;
  noteType: string;
  notes: ServiceQuoteNote[]
  onChangeNote: (value: string, noteIdx: number, textIdx: number) => void;
  onAddClick: (noteIdx: number) => void;
  onDeleteClick: (noteIdx: number, textIdx: number) => void;
}

const ServiceQuoteTexts = (props: ServiceQuoteTextsProps) => {
  const { notes, noteType, onChangeNote, title, onAddClick, onDeleteClick } = props;

  const [textSelected, setTextSelected] = useState<string | undefined>()
  const { isMobile } = useScreenSize()

  const handleDeleteClick = (textId: string) => {
    setTextSelected(textId)
  }
  const handleCancelDeleteClick = () => {
    setTextSelected(undefined)
  }

  const handleAddClick = () => {
    if ( noteType === 'payment method' ) onAddClick(0)
    else if ( noteType === 'work team' ) onAddClick(1)
    else if ( noteType === 'note' ) onAddClick(2)
    else if ( noteType === 'equipment and tools' ) onAddClick(3)
    else if ( noteType === 'the work to be done contemplates' ) onAddClick(4)
    else if ( noteType === 'proposal includes ') onAddClick(5)
  }

  return (
    <Flex width='100%' flexDir='column' mt={noteType === 'payment method' ? '0px' : '10px'} >
      <Flex width='100%' justifyContent='space-between' alignItems='end' pr={{ base: undefined, md: '56px' }}>
        <Text fontSize={{ base: 10, md: 12 }} fontWeight={600}>{title}</Text>
        <Button width={{ base: '80px', md: '130px' }} h='25px' minH='25px' maxH='25px' onClick={handleAddClick} fontSize={{ base: 10, md: 12 }} colorScheme='blue' gap='5px'>
          Añadir nota <PlusIcon fontSize={ isMobile ? 10 : 12 } />
        </Button>
      </Flex>

      <Flex width='100%' flexDir='column' gap='6px' mt='4px'>
        {notes.map((note, nidx) => note.texts.map( (text, tidx) => {
          if (note.title === noteType) {
            return (
              <Flex key={`${note.title}-${tidx}`} alignItems='end' flexDir='column' width='100%'>
                <Flex alignItems='center' width='100%' gap='5px'>
                  <Text fontSize={{ base: 10, md: 12 }} fontWeight={600}>{tidx + 1}.</Text>
                  <FormInput
                    id={`service-quote-note-${tidx}`}
                    placeholder={text.value}
                    value={text.value.toLowerCase() as string ?? ''}
                    onChange={(e) => onChangeNote(e.target.value, nidx, tidx)}
                  />

                  <Button
                    minW={{ base: '20px', md: '25px' }}
                    w={{ base: '20px', md: '25px' }}
                    h={{ base: '20px', md: '25px' }}
                    minH={{ base: '20px', md: '25px' }}
                    maxH={{ base: '20px', md: '25px' }}
                    px='5px'
                    onClick={() => handleDeleteClick(text.id)}
                    ml={{ base: '5px', md: '25px' }}
                  >
                    <TrashIcon fontSize={10}/>
                  </Button>
                </Flex>
                {textSelected && textSelected === text.id && (
                  <Flex fontSize={{ base: 8, md: 10 }} width='100%' gap='10px' alignItems='center' mt='1px' pl='20px'>
                    <Text color='red' fontWeight={600}>¿Estas seguro de eliminar el texto ({tidx + 1})?</Text>
                    <Button
                      w={{ base: '35px', md: '40px' }}
                      h={{ base: '12px', md: '15px' }}
                      p='3px'
                      minH='12px'
                      minW='15px'
                      fontSize={{ base: 8, md: 10 }}
                      rounded='4px'
                      colorScheme='red'
                      onClick={() => onDeleteClick(nidx, tidx)}
                    >
                      Si
                    </Button>
                    <Button
                      w={{ base: '35px', md: '40px' }}
                      h={{ base: '12px', md: '15px' }}
                      p='3px'
                      minH='12px'
                      minW='15px'
                      fontSize={{ base: 8, md: 10 }}
                      rounded='4px'
                      bg='black'
                      _hover={{ bg: CONSTROAD_COLORS.darkGray }}
                      color='white'
                      onClick={handleCancelDeleteClick}
                    >
                      Cancel
                    </Button>
                  </Flex>
                )}
              </Flex>
            )
          }
        }))}
      </Flex>
    </Flex>
  )
}

export default ServiceQuoteTexts;