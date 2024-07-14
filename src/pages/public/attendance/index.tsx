// pages/attendance.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { API_ROUTES } from 'src/common/consts';
import { IAttendanceValidationSchema } from 'src/models/attendance';
import { PortalLayout, toast } from 'src/components';

import { useFetch } from 'src/common/hooks/useFetch';
import { IEmployeeValidationSchema } from 'src/models/employee';
import { ArrowRightIcon } from 'src/common/icons';
import { RegisterAttendance } from 'src/components/attendance/register';

const TELEGRAM_TOKEN = '7278967592:AAHLnzjx3L-uYl3a96JhvIWbQ-YpBtF1kz8';
const TELEGRAM_GROUP_ID_ATTENDANCE = '-1002154744862';

const AttendancePage = () => {
  const [employeeSelected, setEmployeeSelected] =
    useState<IEmployeeValidationSchema>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //API
  const { data, isLoading } = useFetch<IEmployeeValidationSchema[]>(
    API_ROUTES.employee
  );

  return (
    <PortalLayout bgColor={isOpen ? 'white' : 'whitesmoke'}>
      <Flex
        w="100%"
        px={{ base: '20px', md: '100px' }}
        flexDir={{ base: 'column', lg: 'row' }}
        gap={5}
        alignItems="center"
        justifyContent="center"
      >
        {!isOpen && (
          <Flex flexDir="column" gap={5}>
            <Flex flexDir="column" lineHeight={1.2}>
              <Text fontWeight={600} fontSize={14} color="gray">
                Registro de asistencia
              </Text>
              <Text
                textAlign="left"
                width="100%"
                fontSize={20}
                fontWeight={600}
              >
                Personal Planta
              </Text>
            </Flex>
            {isLoading && <Spinner />}
            <Grid
              templateColumns={{
                base: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={3}
            >
              {data?.map((e) => (
                <GridItem
                  key={e._id}
                  bgColor="white"
                  width="100%"
                  as={Flex}
                  flexDir="column"
                  alignItems="center"
                  justifyContent="space-between"
                  py={5}
                  px={3}
                  rounded={40}
                  height="150px"
                  boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                  onClick={() => {
                    setEmployeeSelected(e);
                    onOpen();
                  }}
                >
                  <Text
                    fontSize={10}
                    as={Flex}
                    justifyContent="space-between"
                    gap={2}
                    px={2}
                    width="100%"
                  >
                    Registrar
                    <ArrowRightIcon fontSize={15} />
                  </Text>
                  <Flex
                    border="4px solid #ff6346"
                    height="80px"
                    rounded={15}
                    px={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontSize={10} color="gray">
                      {e.name}
                    </Text>
                    <Avatar fontWeight="bold" size="xs" name={e.name} />
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        )}
        {isOpen && (
          <RegisterAttendance
            onGoBack={() => {
              setEmployeeSelected(undefined);
              onClose()
            }}
            employee={employeeSelected}
          />
        )}
      </Flex>
    </PortalLayout>
  );
};

export default AttendancePage;
