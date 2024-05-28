import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
} from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useAsync } from 'src/common/hooks';
import { IClientValidationSchema } from 'src/models/client';
import { IDispatchValidationSchema } from 'src/models/dispatch';
import { formatISODate } from 'src/utils/general';
import { AutoComplete, IAutocompleteOptions } from '../autoComplete';
import { AddClient } from '../pedidos/AddClient';
import { API_ROUTES } from 'src/common/consts';
import { ITransportValidationSchema } from 'src/models/transport';
import { toast } from '../Toast';
import { AddTransport } from './AddTransport';

interface DispathFormProps {
  dispatch?: IDispatchValidationSchema;
  onSuccess: () => void;
  onClose: () => void;
}

const defaultValue: IDispatchValidationSchema = {
  date: formatISODate(new Date().toDateString()),
  transportId: '',
  clientId: '',
  invoice: '',
  description: '',
  guia: '',
  obra: '',
  quantity: 0,
  price: 0,
  subTotal: 0,
  igv: 0,
  total: 0,
  pagado: '',
  note: '',
};
const fetcher = (path: string) => axios.get(path);
const postDisptach = (path: string, data: any) => axios.post(path, { data });
const putDisptach = (path: string, data: any) => axios.put(path, data);

export const DispatchForm = (props: DispathFormProps) => {
  const [clientSelected, setClientSelected] =
    useState<IClientValidationSchema>();
  const [transportSelected, setTransportSelected] =
    useState<ITransportValidationSchema>();
  const [dispatch, setDispatch] = useState<IDispatchValidationSchema>(
    props.dispatch ?? defaultValue
  );

  // API
  const {
    run: runGetClients,
    isLoading: loadingClients,
    data: clientResponse,
    refetch,
  } = useAsync<IClientValidationSchema[]>();
  const {
    run: runGetTransports,
    isLoading: loadingTransport,
    data: responseTransport,
    refetch: refetchTransport,
  } = useAsync<ITransportValidationSchema[]>();
  const { run: runAddDispatch, isLoading: addingDispatch } = useAsync();
  const { run: runUpdateDispatch, isLoading: updatingDispatch } = useAsync();

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.client), {
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
      onSuccess: (response: AxiosResponse<IClientValidationSchema[]>) => {
        if (props.dispatch?.clientId) {
          setClientSelected(
            response.data.find((x) => x._id === props.dispatch?.clientId)
          );
        }
      },
    });

    runGetTransports(fetcher(API_ROUTES.transport), {
      refetch: () => runGetTransports(fetcher(API_ROUTES.transport)),
      onSuccess: (response: AxiosResponse<ITransportValidationSchema[]>) => {
        if (props.dispatch?.transportId) {
          setTransportSelected(
            response.data.find((x) => x._id === props.dispatch?.transportId)
          );
        }
      },
    });
  }, []);

  const clientList = clientResponse?.data ?? [];
  const clientFildsToFilter = ['name', 'ruc', 'alias'];
  const transportList = responseTransport?.data ?? [];

  const handleSelectClient = (option: IAutocompleteOptions) => {
    const client = clientList.find((x) => x._id === option.value);
    setClientSelected(client);
    setDispatch({
      ...dispatch,
      clientId: client?._id ?? '',
    });
  };
  const handleSelectTransport = (option: IAutocompleteOptions) => {
    const item = transportList.find((x) => x._id === option.value);
    setTransportSelected(item);
    setDispatch({
      ...dispatch,
      transportId: item?._id ?? '',
    });
  };

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { _id, ...payload } = dispatch;
    if (!dispatch.clientId || !dispatch.transportId || !dispatch.description) {
      toast.warning('Revise datos obligatorios');
      return;
    }
    // UPDATE
    if (_id) {
      const path = `${API_ROUTES.dispatch}/${_id}`;
      runUpdateDispatch(putDisptach(path, payload), {
        onSuccess: () => {
          toast.success('Despacho actualizado con éxito!');
          props.onSuccess?.();
          props.onClose?.();
        },
        onError: () => {
          toast.error('ocurrio un error actualizando un despacho');
        },
      });
      return;
    }
    // ADD
    runAddDispatch(postDisptach(API_ROUTES.dispatch, payload), {
      onSuccess: () => {
        toast.success('Despacho añadido con éxito!');
        props.onSuccess?.();
        props.onClose?.();
      },
      onError: () => {
        toast.error('ocurrio un error agregando un Despacho');
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmitForm}>
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(10, 1fr)' }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormControl id="material" width={{ base: '', md: '' }} isRequired>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Material
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="text"
              value={dispatch.description}
              placeholder="MEZCLA ASFALTICA"
              onChange={(e) =>
                setDispatch({ ...dispatch, description: e.target.value })
              }
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="client" width={{ base: '', md: '' }} isRequired>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Cliente
            </FormLabel>
            <AutoComplete
              isLoading={loadingClients}
              placeholder="Buscar cliente por nombre, alias o RUC"
              value={clientSelected?.name ?? ''}
              onChange={(value) =>
                setClientSelected({ ...clientSelected, name: value })
              }
              onSelect={handleSelectClient}
              options={clientList
                .filter((client: any) => {
                  return clientFildsToFilter.some((property) => {
                    const value = client[property] as string;
                    const searchValue = value?.toLowerCase();
                    return searchValue?.includes(
                      clientSelected?.name?.toLowerCase() ?? ''
                    );
                  });
                })
                .map((client) => ({
                  label: client.name,
                  value: client._id ?? '',
                }))}
              renderNoFound={() => (
                <AddClient
                  textNoFound=""
                  onSuccess={() => {
                    refetch();
                    setClientSelected(undefined);
                  }}
                />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="proyect" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Obra
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="text"
              value={dispatch.obra}
              onChange={(e) =>
                setDispatch({ ...dispatch, obra: e.target.value })
              }
              placeholder="ICA"
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="plate" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Placa
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="text"
              isDisabled
              placeholder="ABC-123"
              required
              value={transportSelected?.plate}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="invoice">
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Factura
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="text"
              value={dispatch.invoice}
              onChange={(e) => {
                setDispatch({ ...dispatch, invoice: e.target.value });
              }}
              placeholder="E001-1"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="guide" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Guia
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="text"
              value={dispatch.guia}
              onChange={(e) => {
                setDispatch({ ...dispatch, guia: e.target.value });
              }}
              placeholder="EG01-00001"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="carrier" width={{ base: '', md: '' }} isRequired>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Transportista
            </FormLabel>
            <AutoComplete
              isLoading={loadingTransport}
              placeholder="Buscar transportista"
              value={transportSelected?.company ?? ''}
              onChange={(value) =>
                setTransportSelected({
                  ...transportSelected,
                  company: value,
                  plate: '',
                })
              }
              onSelect={handleSelectTransport}
              options={transportList
                .filter((list: any) => {
                  return ['company', 'plate'].some((property) => {
                    const value = list[property] as string;
                    const searchValue = value?.toLowerCase();
                    return searchValue?.includes(
                      transportSelected?.company?.toLowerCase() ?? ''
                    );
                  });
                })
                .map((item) => ({
                  label: `${item.company}-${item.plate}`,
                  value: item._id ?? '',
                }))}
              renderNoFound={() => (
                <AddTransport
                  textNoFound=""
                  onSuccess={() => {
                    refetchTransport();
                    setTransportSelected(undefined);
                  }}
                />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="nro-cubos" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              M3:
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="number"
              value={dispatch.quantity}
              onChange={(e) => {
                let quantity = 0;
                if (e.target.value) {
                  quantity = Number(e.target.value);
                }
                const subTotal = dispatch.price * quantity;
                const total = subTotal + (dispatch.igv ?? 0);
                setDispatch({ ...dispatch, quantity, subTotal, total });
              }}
              placeholder="1"
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="price" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Precio
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="number"
              value={dispatch.price}
              onChange={(e) => {
                let price = 0;
                if (e.target.value) {
                  price = Number(e.target.value);
                }
                const subTotal = dispatch.quantity * price;
                const total = subTotal + (dispatch.igv ?? 0);
                setDispatch({ ...dispatch, price, subTotal, total });
              }}
              placeholder="480"
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
            Subtotal
          </FormLabel>
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 12, md: 14 }}
            lineHeight="14px"
            height="32px"
            type="text"
            value={dispatch.subTotal}
            placeholder="0"
            disabled
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
            IGV
          </FormLabel>
          <NumberInput
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 10, md: 12 }}
            lineHeight="14px"
            height="30px"
            size="sm"
            value={dispatch.igv}
            onChange={(value) => {
              let igv = 0;
              if (value) {
                igv = Number(value);
              }
              const total = dispatch.subTotal + igv;
              setDispatch({ ...dispatch, igv, total });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </GridItem>

        <GridItem colSpan={1}>
          <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
            Total
          </FormLabel>
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 12, md: 14 }}
            lineHeight="14px"
            height="32px"
            type="text"
            value={dispatch.total}
            placeholder="subtotal + igv"
            disabled
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="payment-done" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Pagos
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="text"
              value={dispatch.pagado}
              onChange={(e) => {
                setDispatch({ ...dispatch, pagado: e.target.value });
              }}
              placeholder=""
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl id="payment-done" width={{ base: '', md: '' }}>
            <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
              Fecha
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight="14px"
              height="32px"
              type="date"
              value={dispatch.date}
              onChange={(e) => {
                setDispatch({ ...dispatch, date: e.target.value });
              }}
              placeholder=""
              required
            />
          </FormControl>
        </GridItem>
      </Grid>

      <GridItem colSpan={2}>
        <FormControl id="invoice">
          <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }}>
            Notas
          </FormLabel>
          <Textarea
            size="xs"
            name="notas"
            value={dispatch.note}
            onChange={(e) => {
              setDispatch({ ...dispatch, note: e.target.value });
            }}
          />
        </FormControl>
      </GridItem>

      <Box mt="10px" gap={2} as={Flex}>
        <Button
          loadingText="Enviando"
          size={{ base: 'sm', md: 'md' }}
          onClick={() => {
            setDispatch(defaultValue);
            props.onClose();
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={addingDispatch || updatingDispatch}
          loadingText="Enviando"
          colorScheme="blue"
          size={{ base: 'sm', md: 'md' }}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default DispatchForm;
