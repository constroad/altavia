'use client';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Input, Select, VStack, HStack, Portal } from '@chakra-ui/react';

export type TripFormValues = {
  origin: string;
  destination: string;
  vehicle: string;
  driver: string;
  client: string;
  startDate: string;
  revenue: number;
};

export default function TripForm({
  vehicles,
  drivers,
  clients,
  onSubmit,
}: {
  vehicles: any[];
  drivers: any[];
  clients: any[];
  onSubmit: (data: TripFormValues) => void;
}) {
  const { register, handleSubmit, control } = useForm<TripFormValues>();

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack gap={4}>
        <HStack gap={4}>
          <Box>
            <Box>Origin</Box>
            <Input {...register('origin')} placeholder="Region/Province" />
          </Box>
          <Box>
            <Box>Destination</Box>
            <Input {...register('destination')} placeholder="Region/Province" />
          </Box>
        </HStack>
        <HStack gap={4}>
          <Box>
            <Box>Vehicle</Box>
            <Controller
              name="vehicle"
              control={control}
              render={({ field }) => (
                <Select.Root
                  collection={vehicles}
                  onValueChange={field.onChange}
                  value={field.value}
                  name={field.name}
                  size="sm"
                  width="320px"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select vehicle" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {vehicles.map((vehicle) => (
                          <Select.Item item={vehicle} key={vehicle.value}>
                            {vehicle.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              )}
            />
            {/* <Select {...register('vehicle')}>
              {vehicles.map((v) => <option value={v._id} key={v._id}>{v.plate}</option>)}
            </Select> */}
          </Box>
          <Box>
            <Box>Driver</Box>
            {/* <Select {...register('driver')}>
              {drivers.map((d) => (
                <option value={d._id} key={d._id}>
                  {d.name}
                </option>
              ))}
            </Select> */}
          </Box>
        </HStack>
        <Box>
          <Box>Client</Box>
          {/* <Select {...register('client')}>
            {clients.map((c) => (
              <option value={c._id} key={c._id}>
                {c.name}
              </option>
            ))}
          </Select> */}
        </Box>
        <Box>
          <Box>Start Date</Box>
          <Input type="datetime-local" {...register('startDate')} />
        </Box>
        <Box>
          <Box>Revenue</Box>
          <Input type="number" {...register('revenue')} />
        </Box>
        <Button type="submit" colorScheme="green" w="full">
          Create Trip
        </Button>
      </VStack>
    </Box>
  );
}
