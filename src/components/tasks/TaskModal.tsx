import React from 'react'
import { Modal } from '../Modal';
import { Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import { FormInput, FormTextarea } from '../form';
import { Status, TaskType } from './utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskType;
  onChange: (value: string | Status, key: string) => void
  onSubmit?: (e: any) => void
  loading: boolean;
  title: string
}

const options = [
  {label: 'Pendiente', value: 'pending'},
  {label: 'En progreso', value: 'in-progress'},
  {label: 'Terminado', value: 'done'},
]

export const TaskModal = (props: TaskModalProps) => {
  const { isOpen, onClose, onChange, task, loading, onSubmit, title } = props;

  // Renders
  const footer = (
    <Button
      isLoading={loading}
      type="submit"
      autoFocus
      form="add-or-edit-task"
      colorScheme='blue'
      size='sm'
    >
      { title }
    </Button>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer}>

      <Box as='form' onSubmit={onSubmit} id='add-or-edit-task'>
        <Flex flexDir='column'>
          <Text fontWeight={600}>{title}</Text>

          <Flex mt='10px' flexDir='column' gap='10px'>
            <FormInput
              id='reporter-task'
              label='Reporta:'
              value={task?.reporter}
              onChange={(e) => onChange(e.target.value, 'reporter')}
            />

            <FormInput
              id='assignee-task'
              label='Asignado a:'
              value={task?.assignee}
              onChange={(e) => onChange(e.target.value, 'assignee')}
            />

            <FormInput
              id='title-task'
              label='Título:'
              value={task?.title}
              onChange={(e) => onChange(e.target.value, 'title')}
              required
            />

            <FormTextarea
              id='description-task'
              label='Descripción:'
              value={task?.content}
              onChange={(e) => onChange(e.target.value, 'content')}
              height='100px'
            />

            <Flex flexDir='column'>
              <Flex fontSize={{ base: 10, md: 12 }} fontWeight={500}>Selecciona el estado de la tarea <Text color='red' ml='4px'>*</Text> </Flex>
              <Select
                mt='4px'
                size='xs'
                id='status-task'
                value={task?.status}
                onChange={(value) => onChange(value.target.value as Status, 'status')}
              >
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Flex>
          </Flex>
        </Flex>
      </Box>

    </Modal>
  )
}

export default TaskModal;
