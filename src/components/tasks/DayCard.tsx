import React from 'react'
import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { NoteType, TaskType, sameDay } from './utils';

interface DayCardProps {
  startDayWeek: Date;
  selectedDay: Date | undefined;
  onClickDay: (day: Date) => void;
  tasksDB: TaskType[];
  notesDB: NoteType[];
  tasksLoading: boolean;
  notesLoading: boolean;
}

export const DayCard = (props: DayCardProps) => {
  const { startDayWeek, onClickDay, selectedDay, tasksLoading, notesLoading } = props;
  const startOfCurrentWeek = startOfWeek(startDayWeek, { weekStartsOn: 0 });
  const currentDay = new Date()

  const days = [...Array(7)].map((_, index) => {
    const day = addDays(startOfCurrentWeek, index);
    const isCurrentDay = format(day, 'dd/MM/yyyy') === format(currentDay, 'dd/MM/yyyy')
    const isSelectedDay = selectedDay ? format(day, 'dd/MM/yyyy') === format(selectedDay, 'dd/MM/yyyy') : null
    const notesNumber = props.notesDB.filter(note => sameDay(new Date(note.date), new Date(day))).length
    const tasksNumber = props.tasksDB.filter(task => sameDay(new Date(task.date), new Date(day))).length
    return (
      <Flex
        key={index}
        flex="1"
        justifyContent="space-between"
        flexDir='column'
        alignItems="start"
        borderWidth="1px"
        borderColor='gray.400'
        p="2"
        h='70px'
        minH='70px'
        borderRadius="md"
        cursor="pointer"
        onClick={() => onClickDay(day)}
        backgroundColor={ isCurrentDay && !isSelectedDay ? CONSTROAD_COLORS.lightGray : isSelectedDay ? CONSTROAD_COLORS.yellow : undefined }
        _hover={{ bg: isCurrentDay && !isSelectedDay ? 'gray.400' : isSelectedDay ? CONSTROAD_COLORS.darkYellow : 'gray.100' }}
      >
        <Flex>
          <Text fontSize={{ base: 12, md: 14 }} fontWeight={600} textTransform='capitalize'>{format(day, 'EEEE', { locale: es })}</Text>
          <Text fontSize={{ base: 12, md: 14 }} fontWeight={600} ml='5px'>{format(day, 'dd/MM')}</Text>
        </Flex>

        <Flex fontSize={{ base: 12, md: 12 }} fontWeight={300} color='gray.900' justifyContent='space-between' width='100%'>
          <Flex>
            {tasksLoading ?
              <CircularProgress
                isIndeterminate
                color="white"
                size="15px"
                thickness="10px"
                trackColor="green.500"
              /> :
              <Text>Tareas: {tasksNumber}</Text>
            }
          </Flex>
          <Flex>
            {notesLoading ?
              <CircularProgress
                isIndeterminate
                color="white"
                size="15px"
                thickness="10px"
                trackColor="green.500"              
              /> :
              <Text>Notas: {notesNumber}</Text>
            }
          </Flex>
        </Flex>
      </Flex>
    );
  });

  return days;
}

export default DayCard;
