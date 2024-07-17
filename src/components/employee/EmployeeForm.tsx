import { Button, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IEmployeeValidationSchema,
  employeeValidationSchema,
} from 'src/models/employee';
import {
  InputField,
  InputNumberField,
  SelectField,
  TextAreaField,
} from '../form';
import DateField from '../form/DateField';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';

interface EmployeeFormProps {
  employee?: IEmployeeValidationSchema;
  onClose: () => void;
  onSuccess: () => void;
}

export const EmployeeForm = (props: EmployeeFormProps) => {
  const { employee } = props;
  const methods = useForm<IEmployeeValidationSchema>({
    resolver: zodResolver(employeeValidationSchema),
    defaultValues: employee,
  });

  // API
  const { mutate, isMutating } = useMutate(`${API_ROUTES.employee}/:id`, {
    urlParams: {
      id: employee?._id,
    },
  });

  useEffect(() => {
    if (employee) {
      methods.reset(employee);
    }
  }, [employee, methods]);

  const onSubmit = (data: IEmployeeValidationSchema) => {
    if (props.employee?._id) {
      //edit
      mutate('PUT', data, {
        onSuccess: () => {
          toast.success('El empleado se actualizo correctamente');
          props.onSuccess();
        },
        onError: (err) => {
          toast.error('Error al actualizar el nuevo empleado');
          console.log(err);
        },
      });
      return;
    }
    // create
    mutate('POST', data, {
      onSuccess: () => {
        toast.success('El empleado se registro correctamente');
        props.onSuccess();
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo empleado');
        console.log(err);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spacing={4}>
          <InputField name="name" label="Name" isRequired />
          <InputField name="lastName" label="Last Name" isRequired />
          <InputField name="country" label="Country" isRequired />
          <InputField name="DOI" label="DOI" isRequired />
          <SelectField
            name="sex"
            label="Sexo"
            options={[
              { value: 'hombre', label: 'Masculino' },
              { value: 'mujer', label: 'Femenino' },
            ]}
            isRequired
          />
          <DateField name="birthday" label="Birthday" isRequired />
          <SelectField
            name="coin"
            label="Moneda"
            options={[
              { value: 'PEN', label: 'PEN' },
              { value: 'USD', label: 'USD' },
            ]}
            isRequired
          />
          <InputNumberField name="salary" label="Salary" isRequired />
          <SelectField
            name="civilStatus"
            label="Estado Civil"
            options={[
              { value: 'soltero', label: 'Soltero' },
              { value: 'casado', label: 'Casado' },
            ]}
            isRequired
          />

          <TextAreaField name="place" label="Place" />

          <Button colorScheme="blue" type="submit" isLoading={isMutating}>
            Guardar
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};
