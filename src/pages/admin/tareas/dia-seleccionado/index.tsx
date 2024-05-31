import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { AdministrationLayout, Modal, NoteModal, NoteType, Status, TaskModal, TaskType, initialNote, initialTask, sameDay, toast } from 'src/components';
import { useSidebar } from 'src/context';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EditIcon, PlusIcon, TrashIcon } from 'src/common/icons';
import { useAsync } from 'src/common/hooks';
import axios from 'axios';

const fetcher = (path: string) => axios.get(path)
const postItem = (path: string, data: TaskType | NoteType) => axios.post(path, { data })
const updateItem = (path: string, data: TaskType | NoteType) => axios.put(path, { data})
const deleteItem = (path: string) => axios.delete(path)

// const currentDay = new Date()
export const SelectedDayPage = () => {
  const [titleDay, setTitleDay] = useState<string>('')
  const [tasksDB, setTasksDB] = useState<TaskType[]>([])
  const [dayTasks, setDayTasks] = useState<TaskType[]>([])
  const [notesDB, setNotesDB] = useState<NoteType[]>([])
  const [dayNotes, setDayNotes] = useState<NoteType[]>([])

  const [task, setTask] = useState<TaskType>( initialTask )
  const [taskSelected, setTaskSelected] = useState<TaskType>()
  const [note, setNote] = useState<NoteType>( initialNote )
  const [noteSelected, setNoteSelected] = useState<NoteType>()

  const { run: runGetTasksDB, isLoading: isLoadingTasks, refetch: refetchTasks } = useAsync({ onSuccess(data) { setTasksDB(data.data) } })
  const { run: runAddTask, isLoading: addingTask } = useAsync();
  const { run: runEditTask, isLoading: editingTask } = useAsync();
  const { run: runDeleteTask, isLoading: deletingTask } = useAsync()

  const { run: runGetNotesDB, isLoading: isLoadingNotes, refetch: refetchNotes } = useAsync({ onSuccess(data) { setNotesDB(data.data) } })
  const { run: runAddNote, isLoading: addingNote } = useAsync();
  const { run: runEditNote, isLoading: editingNote } = useAsync();
  const { run: runDeleteNote, isLoading: deletingNote } = useAsync()

  const { daySelectedTask, setDaySelectedTask } = useSidebar();
  const { isOpen: isOpenTaskModal, onOpen: onOpenTaskModal, onClose: onCloseTaskModal } = useDisclosure()
  const { isOpen: isOpenNoteModal, onOpen: onOpenNoteModal, onClose: onCloseNoteModal } = useDisclosure()
  const { isOpen: isOpenDeleteTask, onOpen: onOpenDeleteTask, onClose: onCloseDeleteTask } = useDisclosure()
  const { isOpen: isOpenDeleteNote, onOpen: onOpenDeleteNote, onClose: onCloseDeleteNote } = useDisclosure()
  const router = useRouter()

  // Effects
  useEffect(() => {
    runGetTasksDB(fetcher(API_ROUTES.task), {
      refetch: () => runGetTasksDB(fetcher(API_ROUTES.task)),
      // cacheKey: API_ROUTES.task
    })
    runGetNotesDB(fetcher(API_ROUTES.note), {
      refetch: () => runGetNotesDB(fetcher(API_ROUTES.note)),
      // cacheKey: API_ROUTES.task
    })
  }, [])

  useEffect(() => {
    if (daySelectedTask) {
      const tasksForDay = tasksDB?.filter((item) => sameDay(new Date(item.date), new Date(daySelectedTask)) )
      setDayTasks(tasksForDay ?? [])

      const notesForDay = notesDB?.filter((item) => sameDay(new Date(item.date), new Date(daySelectedTask)) )
      setDayNotes(notesForDay ?? [])
    }
  }, [tasksDB, daySelectedTask, notesDB])

  useEffect(() => {
    // Titulo de la pagina day selected
    if (daySelectedTask) {
      const date = new Date(daySelectedTask);
      const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es });
      setTitleDay(formattedDate.toUpperCase())
    }
  }, [daySelectedTask])

  useEffect(() => {
    if (!taskSelected && daySelectedTask) {
      setTask({...initialTask, date: new Date(daySelectedTask!).toISOString() })
    } else {
      setTaskSelected(taskSelected)
    }

    if (!noteSelected && daySelectedTask) {
      setNote({...initialNote, date: new Date(daySelectedTask!).toISOString() })
    } else {
      setNoteSelected(noteSelected)
    }
  }, [taskSelected, daySelectedTask, noteSelected])

  const handleBackClick = () => {
    setDaySelectedTask(undefined)
    router.push(ADMIN_ROUTES.tasks)
  }

  // ---- TASKS ---- //
  const onAddTaskClick = () => {
    onOpenTaskModal()
  }
  const onEditTaskClick = (item: TaskType) => {
    setTaskSelected(item)
    onOpenTaskModal()
  }
  const onSubmitTask = (e: any) => {
    e.preventDefault();
    if ( !taskSelected ) {
      const addTask: TaskType = {
        date: task.date,
        reporter: task.reporter,
        assignee: task.assignee,
        title: task.title,
        content: task.content,
        status: task.status
        
      }
      runAddTask(postItem(API_ROUTES.task, addTask), {
        onSuccess: () => {
          toast.success('Tarea creada con éxito!')
          refetchTasks()
          handleCloseTaskModal()
        }, 
        onError(error) {
          console.log(error)
          toast.error('Hubo un problema al crear la tarea')
        },
      })

    } else {
      const editTask: TaskType = {
        date: taskSelected.date,
        reporter: taskSelected.reporter,
        assignee: taskSelected.assignee,
        title: taskSelected.title,
        content: taskSelected.content,
        status: taskSelected.status
      }
      runEditTask(updateItem(`${API_ROUTES.task}/${taskSelected?._id}`, editTask), {
        onSuccess: () => {
          toast.success('Editaste correctamente la tarea')
          refetchTasks()
          handleCloseTaskModal()
        },
        onError(error) {
          console.log(error)
          toast.error('Hubo un problema al editar la tarea')
        },
      })
    }
  }

  const onChangeTaskData = (value: string | Status, key: string) => {
    if (taskSelected) {
      setTaskSelected({...taskSelected, [key]: value})

    } else {
      setTask({...task, [key]: value}) 
    }
  }

  const handleCloseTaskModal = () => {
    setTaskSelected(undefined)
    onCloseTaskModal()
  }

  const onDeleteTaskClick = (item: TaskType) => {
    setTaskSelected(item)
    onOpenDeleteTask()
  }

  const handleDeleteTask = () => {
    runDeleteTask(deleteItem(`${API_ROUTES.task}/${taskSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste la tarea ${taskSelected?.title}`)
        refetchTasks()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al eliminar la tarea')
      }
    })

    handleDeleteTaskCloseModal()
  }

  const handleDeleteTaskCloseModal = () => {
    setTaskSelected(undefined)
    onCloseDeleteTask()
  }

  // ----  NOTES  ---- //
  const onAddNoteClick = () => {
    onOpenNoteModal()
  }
  const onEditNoteClick = (item: NoteType) => {
    setNoteSelected(item)
    onOpenNoteModal()
  }
  const onSubmitNote = (e: any) => {
    e.preventDefault();
    if ( !noteSelected ) {
      const addNote: NoteType = {
        date: note.date,
        reporter: note.reporter,
        title: note.title,
        text: note.text,
      }
      runAddNote(postItem(API_ROUTES.note, addNote), {
        onSuccess: () => {
          toast.success('Nota creada con éxito!')
          refetchNotes()
          handleCloseNoteModal()
        }, 
        onError(error) {
          console.log(error)
          toast.error('Hubo un problema al crear la nota')
        },
      })

    } else {
      const editNote: NoteType = {
        date: noteSelected.date,
        reporter: noteSelected.reporter,
        title: noteSelected.title,
        text: noteSelected.text,
      }
      runEditNote(updateItem(`${API_ROUTES.note}/${noteSelected?._id}`, editNote), {
        onSuccess: () => {
          toast.success('Editaste correctamente la nota')
          refetchNotes()
          handleCloseNoteModal()
        },
        onError(error) {
          console.log(error)
          toast.error('Hubo un problema al editar la nota')
        },
      })
    }
  }

  const onChangeNoteData = (value: string, key: string) => {
    if (noteSelected) {
      setNoteSelected({...noteSelected, [key]: value})

    } else {
      setNote({...note, [key]: value}) 
    }
  }

  const handleCloseNoteModal = () => {
    setNoteSelected(undefined)
    onCloseNoteModal()
  }

  const onDeleteNoteClick = (item: NoteType) => {
    setNoteSelected(item)
    onOpenDeleteNote()
  }

  const handleDeleteNote = () => {
    runDeleteNote(deleteItem(`${API_ROUTES.note}/${noteSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste la nota ${noteSelected?.title}`)
        refetchNotes()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al eliminar la nota')
      }
    })

    handleDeleteNoteCloseModal()
  }

  const handleDeleteNoteCloseModal = () => {
    setNoteSelected(undefined)
    onCloseDeleteNote()
  }

  // consts
  const pendingTasks = dayTasks!?.filter(item => item.status === 'pending') ?? []
  const inProgressTasks = dayTasks!?.filter(item => item.status === 'in-progress') ?? []
  const doneTasks = dayTasks!?.filter(item => item.status === 'done') ?? []

  const taskTitle = taskSelected ? 'Editar tarea' : 'Añadir nueva tarea'
  const noteTitle = noteSelected ? 'Editar nota' : 'Añadir nueva nota'

  const notes = dayNotes!

  // Renders
  const deleteFooterTask = (
    <Button
      isLoading={deletingTask}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteTask}
    >
      Confirmar
    </Button>
  )
  const deleteFooterNote = (
    <Button
      isLoading={deletingNote}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteNote}
    >
      Confirmar
    </Button>
  )

  return (
    <AdministrationLayout>
      <Flex w='100%' flexDir='column'>
        <Flex w='100%' justifyContent='space-between' alignItems='center'>
          <Text fontSize={{ base: 12, md: 14 }} fontWeight={600}>
            {titleDay}
          </Text>
          <Button onClick={handleBackClick} size='xs' colorScheme='gray'>
            Volver
          </Button>
        </Flex>

        
        <Flex flexDir='row' width='100%' justifyContent='space-between' mt='5px' flexDirection='column' gap='20px'>
          <Flex width='100%' rounded='6px' border='1px solid' borderColor='gray.400' minH='200px' maxH='450px' flexDir='column'>
            <Flex fontSize={12} fontWeight={600} bg='black' color='white' roundedTop='5px' px='8px' py='3px' justifyContent='space-between'>
              <Text>TAREAS ({dayTasks.length})</Text>
              <Flex>
                <Button size='xs' fontSize={10} fontWeight={600} p={0} px='3px' colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={onAddTaskClick} maxH='16px'>
                  Añadir tarea <PlusIcon fontSize={10} className='ml-[5px]'/>
                </Button>
              </Flex>
            </Flex>

            <Flex gap='10px' my='5px' py='2px' px='8px' flexDir='column' maxH='510px'>

              <Flex maxH='150px' minH='54px' rounded='6px' border='0.5px solid' flexDir='column'>
                <Flex width='100%' justifyContent='space-between' alignItems='center' bg='black' roundedTop='6px' px='4px' py='4px' borderBottom='0.5px black solid'>
                  <Text fontSize={10} fontWeight={600} textAlign='center' color='white'>PENDIENTES ({pendingTasks.length})</Text>
                </Flex>

                <Flex flexDir='column' gap='4.5px' mt='4px' px='4px' overflowY='scroll' pb='4px'>
                  {pendingTasks.map(item => (
                    <Flex key={item.title} fontSize={{ base: 10, md: 12 }} fontWeight={600} px='4px' py='2px' border='0.5px solid' rounded='4px' justifyContent='space-between' alignItems='center'>
                      <Text isTruncated pr='4px'>{item.title}</Text>
                      <Flex gap='4px'>
                        <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onEditTaskClick(item)}>
                          <EditIcon fontSize={8} />
                        </Button>
                        <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onDeleteTaskClick(item)}>
                          <TrashIcon fontSize={8} />
                        </Button>
                      </Flex>
                    </Flex>
                  ))}
                  {pendingTasks.length === 0 && (
                    <Flex w='100%' justifyContent='center' fontSize={10} >No hay tareas pendientes.</Flex>
                  )}
                </Flex>
              </Flex>

              <Flex maxH='150px' minH='54px' rounded='6px' border='0.5px solid' flexDir='column'>
                <Flex width='100%' justifyContent='space-between' alignItems='center' bg='black' roundedTop='6px' px='4px' py='4px' borderBottom='0.5px solid black'>
                  <Text fontSize={10} fontWeight={600} textAlign='center' color='white'>EN PROGRESO ({inProgressTasks.length})</Text>
                </Flex>

                <Flex flexDir='column' gap='4.5px' mt='4px' px='4px' overflowY='scroll' pb='4px'>
                  {inProgressTasks.map(item => (
                    <Flex key={item.title} fontSize={{ base: 10, md: 12 }} fontWeight={600} px='4px' py='2px' border='0.5px solid' rounded='4px' justifyContent='space-between' alignItems='center'>
                      <Text isTruncated pr='4px'>{item.title}</Text>
                      <Flex gap='4px'>
                        <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onEditTaskClick(item)}>
                          <EditIcon fontSize={8} />
                        </Button>
                        <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onDeleteTaskClick(item)}>
                          <TrashIcon fontSize={8} />
                        </Button>
                      </Flex>
                    </Flex>
                  ))}
                  {inProgressTasks.length === 0 && (
                    <Flex w='100%' justifyContent='center' fontSize={10} >No hay tareas en progreso.</Flex>
                  )}
                </Flex>
              </Flex>

              <Flex maxH='150px' minH='54px' rounded='6px' border='0.5px solid' flexDir='column'>
                <Flex width='100%' justifyContent='space-between' alignItems='center' bg='black' roundedTop='6px' px='4px' py='4px' borderBottom='0.5px solid black'>
                  <Text fontSize={10} fontWeight={600} textAlign='center' color='white'>TERMINADOS ({doneTasks.length})</Text>
                </Flex>

                <Flex flexDir='column' gap='4.5px' mt='4px' px='4px' overflowY='scroll' pb='4px'>
                  {doneTasks.map(item => (
                    <Flex key={item.title} fontSize={{ base: 10, md: 12 }} fontWeight={600} px='4px' py='2px' border='0.5px solid' rounded='4px' justifyContent='space-between' alignItems='center'>
                      <Text isTruncated pr='4px'>{item.title}</Text>
                      <Flex gap='4px'>
                        <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onEditTaskClick(item)}>
                          <EditIcon fontSize={8} />
                        </Button>
                        <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onDeleteTaskClick(item)}>
                          <TrashIcon fontSize={8} />
                        </Button>
                      </Flex>
                    </Flex>
                  ))}
                  {doneTasks.length === 0 && (
                    <Flex w='100%' justifyContent='center' fontSize={10} >No hay tareas terminadas.</Flex>
                  )}
                </Flex>
              </Flex>
            </Flex>

          </Flex>

          <Flex width='100%' rounded='6px' border='1px solid' borderColor='gray.400' minH='54px' maxH='150px' flexDir='column'>
            <Flex fontSize={12} fontWeight={600} roundedTop='5px' bg='black' color='white' width='100%' px='4px' py='3px' w='100%' justifyContent='space-between' alignItems='center'>
              <Text>NOTAS ({notes.length})</Text>
              <Button size='xs' fontSize={10} fontWeight={600} p={0} px='3px' colorScheme='gray' rounded='4px' onClick={onAddNoteClick} maxH='16px'>
                Añadir nota <PlusIcon fontSize={10} className='ml-[5px]'/>
              </Button>
            </Flex>

            <Flex flexDir='column' gap='4.5px' mt='4px' px='4px' overflowY='scroll' pb='4px'>
              {notes?.map(item => (
                <Flex key={item.title} fontSize={{ base: 10, md: 12 }} fontWeight={600} px='4px' py='2px' border='0.5px solid' rounded='4px' justifyContent='space-between' alignItems='center'>
                  <Text isTruncated pr='4px'>{item.title}</Text>
                  <Flex gap='4px'>
                    <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onEditNoteClick(item)}>
                      <EditIcon fontSize={8} />
                    </Button>
                    <Button maxW='14px' minW='14px' maxH='14px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={() => onDeleteNoteClick(item)}>
                      <TrashIcon fontSize={8} />
                    </Button>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Flex>

        </Flex>
      </Flex>

      {/* Modal to create or edit a task */}
      <TaskModal
        isOpen={isOpenTaskModal}
        onClose={handleCloseTaskModal}
        task={taskSelected ? taskSelected : task}
        onChange={onChangeTaskData}
        onSubmit={onSubmitTask}
        loading={taskSelected ? editingTask : addingTask}
        title={taskTitle}
      />
      {/* Delete task modal */}
      <Modal
        isOpen={isOpenDeleteTask}
        onClose={handleDeleteTaskCloseModal}
        heading={`¿Estás seguro de eliminar la tarea "${taskSelected?.title}"?`}
        footer={deleteFooterTask}
      />


      {/* Modal to create or edit a note */}
      <NoteModal
        isOpen={isOpenNoteModal}
        onClose={handleCloseNoteModal}
        note={noteSelected ? noteSelected : note}
        onChange={onChangeNoteData}
        onSubmit={onSubmitNote}
        loading={noteSelected ? editingNote : addingNote}
        title={noteTitle}
      />
      {/* Delete note modal */}
      <Modal
        isOpen={isOpenDeleteNote}
        onClose={handleDeleteNoteCloseModal}
        heading={`¿Estás seguro de eliminar la nota "${noteSelected?.title}"?`}
        footer={deleteFooterNote}
      />

    </AdministrationLayout>
  )
}

export default SelectedDayPage;
