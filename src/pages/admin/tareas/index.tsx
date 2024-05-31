import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { AdministrationLayout, DayCard, Modal, NoteModal, NoteType, Status, TaskModal, TaskType, getCurrentMonth, initialNote, initialTask, sameDay, toast } from 'src/components';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useAsync, useScreenSize } from 'src/common/hooks';
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { useRouter } from 'next/router';
import { useSidebar } from 'src/context';
import { EditIcon, PlusIcon, TrashIcon } from 'src/common/icons';
import axios from 'axios';

const currentDay = new Date()
const fetcher = (path: string) => axios.get(path)
const postItem = (path: string, data: TaskType | NoteType) => axios.post(path, { data })
const updateItem = (path: string, data: TaskType | NoteType) => axios.put(path, { data})
const deleteItem = (path: string) => axios.delete(path)

export const TasksPage = () => {
  const [startDayWeek, setStartDayWeek] = useState( new Date() );
  const [dayTasks, setDayTasks] = useState<TaskType[]>([])
  const [dayNotes, setDayNotes] = useState<NoteType[]>([])

  const [tasksDB, setTasksDB] = useState<TaskType[]>([])
  const [task, setTask] = useState<TaskType>( initialTask )
  const [taskSelected, setTaskSelected] = useState<TaskType>()

  const [notesDB, setNotesDB] = useState<NoteType[]>([])
  const [note, setNote] = useState<NoteType>( initialNote )
  const [noteSelected, setNoteSelected] = useState<NoteType>()

  const { daySelectedTask, setDaySelectedTask } = useSidebar();
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()

  const { run: runGetTasksDB, isLoading: isLoadingTasks, refetch: refetchTasks } = useAsync({ onSuccess(data) { setTasksDB(data.data) } })
  const { run: runAddTask, isLoading: addingTask } = useAsync();
  const { run: runEditTask, isLoading: editingTask } = useAsync();
  const { run: runDeleteTask, isLoading: deletingTask } = useAsync()

  const { run: runGetNotesDB, isLoading: isLoadingNotes, refetch: refetchNotes } = useAsync({ onSuccess(data) { setNotesDB(data.data) } })
  const { run: runAddNote, isLoading: addingNote } = useAsync();
  const { run: runEditNote, isLoading: editingNote } = useAsync();
  const { run: runDeleteNote, isLoading: deletingNote } = useAsync()

  const { isOpen: isOpenTaskModal, onOpen: onOpenTaskModal, onClose: onCloseTaskModal } = useDisclosure()
  const { isOpen: isOpenNoteModal, onOpen: onOpenNoteModal, onClose: onCloseNoteModal } = useDisclosure()
  const { isOpen: isOpenDeleteTask, onOpen: onOpenDeleteTask, onClose: onCloseDeleteTask } = useDisclosure()
  const { isOpen: isOpenDeleteNote, onOpen: onOpenDeleteNote, onClose: onCloseDeleteNote } = useDisclosure()

  // **** EFFECTS **** //
  useEffect(() => {
    if (isDesktop) {
      const today = new Date()
      setDaySelectedTask(today)
    }
  }, [])

  useEffect(() => {
    runGetTasksDB(fetcher(API_ROUTES.task), {
      refetch: () => runGetTasksDB(fetcher(API_ROUTES.task)),
    })
    runGetNotesDB(fetcher(API_ROUTES.note), {
      refetch: () => runGetNotesDB(fetcher(API_ROUTES.note)),
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
    if (!taskSelected && daySelectedTask) setTask({...initialTask, date: new Date(daySelectedTask!).toISOString() })
    else setTaskSelected(taskSelected)

    if (!noteSelected && daySelectedTask) setNote({...initialNote, date: new Date(daySelectedTask!).toISOString() })
    else setNoteSelected(noteSelected)

  }, [taskSelected, daySelectedTask, noteSelected])

  // **** DATE MANAGEMENT **** //
  const handlePrevWeekClick = () => {
    setStartDayWeek(prevDate => addDays(prevDate, -7));
  };
  const handleNextWeekClick = () => {
    setStartDayWeek(prevDate => addDays(prevDate, 7));
  };
  const handleCurrentWeekClick = () => {
    setStartDayWeek(new Date());
  };
  const handleSelectDateClick = (date: Date) => {
    if (isMobile) {
      router.push(ADMIN_ROUTES.selectedDayTask)
    }
    setDaySelectedTask(date);
  };
  
  const currentMonth = getCurrentMonth(startDayWeek)
  const yearOfCurrentWeek = startOfWeek(startDayWeek, { weekStartsOn: 0 }).getFullYear();

  // **** TASK MANAGEMENT **** //
  const onAddTaskClick = () => {
    onOpenTaskModal()
  }
  const onEditTaskClick = (item: TaskType) => {
    setTaskSelected(item)
    onOpenTaskModal()
  }
  const handleCloseTaskModal = () => {
    setTaskSelected(undefined)
    onCloseTaskModal()
  }
  const onChangeTaskData = (value: string | Status, key: string) => {
    if (taskSelected) setTaskSelected({...taskSelected, [key]: value}) 
    else setTask({...task, [key]: value}) 
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
  const handleDeleteTaskCloseModal = () => {
    setTaskSelected(undefined)
    onCloseDeleteTask()
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

  // **** NOTES MANAGEMENT **** //
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

  // **** CONSTS **** //
  const taskTitle = taskSelected ? 'Editar tarea' : 'Añadir nueva tarea'
  const noteTitle = noteSelected ? 'Editar nota' : 'Añadir nueva nota'

  const pendingTasks = dayTasks!?.filter(item => item.status === 'pending') ?? []
  const inProgressTasks = dayTasks!?.filter(item => item.status === 'in-progress') ?? []
  const doneTasks = dayTasks!?.filter(item => item.status === 'done') ?? []

  const notes = dayNotes!

  // **** RENDERS **** //
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
      <Box w='100%'>
        <Flex alignItems="center" justifyContent="space-between" mb='2px'>
          <Flex flexDir='column'>
            <Text textTransform='capitalize' fontWeight={600} fontSize={{ base: 15, md: 18 }} lineHeight='18px'>
              {currentMonth} {yearOfCurrentWeek}
            </Text>
          </Flex>
          <Flex gap='4px'>
            <Button
              h={{ base: '25px', md: '35px' }}
              w={{ base: '25px', md: '35px' }}
              px='5px'
              minW='25px'
              fontSize={{ base: 12, md: 14 }}
              onClick={handlePrevWeekClick}
            >
              &lt;
            </Button>
            
            <Button
              h={{ base: '25px', md: '35px' }}
              w={{ base: '35px', md: '65px' }}
              px='5px'
              minW='35px'
              fontSize={{ base: 12, md: 14 }}
              onClick={handleCurrentWeekClick}
              >
                Hoy
              </Button>
            <Button
              h={{ base: '25px', md: '35px' }}
              w={{ base: '25px', md: '35px' }}
              px='5px'
              minW='25px'
              fontSize={{ base: 12, md: 14 }}
              onClick={handleNextWeekClick}
            >
              &gt;
            </Button>
          </Flex>
        </Flex>

        {isDesktop && (
          <Flex gap='50px' fontSize={12} width='100%' justifyContent='start' mt='2px'>
            <Flex alignItems='center'>
              Día actual <Box bg={CONSTROAD_COLORS.lightGray} w='10px' h='10px' ml='5px' border='0.5px solid' />
            </Flex>

            <Flex alignItems='center'>
              Día seleccionado <Box bg={CONSTROAD_COLORS.yellow} w='10px' h='10px' ml='5px' border='0.5px solid' />
            </Flex>
          </Flex>
        )}

        <Flex flexDir={{ base: 'column', md: 'row' }} mt='1px' gap='10px'>
          <DayCard
            startDayWeek={startDayWeek}
            selectedDay={daySelectedTask}
            onClickDay={handleSelectDateClick}
            tasksDB={tasksDB}
            notesDB={notesDB}
            tasksLoading={isLoadingTasks}
            notesLoading={isLoadingNotes}
          />
        </Flex>

        {isDesktop && (
          <Flex flexDir='row' width='100%' justifyContent='space-between' mt='30px'>
            <Flex width='79%' rounded='6px' border='1px solid' borderColor='gray.400' h='450px' flexDir='column'>
              <Flex fontSize={12} fontWeight={600} bg='black' color='white' roundedTop='5px' px='8px' py='3px' justifyContent='space-between'>
                <Flex gap='20px'>
                  <Text>TAREAS ({dayTasks.length})</Text>
                  {/* <Flex>
                    <Text fontWeight={600} textTransform='lowercase'>{'(' + format(daySelectedTask ?? currentDay, 'EEEE', { locale: es })}</Text>
                    <Text fontWeight={600} ml='5px'>{format(daySelectedTask ?? currentDay, 'dd/MM') + ')'}</Text>
                  </Flex> */}
                </Flex>

                <Flex>
                  <Button maxH='16px' p={0} colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={onAddTaskClick} fontSize={12} px='4px'>
                    Añadir tarea <PlusIcon fontSize={10} className='ml-[5px]'/>
                  </Button>
                </Flex>
              </Flex>
              <Flex gap='10px' mt='5px' py='2px' px='8px'>
                <Flex flex={1} h='400px' rounded='6px' border='0.5px solid' flexDir='column' gap='4px'>
                  <Text fontSize={12} fontWeight={600} bg='black' color='white' roundedTop='6px' px='6px'>PENDIENTE</Text>
                  <Flex w='100%' flexDir='column' gap='2px' px='6px' py='2px'>
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
                      <Flex w='100%' justifyContent='center' fontSize={10} h='100px' alignItems='center'>No hay tareas pendientes.</Flex>
                    )}
                  </Flex>
                </Flex>

                <Flex flex={1} h='400px' rounded='6px' border='0.5px solid' flexDir='column' gap='4px'>
                  <Text fontSize={12} fontWeight={600} bg='black' color='white' roundedTop='6px' px='6px'>EN PROGRESO</Text>
                  <Flex w='100%' flexDir='column' gap='2px' px='6px' py='2px'>
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
                      <Flex w='100%' justifyContent='center' fontSize={10} h='100px' alignItems='center'>No hay tareas en progreso.</Flex>
                    )}
                  </Flex>
                </Flex>

                <Flex flex={1} h='400px' rounded='6px' border='0.5px solid' flexDir='column' gap='4px'>
                  <Text fontSize={12} fontWeight={600} bg='black' color='white' roundedTop='6px' px='6px'>TERMINADO</Text>
                  <Flex w='100%' flexDir='column' gap='2px' px='6px' py='2px'>
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
                      <Flex w='100%' justifyContent='center' fontSize={10} h='100px' alignItems='center'>No hay tareas terminadas.</Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex width='20%' rounded='6px' border='1px solid' borderColor='gray.400' h='450px' flexDir='column'>
              <Flex fontSize={12} fontWeight={600} roundedTop='5px' bg='black' color='white' width='100%' px='8px' py='3px' justifyContent='space-between'>
                <Text> NOTAS ({notes.length}) </Text>
                <Flex>
                  <Button fontSize={12} px='4px' maxH='16px' colorScheme='gray' rounded='4px' border='0.5px solid black' onClick={onAddNoteClick}>
                    Añadir nota <PlusIcon fontSize={10} className='ml-[5px]'/>
                  </Button>
                </Flex>
              </Flex>

              <Flex w='100%' flexDir='column' gap='2px' px='6px' py='2px' mt='5px'>
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
        )}
      </Box>

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
  );
};

export default TasksPage;
