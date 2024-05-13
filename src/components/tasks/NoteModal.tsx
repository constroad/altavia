import React from 'react'
import { Modal } from '../Modal';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { FormInput, FormTextarea } from '../form';
import { NoteType } from './utils';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteType;
  onChange: (value: string, key: string) => void
  onSubmit?: (e: any) => void
  loading: boolean;
  title: string
}

export const NoteModal = (props: NoteModalProps) => {
  const { isOpen, onClose, onChange, note, loading, onSubmit, title } = props;

  // Renders
  const footer = (
    <Button
      isLoading={loading}
      type="submit"
      autoFocus
      form="add-or-edit-note"
      colorScheme='blue'
      size='sm'
    >
      { title }
    </Button>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer}>

      <Box as='form' onSubmit={onSubmit} id='add-or-edit-note'>
        <Flex flexDir='column'>
          <Text fontWeight={600}>{title}</Text>

          <Flex mt='10px' flexDir='column' gap='10px'>
            <FormInput
              id='reporter-note'
              label='Reporta:'
              value={note?.reporter}
              onChange={(e) => onChange(e.target.value, 'reporter')}
            />

            <FormInput
              id='title-note'
              label='Título:'
              value={note?.title}
              onChange={(e) => onChange(e.target.value, 'title')}
              required
            />

            <FormTextarea
              id='description-note'
              label='Descripción:'
              value={note?.text}
              onChange={(e) => onChange(e.target.value, 'text')}
              height='100px'
            />
          </Flex>
        </Flex>
      </Box>

    </Modal>
  )
}

export default NoteModal;
