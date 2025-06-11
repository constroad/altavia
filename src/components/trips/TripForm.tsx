'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, VStack, HStack, Field, Textarea } from '@chakra-ui/react';
import { ITripSchemaValidation, TripSchemaValidation } from 'src/models/trip';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, SelectField } from '../form';

export default function TripForm({
  vehicles,
  drivers,
  clients,
  onSubmit,
}: {
  vehicles: any[];
  drivers: any[];
  clients: any[];
  onSubmit: (data: ITripSchemaValidation) => void;
}) {
  const methods = useForm<ITripSchemaValidation>({
    resolver: zodResolver(TripSchemaValidation),
    // defaultValues: employee,
  });

  const {
    // reset,
    // control,
    // setValue,
    watch,
    formState: { errors },
  } = methods;

  const values = watch();
  console.log('values:', values);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack gap={4}>
          <HStack gap={4}>
            <InputField
              name="origin"
              label="Origen"
              placeholder="Region/Province"
              // isRequired
              isInvalid={!!errors.origin?.message}
            />

            <InputField
              name="destination"
              label="Destino"
              placeholder="Region/Province"
              // isRequired
            />
          </HStack>
          <HStack gap={4}>
            <SelectField name="vehicle" label="Vehicle" options={vehicles} />
            <SelectField name="driver" label="Driver" options={drivers} />
          </HStack>
          <Box>
            <SelectField name="client" label="Client" options={clients} />
          </Box>
          <HStack gap={4}>
            <InputField
              type="date-local"
              name="startDate"
              label="Start Date"
              // isRequired
            />
            <InputField
              type="date-local"
              name="endDate"
              label="End Date"
              isRequired
            />
          </HStack>
          <Box>
            <InputField
              type="number"
              name="revenue"
              label="Ganancia"
              isRequired
            />
          </Box>
          <Field.Root invalid>
            <Field.Label>Notes</Field.Label>
            <Textarea name="notes" />
          </Field.Root>
          <Button type="submit" colorScheme="green" w="full">
            Create Trip
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
}
