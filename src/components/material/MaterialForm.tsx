import { Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IMaterialSchema } from 'src/models/material';
import axios from 'axios';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';

interface MaterialFormProps {
  onClose?: () => void;
  onSuccess: () => void;
  material?: IMaterialSchema;
}

const postMaterial = (path: string, data: any) => axios.post(path, { data });
const putMaterial = (path: string, data: any) => axios.put(path, data);

export const MaterialForm = (props: MaterialFormProps) => {
  const [material, setMaterial] = useState<Partial<IMaterialSchema>>();

  // API
  const { run: runAddMaterial, isLoading: addingMaterial } = useAsync();
  const { run: runUpdateMaterial, isLoading: updatingMaterial } = useAsync();

  useEffect(() => {
    setMaterial({ ...props.material });
  }, [props.material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // EDIT
    if (props.material && material) {
      const { _id, ...payload } = material;
      const path = `${API_ROUTES.material}/${_id}`;
      runUpdateMaterial(putMaterial(path, payload), {
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
    runAddMaterial(postMaterial(API_ROUTES.material, material), {
      onSuccess: () => {
        toast.success('Material agregado con éxito!');
        props.onSuccess?.();
        props.onClose?.();
      },
      onError: () => {
        toast.error('ocurrio un error actualizando un material');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex flexDir="column" gap={1} fontSize={12}>
        <Flex flexDir="column">
          <Text>Nombre:</Text>

          <input
            className="border p-1"
            value={material?.name ?? ''}
            onChange={(e) =>
              setMaterial({
                ...material,
                name: e.target.value,
              })
            }
          />
        </Flex>
        <Flex flexDir="column">
          <Text>Unidad:</Text>
          <input
            className="border w-[80px] p-1"
            value={material?.unit ?? ''}
            onChange={(e) =>
              setMaterial({
                ...material,
                unit: e.target.value,
              })
            }
          />
        </Flex>
        <Flex flexDir="column">
          <Text>Cantidad:</Text>
          <input
            className="border w-[80px] p-1"
            type="number"
            value={material?.quantity ?? 0}
            onChange={(e) =>
              setMaterial({
                ...material,
                quantity: Number(e.target.value),
              })
            }
          />
        </Flex>
      </Flex>

      <Button
        mt={5}
        size="sm"
        type="submit"
        colorScheme="blue"
        isLoading={addingMaterial || updatingMaterial}
      >
        {props.material ? 'Actualizar' : 'Crear'}
      </Button>
    </form>
  );
};
