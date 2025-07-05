import {
  IRouteCostSchemaValidation,
  routeCostSchemaValidation,
} from '@/models/routeCost';
import { Button, VStack } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea, InputField, SelectField } from '../form';
import { useUbigeos } from '@/common/hooks/useUbigeos';
import { useMutate } from '@/common/hooks/useMutate';
import { API_ROUTES } from '@/common/consts';
import { toast } from '../Toast';
import { useEffect } from 'react';

interface Props {
  routeCost?: IRouteCostSchemaValidation;
  onSuccess: () => void;
}

export const RouteCostForm = (props: Props) => {
  const { routeCost } = props;
  const methods = useForm<IRouteCostSchemaValidation>({
    resolver: zodResolver(routeCostSchemaValidation),
    defaultValues: routeCost ?? {},
  });

  const { regions } = useUbigeos();
  const { mutate: mutateRoueCost, isMutating } = useMutate(
    API_ROUTES.routeCost
  );
  const { reset } = methods
  const isEdit = !!routeCost;
  useEffect(() => {
    
    return () => {
      reset()
    }
  }, [])
  

  const onSubmit = (form: IRouteCostSchemaValidation) => {
    const { _id, ...rest } = form;
    const payload = {
      ...rest,
    };
    //EDIT
    if (_id) {
      mutateRoueCost('PUT', payload, {
        requestUrl: `${API_ROUTES.routeCost}/${_id}`,
        onSuccess: () => {
          toast.success('Costo de Ruta Actualizado');
          reset()
          props.onSuccess();
        },
      });
      return;
    }

    //SAVE
    mutateRoueCost('POST', payload, {
      onSuccess: () => {
        toast.success('Costo de Ruta Guardado');
        reset()
        props.onSuccess();
      },
    });
  };

  const regionsArr = regions.map((r) => ({
    label: r,
    value: r,
  }));

  const statusArr = [
    { label: 'Peaje', value: 'toll' },
    { label: 'Combustible', value: 'fuel' },
    { label: 'Otros', value: 'other' },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack gap={4}>
          <SelectField
            isRequired
            size="xs"
            name="origin"
            label="Origen"
            options={regionsArr}
          />

          <SelectField
            isRequired
            size="xs"
            name="destination"
            label="Destino"
            options={regionsArr}
          />

          <InputField
            type="text"
            size="xs"
            name="route"
            label="Ruta"
            isRequired
          />

          <SelectField
            name="type"
            label="Tipo"
            options={statusArr}
            size={'xs'}
          />

          <InputField
            type="number"
            size="xs"
            name="amount"
            label="Monto"
            isRequired
          />

          <FormTextarea name="description" label="Descripcion" />

          <Button type="submit" loading={isMutating}>
            {isEdit ? 'Actualizar' : 'Guardar'}
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};
