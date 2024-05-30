import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IOrderValidationSchema } from 'src/models/order';
import { CertificateForm } from './CertificateForm';

interface CertificateProps {
  list: IOrderValidationSchema['certificados'];
  onSave?: (values: IOrderValidationSchema['certificados']) => void;
}

export const Certificate = (props: CertificateProps) => {
  const [certificates, setCertificates] = useState<
    IOrderValidationSchema['certificados']
  >([]);
  const [certificateSelected, setCertificateSelected] = useState<
    IOrderValidationSchema['certificados'][0] | undefined
  >();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.list.length > 0 && certificates.length === 0) {
      setCertificates(props.list);
    }
  }, [props.list]);

  const handleAddCertificate = (
    item: IOrderValidationSchema['certificados'][0]
  ) => {
    // update certificate
    if (certificateSelected) {
      const listUpdated = certificates.map((cert) => {
        if (cert._id === item._id) {
          return item;
        }
        return cert;
      });
      setCertificates(listUpdated);
      props.onSave?.(listUpdated);
      onClose();
      setCertificateSelected(undefined)
      return;
    }
    
    // new
    const newList = [...certificates];
    newList.push(item);
    setCertificates([...newList]);
    props.onSave?.([...newList]);
    setCertificateSelected(undefined)
    onClose();
  };

  const handleSelectCertificate = (
    item: IOrderValidationSchema['certificados'][0]
  ) => {
    setCertificateSelected(item);
    onOpen();
  };

  const handleDeleteCertificate = (
    item: IOrderValidationSchema['certificados'][0]
  ) => {
    let newList = [...certificates];

    newList = newList.filter((x) => x._id !== item._id);
    setCertificates([...newList]);
    props.onSave?.([...newList]);
    onClose();
  };

  return (
    <Flex flexDir="column" gap={2}>
      {isOpen && (
        <CertificateForm
          certificate={certificateSelected}
          onCancel={() => {
            onClose();
            setCertificateSelected(undefined);
          }}
          onSave={handleAddCertificate}
        />
      )}
      {!isOpen && (
        <>
          <Box>
            {certificates?.map((item, idx) => (
              <Flex key={idx} fontSize={13}>
                <Box flex={1}>
                  {item.empresa} - {item.fecha}-{item.obra}
                </Box>
                <Flex gap={2}>
                  <Button
                    variant="link"
                    onClick={() => handleSelectCertificate(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => handleDeleteCertificate(item)}
                  >
                    Eliminar
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Box>
          <Button onClick={onOpen}>Agregar certificado</Button>
        </>
      )}
    </Flex>
  );
};
