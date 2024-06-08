import { v4 as uuidv4 } from 'uuid';
import { Flex, Button, Input, Text, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { formatISODate } from 'src/utils/general';
import { IOrderValidationSchema } from 'src/models/order';

interface CertificateFormProps {
  // certificate?: IOrderValidationSchema['certificados'][0];
  // onCancel: () => void;
  // onSave: (item: IOrderValidationSchema['certificados'][0]) => void;
}
const defaultValue = {
  _id: '',
  fecha: formatISODate(new Date().toDateString()),
  url: '',
  obra: '',
  empresa: '',
};
export const CertificateForm = (props: CertificateFormProps) => {
  // const [certificate, setCertificate] =
  //   useState<IOrderValidationSchema['certificados'][0]>(defaultValue);

  // useEffect(() => {
  //   if (props.certificate) {
  //     // setCertificate(props.certificate);
  //   }
  // }, [props.certificate]);

  // handlers
  const handleAddItem = () => {
    // const {_id} = certificate
    // const newId = !_id ? uuidv4() : _id
    // props.onSave({...certificate, _id: newId});
    // setCertificate(defaultValue);
  };
  const handleOpenUrl = (url: string) => {
    const win = window.open(url, '_blank');
    win?.focus();
  };

  return (
    <Flex flexDir="column" gap={2}>
      {/* <Flex>
        <Text width="100px">Empresa:</Text>
        <Input
          placeholder="Empresa"
          size="sm"
          value={certificate.empresa}
          onChange={(e) =>
            setCertificate({
              ...certificate,
              empresa: e.target.value,
            })
          }
          fontSize={{ base: 10, md: 12 }}
        />
      </Flex>
      <Flex>
        <Text width="100px">Obra:</Text>
        <Input
          placeholder="Obra"
          size="sm"
          value={certificate.obra}
          onChange={(e) =>
            setCertificate({
              ...certificate,
              obra: e.target.value,
            })
          }
          fontSize={{ base: 10, md: 12 }}
        />
      </Flex>
      <Flex>
        <Text width="100px">Fecha:</Text>
        <Input
          type="date"
          value={certificate.fecha}
          onChange={(e) => {
            setCertificate({ ...certificate, fecha: e.target.value });
          }}
        />
      </Flex>
      <Flex>
        <Text width="100px">Url:</Text>
        <Input
          placeholder="https://.... google drive"
          size="sm"
          value={certificate.url}
          onChange={(e) =>
            setCertificate({
              ...certificate,
              url: e.target.value,
            })
          }
          fontSize={{ base: 10, md: 12 }}
        />
        {certificate.url && (
          <Button variant="link" onClick={() => handleOpenUrl(certificate.url!)}>
            Abrir
          </Button>
        )}
      </Flex>
      <Box display="flex" justifyContent="start" gap={2}>
        <Button
          onClick={() => {
            setCertificate(defaultValue);
            props.onCancel();
          }}
        >
          Cancelar
        </Button>
        <Button onClick={handleAddItem} colorScheme="blue">
          Guardar
        </Button>
      </Box> */}
    </Flex>
  );
};
