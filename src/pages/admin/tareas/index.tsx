import React, { useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { AdministrationLayout, DayCard, TaskType, getCurrentMonth, initialTask } from 'src/components';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useScreenSize } from 'src/common/hooks';
import { CONSTROAD } from 'src/common/consts';
import { CONSTROAD_COLORS } from 'src/styles/shared';

export const TasksPage = () => {
  const [startDayWeek, setStartDayWeek] = useState( new Date() );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [task, setTask] = useState<TaskType>(initialTask)
  const { isMobile, isDesktop } = useScreenSize()

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
    setSelectedDate(date);
  };

  // current month
  const currentMonth = getCurrentMonth(startDayWeek)

  // current year
  const yearOfCurrentWeek = startOfWeek(startDayWeek, { weekStartsOn: 0 }).getFullYear();
  const currentDay = new Date()

  return (
    <AdministrationLayout>
      <Box w='100%'>
        <Flex alignItems="center" justifyContent="space-between" mb='10px'>
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

        {isMobile && (
          <Flex gap='50px' fontSize={12} width='100%' justifyContent='start' mt='2px'>
            <Flex alignItems='center'>
              Día actual <Box bg={CONSTROAD_COLORS.lightGray} w='10px' h='10px' ml='5px' border='0.5px solid' />
            </Flex>

            <Flex alignItems='center'>
              Día seleccionado <Box bg={CONSTROAD_COLORS.yellow} w='10px' h='10px' ml='5px' border='0.5px solid' />
            </Flex>
          </Flex>
        )}

        <Flex flexDir={{ base: 'column', md: 'row' }} mt='1px' gap='2px'>
          <DayCard startDayWeek={startDayWeek} selectedDay={selectedDate} onClickDay={handleSelectDateClick} />
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

        {isDesktop && (
          <Flex flexDir='row' width='100%' justifyContent='space-between' mt='10px'>
            <Flex width='79%' rounded='6px' border='1px solid' borderColor='gray.400' h='450px' flexDir='column'>
              <Flex fontSize={12} fontWeight={600} bg='gray.600' color='white' roundedTop='5px' px='8px' py='3px' justifyContent='space-between'>
                <Text>TAREAS (20)</Text>
                <Flex>
                  <Text fontWeight={600} textTransform='uppercase'>{format(selectedDate ?? currentDay, 'EEEE', { locale: es })}</Text>
                  <Text fontWeight={600} ml='5px'>{format(selectedDate ?? currentDay, 'dd/MM')}</Text>
                </Flex>
              </Flex>
              <Flex gap='10px' mt='5px' py='2px' px='8px'>
                <Flex flex={1} h='400px' rounded='6px' border='0.5px solid' py='2px' px='6px'>
                  <Text fontSize={12} fontWeight={600}>PENDIENTE</Text>
                </Flex>
                <Flex flex={1} h='400px' rounded='6px' border='0.5px solid' py='2px' px='6px'>
                  <Text fontSize={12} fontWeight={600}>EN PROGRESO</Text>
                </Flex>
                <Flex flex={1} h='400px' rounded='6px' border='0.5px solid' py='2px' px='6px'>
                  <Text fontSize={12} fontWeight={600}>TERMINADO</Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex width='20%' rounded='6px' border='1px solid' borderColor='gray.400' h='450px' flexDir='column'>
              <Flex fontSize={12} fontWeight={600} roundedTop='5px' bg='gray.600' color='white' width='100%' px='8px' py='3px'>NOTAS (20)</Flex>
            </Flex>
          </Flex>
        )}
      </Box>
    </AdministrationLayout>
  );
};

export default TasksPage;
