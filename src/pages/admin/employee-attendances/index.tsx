import { Box, Flex, Select, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useFetch } from 'src/common/hooks/useFetch';
import { AdministrationLayout, TableComponent } from 'src/components';
import { generateAttendanceColumns } from 'src/components/attendance';
import { IAttendanceValidationSchema } from 'src/models/attendance';

interface EmployeeAttendancesProps {}

const EmployeeAttendances = (props: EmployeeAttendancesProps) => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeList, setEmployeeList] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, refetch } = useFetch<IAttendanceValidationSchema[]>(
    API_ROUTES.attendance,
    {
      queryParams: {
        employeeId,
      },
      onSuccess: (response) => {
        if (employeeList.length === 0) {
          const array = response.map((x) => ({
            id: x.employeeId,
            name: x.name,
          }));
          const arrayUniqueByKey = [
            //@ts-ignore
            ...new Map(array.map((item) => [item['id'], item])).values(),
          ];
          setEmployeeList(arrayUniqueByKey);
        }
      },
    }
  );

  const columns = generateAttendanceColumns();
  const handleCloseEmployeeModal = () => {
    onClose();
    // setEmployeeSelected(undefined);
    refetch();
  };

  return (
    <AdministrationLayout>
      <Flex
        flexDir="column"
        alignItems={{ base: '', md: '' }}
        width="100%"
        gap="10px"
      >
        <Flex width="100%" justifyContent="space-between">
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Asistencia de Empleados
          </Text>
        </Flex>

        <Flex flexDir="column" fontSize="inherit">
          <Text fontSize={{ base: 12 }}>Empleado:</Text>
          <Select
            defaultValue=""
            size="sm"
            width={{ base: '90px', md: '200px' }}
            onChange={(e) => setEmployeeId(e.target.value)}
            fontSize={12}
            value={employeeId}
          >
            <option value="">Todos</option>
            {employeeList.map((x) => (
              <option key={`filter-${x.id}`} value={x.id}>
                {x.name}
              </option>
            ))}
          </Select>
        </Flex>

        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={data ?? []}
            columns={columns}
            isLoading={isLoading}
            pagination
            actions
          />
        </Box>
      </Flex>
    </AdministrationLayout>
  );
};

export default EmployeeAttendances;
