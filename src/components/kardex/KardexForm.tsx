import { useState, useEffect } from 'react';
import axios from 'axios';
import { IKardexSchema } from 'src/models/kardex';
import { IMaterialSchema } from 'src/models/material';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { formatISODate, parseLocalDate } from 'src/utils/general';

const postKardex = (path: string, data: any) => axios.post(path, { data });
const putKardex = (path: string, data: any) => axios.put(path, data);

interface KardexFormProps {
  onClose?: () => void;
  onSuccess: () => void;
  kardex?: IKardexSchema;
  materials: IMaterialSchema[];
}

export const KardexForm = (props: KardexFormProps) => {
  const [kardex, setKardex] = useState<IKardexSchema>({
    materialId: '',
    type: 'Ingreso',
    quantity: 0,
    value: 0,
    unitCost: 0,
    date: new Date().toISOString(),
  });

  useEffect(() => {
    if (props.kardex) {
      setKardex(props.kardex);
    }
  }, [props.kardex]);

  // API
  const { run: runAddKardex, isLoading: addingKardex } = useAsync();
  const { run: runUpdateKardex, isLoading: updatingKardex } = useAsync();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kardex.materialId) {
      toast.warning('Seleccione Agregado');
      return;
    }
    if (!kardex.type) {
      toast.warning('Seleccione typo');
      return;
    }
    if (props.kardex && kardex) {
      const { _id, ...payload } = kardex;
      const path = `${API_ROUTES.kardex}/${_id}`;
      runUpdateKardex(putKardex(path, payload), {
        onSuccess: () => {
          toast.success('Material actualizado con éxito!');
          props.onSuccess?.();
          props.onClose?.();
        },
        onError: () => {
          toast.error('ocurrio un error actualizando un material');
        },
      });

      return;
    }

    // Create
    runAddKardex(postKardex(API_ROUTES.kardex, kardex), {
      onSuccess: () => {
        toast.success('Kardex agregado con éxito!');
        props.onSuccess?.();
        props.onClose?.();
      },
      onError: () => {
        toast.error('ocurrio un error actualizando un kardex');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex flexDir="column" fontSize={12}>
        <FormControl>
          <FormLabel fontSize="inherit">Material:</FormLabel>
          <Select
            placeholder="Selecciona"
            value={kardex.materialId ?? ''}
            onChange={(e) => {
              setKardex({
                ...kardex,
                materialId: e.target.value,
              });
            }}
            size="xs"
          >
            {props.materials?.map((material) => (
              <option key={material._id} value={material._id}>
                {material.name}-{material.description}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="inherit">Tipo:</FormLabel>
          <Select
            placeholder="Selecciona"
            value={kardex.type ?? 'Ingreso'}
            onChange={(e) => {
              setKardex({
                ...kardex,
                type: e.target.value,
              });
            }}
            size="xs"
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Salida">Salida</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="inherit">Cantidad:</FormLabel>
          <input
            className="border"
            type="number"
            value={kardex?.quantity ?? 0}
            onChange={(e) =>
              setKardex({
                ...kardex,
                quantity: Number(e.target.value),
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="inherit">Valor:</FormLabel>
          <input
            className="border"
            type="number"
            value={kardex?.value ?? 0}
            onChange={(e) =>
              setKardex({
                ...kardex,
                value: Number(e.target.value),
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="inherit">costo unitario:</FormLabel>
          <input
            className="border"
            type="number"
            value={kardex?.unitCost ?? 0}
            onChange={(e) =>
              setKardex({
                ...kardex,
                unitCost: Number(e.target.value),
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="inherit">Fecha:</FormLabel>
          <Input
            size="xs"
            type="date"
            width="220px"
            value={formatISODate(kardex.date)}
            onChange={(e) =>
              setKardex({
                ...kardex,
                date: parseLocalDate(e.target.value).toISOString(),
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="inherit">Description:</FormLabel>
          <input
            className="border p-1"
            value={kardex?.description ?? ''}
            onChange={(e) =>
              setKardex({
                ...kardex,
                description: e.target.value,
              })
            }
          />
        </FormControl>
      </Flex>
      <Button
        size="sm"
        type="submit"
        colorScheme="blue"
        mt={5}
        isLoading={addingKardex || updatingKardex}
      >
        {props.kardex ? 'Actualizar' : 'Crear'}
      </Button>
    </form>
  );
};
