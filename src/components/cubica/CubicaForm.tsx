import { Flex } from '@chakra-ui/react';
import { ConcaveMetadata, Concavo } from '../cubicar/Concavo';
import { Cuadrado, SquareMetadata } from '../cubicar/Cuadrado';
import { useState } from 'react';
import { ITransportValidationSchema } from 'src/models/transport';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';

interface CubicaFormProps {
  onSave: () => void;
  transport?: ITransportValidationSchema;
}

const CubicaForm = (props: CubicaFormProps) => {
  const [truckType, setTruckType] = useState(props.transport?.shape ?? '');
  const { mutate } = useMutate<ITransportValidationSchema>(
    API_ROUTES.transport
  );
  const { mutate: triggerUpdate } = useMutate<ITransportValidationSchema>(
    `${API_ROUTES.transport}/${props.transport?._id}`
  );

  const onSave = (metadata: SquareMetadata | ConcaveMetadata) => {
    const { plate, m3, ...rest } = metadata;
    if (plate ==="") {
      toast.warning("Ingresa la placa")
      return
    }
    const payload = {
      plate,
      m3,
      metadata: rest,
      shape: truckType,
    };
    if (props.transport) {
      triggerUpdate('PUT', payload, {
        onSuccess: () => {
          toast.success('Transporte fue actualizado');
          props.onSave();
        },
      });
      return;
    }
    mutate('POST', payload, {
      onSuccess: () => {
        toast.success('Transporte fue agregado');
        props.onSave();
      },
    });
  };

  return (
    <>
      <Flex bgColor="white" flexDir="column" py={3} rounded={10}>
        <Flex gap={2} flexDir="row" alignItems="center" justifyContent="center">
          <Flex
            cursor="pointer"
            px={5}
            border={truckType === 'Cuadrado' ? 'solid 2px green' : ''}
            bgColor="black"
            color="white"
            height={50}
            alignItems="center"
            justifyContent="center"
            fontWeight={600}
            onClick={() => setTruckType('Cuadrado')}
            rounded={4}
          >
            Cuadrado
          </Flex>
          <Flex
            cursor="pointer"
            fontWeight={600}
            px={5}
            border={truckType === 'Concavo' ? 'solid 2px green' : ''}
            bgColor="black"
            color="white"
            height={50}
            alignItems="center"
            justifyContent="center"
            onClick={() => setTruckType('Concavo')}
            rounded={4}
          >
            Concavo
          </Flex>
        </Flex>
      </Flex>
      {truckType === 'Cuadrado' && (
        <Cuadrado onSave={onSave} transport={props.transport} />
      )}
      {truckType === 'Concavo' && <Concavo onSave={onSave}  transport={props.transport} />}
    </>
  );
};

export default CubicaForm;
