import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { CONSTROAD_COLORS } from 'src/styles/shared';

interface DayCardProps {
  startDayWeek: Date;
  selectedDay: Date | undefined;
  onClickDay: (day: Date) => void; 
}

export const DayCard = (props: DayCardProps) => {
  const { startDayWeek, onClickDay, selectedDay } = props;
  const startOfCurrentWeek = startOfWeek(startDayWeek, { weekStartsOn: 0 });
  const currentDay = new Date()

  const days = [...Array(7)].map((_, index) => {
    const day = addDays(startOfCurrentWeek, index);
    const isCurrentDay = format(day, 'dd/MM/yyyy') === format(currentDay, 'dd/MM/yyyy')
    const isSelectedDay = selectedDay ? format(day, 'dd/MM/yyyy') === format(selectedDay, 'dd/MM/yyyy') : null
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
          <Text>Tareas: {20}</Text>
          <Text>Notas: {20}</Text>
        </Flex>
      </Flex>
    );
  });

  return days;
}

export default DayCard;
