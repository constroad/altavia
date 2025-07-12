'use client';

import { Button, Flex, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect } from 'react';
import { IItemFormValues, itemSchemaValidation } from './TripItems';
import { useMutate } from '@/common/hooks/useMutate';
import { API_ROUTES } from '@/common/consts';

interface ItemFormProps {
  tripId: string;
  item?: IItemFormValues;
  onSubmitItem?: (data: IItemFormValues) => void;
  onClose: () => void;
}

export const ItemForm = (props: ItemFormProps) => {
  const { item, onSubmitItem, onClose, tripId } = props;
  const methods = useForm<IItemFormValues>({
    resolver: zodResolver(itemSchemaValidation),
    defaultValues: item ?? {},
  });

  const { mutate } = useMutate(API_ROUTES.trips);

  useEffect(() => {
    if (item) {
      methods.reset(item);
    }
  }, [item, methods]);

  const onSubmit = (data: IItemFormValues) => {
    onSubmitItem?.(data); // ahora se encargará TripItems
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={2}>
          <InputField size="xs" name="product" label="Producto" isRequired />
          <Flex gap={2} w="100%">
            <InputField size="xs" name="code" label="Código" />
            <InputField size="xs" name="unit" label="Unidad" />
          </Flex>
          <Flex gap={2} w="100%">
            <InputField size="xs" name="amount" label="Cantidad" />
            <InputField size="xs" name="weight" label="Peso" />
          </Flex>

          <Flex w="100%" justifyContent="flex-end" gap={2} mt="10px">
            <Button variant="outline" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit" size="sm">
              Guardar
            </Button>
          </Flex>
        </VStack>
      </form>
    </FormProvider>
  );
};
