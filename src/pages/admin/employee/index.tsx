import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useFetch } from 'src/common/hooks/useFetch';
import { AdministrationLayout, Modal, TableComponent } from 'src/components';
import { EmployeeForm, generateEmployeeColumns } from 'src/components/employee';
import { IEmployeeValidationSchema } from 'src/models/employee';

interface EmployeeProps {}

const Employee = (props: EmployeeProps) => {
  const [employeeSelected, setEmployeeSelected] =
    useState<IEmployeeValidationSchema>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const { data, isLoading, refetch } = useFetch<IEmployeeValidationSchema[]>(
    API_ROUTES.employee
  );

  const columns = generateEmployeeColumns();
  const handleCloseEmployeeModal = () => {
    onClose();
    setEmployeeSelected(undefined);
    refetch()
  };


  return (
    <AdministrationLayout>
      <Flex
        flexDir="column"
        alignItems={{ base: '', md: '' }}
        width="100%"
        gap="5px"
      >
        <Flex width="100%" justifyContent="space-between">
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Empleados
          </Text>

          <Button autoFocus onClick={onOpen}>
            Agregar Empleado
          </Button>
        </Flex>

        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={data ?? []}
            columns={columns}
            onDelete={(item) => {
              setEmployeeSelected(item);
              onOpenDelete();
            }}
            onEdit={(item) => {
              setEmployeeSelected(item);
              onOpen();
            }}
            isLoading={isLoading}
            pagination
            actions
          />
        </Box>
      </Flex>

      {/* transport form modal */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={handleCloseEmployeeModal}
        heading={employeeSelected ? 'Editar Empleado' : 'Añadir Empleado'}
      >
        <EmployeeForm
          employee={employeeSelected}
          onClose={handleCloseEmployeeModal}
          onSuccess={handleCloseEmployeeModal}
        />
      </Modal>
    </AdministrationLayout>
  );
};

export default Employee;
