'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, VStack, HStack, Field, Textarea, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { ITripSchemaValidation, TripSchemaValidation } from 'src/models/trip';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea, InputField, SelectField } from '../form';
import { UploadButton } from '../upload/UploadButton';
import { ArrowLeftIcon } from 'src/common/icons';
import { useScreenSize } from 'src/common/hooks';
import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { ExpenseModal } from './ExpenseModal';
import { v4 as uuidv4 } from 'uuid'; // asegúrate de tener 'uuid' instalado


type ITripForm = {
  vehicles: any[];
  drivers: any[];
  clients: any[];
  onSubmit: (data: ITripSchemaValidation) => void;
  onCancel: () => void;
};

export default function TripForm(props: Readonly<ITripForm>) {
  const { vehicles, drivers, clients, onSubmit } = props;
  const [expenseMedias, setExpenseMedias] = useState<Record<string, File[]>>({});
  const { open, onOpen, onClose } = useDisclosure();
  const { isMobile } = useScreenSize();
  console.log('expenseMedias:', expenseMedias)




  const methods = useForm<ITripSchemaValidation>({
    resolver: zodResolver(TripSchemaValidation),
    // defaultValues: employee,
  });

  const {
    control,
    watch,
    formState: { errors },
  } = methods;

  const {
    fields: expenses,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({
    control,
    name: 'expenses',
  });

  const values = watch();
  console.log('values:', values);

  const statusArr = [
    { label: 'Pendiente', value: 'Pending' },
    { label: 'Completado', value: 'Completed' },
    { label: 'Eliminado', value: 'Deleted' },
  ]

  return (
    <FormProvider {...methods}>
      <Flex w='100%' justifyContent='space-between' alignItems='center'>
        <Text
          fontSize={{ base: 20, md: 32 }}
          fontWeight={700}
          lineHeight={{ base: '28px', md: '39px' }}
        >
          Nuevo viaje
        </Text>
        <Button
          type="button"
          colorPalette="danger"
          variant="solid"
          size={{ base: 'xs', md: 'sm' }}
          onClick={props.onCancel}
          fontSize={{ base: 10, md: 14 }}
        >
          Atras <Icon as={ArrowLeftIcon} boxSize={{ base: 5, md: 6 }} />
        </Button>
      </Flex>

      {/* <UploadButton type="ROUTE_TRACKING" resourceId='JZENA' /> */}
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack gap={4} w='100%' mt='10px'>

          {/* CLIENTES */}
          <Box w='100%'>
            <SelectField name="client" label="Cliente" options={clients} size={{ base: 'xs', md: 'sm' }} />
          </Box>

          {/* ORIGEN - DESTINO */}
          <HStack gap={4} w='100%'>
            <Flex w='100%' gap={4}>
              <InputField
                name="origin"
                label="Origen"
                placeholder="Region/Province"
                size={{ base: 'xs', md: 'sm' }}
                isInvalid={!!errors.origin?.message}
              />
              <InputField
                name="destination"
                label="Destino"
                placeholder="Region/Province"
                size={{ base: 'xs', md: 'sm' }}
              />
            </Flex>
          </HStack>

          {/* VEHICLE - DRIVER */}
          <HStack gap={4} w='100%'>
            <Flex w='100%' gap={4}>
              <Flex w='50%'>
                <SelectField name="vehicle" label="Vehículo" options={vehicles} size={{ base: 'xs', md: 'sm' }} />
              </Flex>
              <Flex w='50%'>
                <SelectField name="driver" label="Conductor" options={drivers} size={{ base: 'xs', md: 'sm' }} />
              </Flex>
            </Flex>
          </HStack>

          {/* START DATE - END DATE */}
          <HStack gap={4} w='100%'>
            <Flex w='100%' gap={4}>
              <InputField
                type="date"
                name="startDate"
                label="Fecha inicio"
                size={{ base: 'xs', md: 'sm' }}
              />
              <InputField
                type="date"
                name="endDate"
                label="Fecha fin"
                size={{ base: 'xs', md: 'sm' }}
                isRequired
              />
            </Flex>
          </HStack>

          {/* GANANCIA - KILOMETRAJE */}
          <Flex w='100%' gap={4}>
            <Flex w='50%'>
              <InputField
                type="number"
                name="revenue"
                label="Ganancia"
                isRequired
                size={{ base: 'xs', md: 'sm' }}
              />
            </Flex>
            <Flex w='50%'>
              <InputField
                type="number"
                name="kmTravelled"
                label={ isMobile ? 'Km. recorrido' : "Kilometraje recorrido" }
                isRequired
                size={{ base: 'xs', md: 'sm' }}
              />
            </Flex>
          </Flex>

          {/* STATUS - FECHA DE PAGO */}
          <HStack gap={4} w='100%'>
            <Flex w='100%' gap={4}>
              <Flex w='50%'>
                <SelectField
                  name="status"
                  label="Estado"
                  options={statusArr}
                  size={{ base: 'xs', md: 'sm' }}
                />
              </Flex>
              <Flex w='50%'>
                <InputField
                  type="date"
                  name="paymentDueDate"
                  label="Fecha de pago"
                  size={{ base: 'xs', md: 'sm' }}
                />
              </Flex>
            </Flex>
          </HStack>

          {/* NOTAS */}
          <Flex w='100%'>
            <FormTextarea name="notes" label='Notas' />
          </Flex>

          {/* BOTÓN AGREGAR GASTO */}
          <Flex w="100%" justifyContent="start">
            <Button
              size="sm"
              colorScheme="blue"
              onClick={onOpen}
            >
              Agregar gasto
            </Button>
          </Flex>

          <VStack align="start" w="100%">
            <Text fontWeight="bold">Gastos agregados</Text>
            <Flex w='100%' gap='10px'>
              {expenses.map((item, index) => (
                <Flex key={item.expenseId} rounded='4px' p='3px' border='1px solid' flexDir='column'>
                  <Text>{item.description}</Text>
                  <Text>S/ {item.amount}</Text>

                  {/* Miniatura si hay imagen */}
                  {expenseMedias[item.expenseId]?.map((file, i) => (
                    <Box key={i} display="inline-block" position="relative" mr={2} mt={2}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${i}`}
                        width="60"
                        height="40"
                        style={{ borderRadius: '6px', objectFit: 'cover' }}
                      />
                    </Box>
                  ))}

                  <Button size="xs" mt='5px' onClick={() => removeExpense(index)}>Eliminar</Button>
                </Flex>
              ))}
            </Flex>
          </VStack>


          <Button
            type="submit"
            colorScheme='primary'
            w="full"
          >
            Create Trip
          </Button>
        </VStack>
      </form>

      <ExpenseModal
        open={open}
        onClose={onClose}
        onSave={(expense, files) => {
          const expenseId = uuidv4();

          // 1. Agregar gasto al form
          appendExpense({ ...expense, expenseId });

          // 2. Guardar archivos en memoria
          setExpenseMedias(prev => ({
            ...prev,
            [expenseId]: files,
          }));
        }}
      />
    </FormProvider>
  );
}
