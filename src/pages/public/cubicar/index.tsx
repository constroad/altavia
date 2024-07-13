import {
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { PortalLayout } from 'src/components';
import { useMemo, useState } from 'react';
import { useFetch } from 'src/common/hooks/useFetch';
import { API_ROUTES } from 'src/common/consts';
import { ITransportValidationSchema } from 'src/models/transport';
import { ArrowBackIcon, TruckIcon } from 'src/common/icons';
import CubicaForm from 'src/components/cubica/CubicaForm';

interface CubicarProps {}

const Cubicar = () => {
  const [transport, setTransport] = useState<ITransportValidationSchema>();
  const { isLoading, data, refetch } = useFetch<ITransportValidationSchema[]>(
    API_ROUTES.transport
  );
  const [plate, setPlate] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const transportList = useMemo(() => {
    return (
      data?.filter((x) =>
        x.plate.toLowerCase().includes(plate.toLowerCase())
      ) ?? []
    );
  }, [plate, data]);

  const renderBody = () => {
    if (isOpen) {
      return (
        <CubicaForm
          transport={transport}
          onSave={() => {
            onClose();
            refetch();
          }}
        />
      );
    }

    return (
      <>
        <Flex
          bgColor="white"
          alignItems="end"
          justifyContent="start"
          px={2}
          py={3}
          gap={1}
          rounded={4}
          flexDir="column"
        >
          <Input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="Buscar por placa"
          />
          <Button colorScheme="yellow" size="sm" onClick={onOpen}>
            + Agregar
          </Button>
        </Flex>
        <Text fontWeight={600} fontSize={15}>
          Listado
        </Text>
        {isLoading && <Spinner />}
        {!isLoading && transportList.length === 0 && (
          <Flex flexDir="column" alignItems="center" gap={4}>
            <Text fontWeight={400} fontSize={12}>
              No encontramos un transporte con esa placa
            </Text>
          </Flex>
        )}
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }}
          gap={6}
        >
          {transportList.map((t) => (
            <GridItem key={t._id}>
              <Flex
                border="solid 1px white"
                px={10}
                py={2}
                rounded={20}
                bgColor="white"
                flexDir="column"
                alignItems="center"
                cursor="pointer"
                onClick={() => {
                  setTransport(t);
                  onOpen();
                }}
              >
                <TruckIcon fontSize={50} color="#20a760" />
                {t.plate}
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <PortalLayout>
      <Flex
        w="100%"
        py={10}
        px={{ base: '20px', md: '100px' }}
        flexDir="column"
        gap={5}
        bgColor="whitesmoke"
        fontSize={12}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontWeight={600} fontSize={18}>
            Gestion de transporte
          </Text>
          {isOpen && (
            <Button
              onClick={() => {
                onClose();
                setPlate('');
              }}
              colorScheme="yellow"
              size="sm"
            >
              <ArrowBackIcon/> Regresar
            </Button>
          )}
        </Flex>
        {renderBody()}
      </Flex>
    </PortalLayout>
  );
};

export default Cubicar;
