import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  Textarea,
  Switch,
  useDisclosure,
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
import { IOrderValidationSchema } from 'src/models/order';
import { getDate } from 'src/common/utils';
import { DownloadIcon } from 'src/common/icons';
import { DispatchNotePDFType } from './utils';
import { Modal } from '../Modal';

interface DispathFormProps {
  dispatch?: IDispatchValidationSchema;
  onSuccess: () => void;
  onClose: () => void;
  dispatchList: any;
}

const defaultValue: IDispatchValidationSchema = {
  date: formatISODate(new Date().toDateString()),
  transportId: '',
  clientId: '',
  invoice: '',
  description: 'Mezcla asfaltica',
  guia: '',
  obra: '',
  quantity: 0,
  price: 480,
  subTotal: 0,
  igv: 0,
  total: 0,
  note: '',
};
const fetcher = (path: string) => axios.get(path);
const postDisptach = (path: string, data: any) => axios.post(path, { data });
const putDisptach = (path: string, data: any) => axios.put(path, data);

export const DispatchForm = (props: DispathFormProps) => {
  const [igvCheck, setIgvCheck] = useState(false);
  const [searchOrder, setSearchOrder] = useState('');
  const [clientSelected, setClientSelected] =
    useState<IClientValidationSchema>();
  const [transportSelected, setTransportSelected] =
    useState<ITransportValidationSchema>();
  const [dispatch, setDispatch] = useState<IDispatchValidationSchema>(
    props.dispatch ?? defaultValue
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.dispatch) {
      setDispatch(props.dispatch);
    }
    if (props.dispatch?.igv) {
      setIgvCheck(true);
    }
  }, [props.dispatch]);

  // API
  const {
    run: runGetOrders,
    isLoading: loadingOrders,
    data: orderResponse,
  } = useAsync<IOrderValidationSchema[]>();

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
    runGetOrders(fetcher(API_ROUTES.order), {
      refetch: () => runGetClients(fetcher(API_ROUTES.order)),
      onSuccess: (response: AxiosResponse<IOrderValidationSchema[]>) => {
        if (props.dispatch?.orderId && response) {
          setSearchOrder(
            getOrderSearch(
              response.data.find((x) => x._id === props.dispatch?.orderId)
            ) ?? ''
          );
        }
      },
    });

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
  const ordertFildsToFilter = ['cliente', 'fechaProgramacion', 'notas'];
  const orderList = orderResponse?.data ?? [];

  // Handlers
  function getOrderSearch(order?: IOrderValidationSchema) {
    if (!order) return '';
    return `${order.cliente} - ${order.fechaProgramacion.split('T')[0]} - ${
      order.cantidadCubos
    } cubos`;
  }

  const handleSelectOrder = (option: IAutocompleteOptions) => {
    const order = orderList.find((x) => x._id === option.value);
    const client = clientResponse.data.find((x) => x._id === order?.clienteId);
    if (!order) return;
    setSearchOrder(getOrderSearch(order));
    const quantity = order?.cantidadCubos ?? 0;
    const price = order?.precioCubo ?? 0;
    setClientSelected(client);

    setDispatch({
      ...dispatch,
      orderId: order?._id ?? '',
      clientId: client?._id ?? '',
      obra: order?.obra,
      quantity,
      price,
      subTotal: quantity * price,
      total: quantity * price,
    });
  };
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
      phoneNumberToSend: item?.phone,
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
          onOpen()
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
        onOpen();
      },
      onError: () => {
        toast.error('ocurrio un error agregando un Despacho');
      },
    });
  };

  const handleGenerateDispatchNote = async () => {
    if (clientSelected && dispatch && transportSelected) {
      const { slashDate, peruvianTime, currentYear } = getDate();
      const number = props.dispatchList.data.length + 1;
      const dispatchNoteNumber = `${currentYear}-${number}`;

      const pdfData: DispatchNotePDFType = {
        nro: dispatchNoteNumber,
        date: slashDate,
        clientName: clientSelected.name,
        proyect: dispatch.obra || '',
        material: dispatch.description,
        amount: dispatch.quantity,
        plate: transportSelected.plate,
        transportist:
          transportSelected.driverName || transportSelected.company || '',
        hour: peruvianTime,
        note: dispatch.note || '',
      };

      const response = await axios.post(
        API_ROUTES.generateDispatchNotePDF,
        { pdfData },
        { responseType: 'arraybuffer' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfName = `Despacho_${transportSelected.plate}_${slashDate}.pdf`;

      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', pdfName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      sendWhatsAppMessage(dispatch.phoneNumberToSend ?? '');

      onClose()
      props.onClose()
      return;
    }
    toast.warning('faltan datos');
  };

  const sendWhatsAppMessage = (phone: string) => {
    if (!phone) {
      toast.warning("Ingrese el numero de celular")
      return
    }
    const message = `ConstRoad te envia el vale de despacho
     - Obra: ${dispatch.obra}
     - Nro Cubos: ${dispatch.quantity}
    `;
    const url = `https://api.whatsapp.com/send?phone=51${phone}&text=${message}`;
    const win = window.open(url, '_blank');
    win?.focus();
  };

  return (
    <Box as="form" onSubmit={handleSubmitForm} fontSize={12}>
      <Box as={Flex} gap={10} alignItems="start" justifyContent="center">
        <Box width="50%" mb={2} as={Flex} flexDir="column" gap={2}>
          <FormControl id="payment-done">
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
              Fecha
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12 }}
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
          <Box>
            <Text>Pedido: (opcional)</Text>
            <AutoComplete
              isLoading={loadingOrders}
              placeholder="Buscar Pedidos por cliente o fecha"
              value={searchOrder ?? ''}
              onChange={(value) => setSearchOrder(value)}
              onSelect={handleSelectOrder}
              options={orderList
                .filter((order: any) => {
                  return ordertFildsToFilter.some((property) => {
                    const value = order[property] as string;
                    const searchValue = value?.toLowerCase();
                    return searchValue?.includes(searchOrder.toLowerCase());
                  });
                })
                .map((order) => ({
                  label: getOrderSearch(order),
                  value: order._id ?? '',
                }))}
            />
          </Box>
          <FormControl id="client" isRequired>
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
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

          <FormControl id="material" isRequired>
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
              Material
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12 }}
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

          <FormControl id="proyect">
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
              Obra
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12 }}
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
        </Box>

        <Box flex={1}>
          <FormControl id="carrier" isRequired>
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
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

          <Flex flexDir={{ base: 'column', md: 'row' }}>
            <FormControl id="plate">
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Placa
              </FormLabel>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize={{ base: 12 }}
                lineHeight="14px"
                height="32px"
                type="text"
                required
                value={transportSelected?.plate}
              />
            </FormControl>
            <FormControl id="phone">
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Celular
              </FormLabel>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize={{ base: 12 }}
                lineHeight="14px"
                height="32px"
                type="text"
                required
                onChange={(e) =>
                  setDispatch({
                    ...dispatch,
                    phoneNumberToSend: e.target.value,
                  })
                }
                value={dispatch?.phoneNumberToSend}
              />
            </FormControl>
          </Flex>

          <Flex flexDir={{ base: 'column', md: 'row' }}>
            <FormControl id="invoice">
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Factura
              </FormLabel>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize={{ base: 12 }}
                lineHeight="14px"
                height="32px"
                type="text"
                value={dispatch.invoice}
                onChange={(e) => {
                  setDispatch({ ...dispatch, invoice: e.target.value });
                }}
              />
            </FormControl>

            <FormControl id="guide">
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Guia
              </FormLabel>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize={{ base: 12 }}
                lineHeight="14px"
                height="32px"
                type="text"
                value={dispatch.guia}
                onChange={(e) => {
                  setDispatch({ ...dispatch, guia: e.target.value });
                }}
              />
            </FormControl>
          </Flex>

          <FormControl id="notes">
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
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
        </Box>
      </Box>

      <Flex flexDir="row" flexWrap="wrap" my={2} gap={2}>
        <FormControl id="nro-cubos" width={{ base: '48%', md: '10%' }}>
          <FormLabel mb="6px" fontSize={{ base: 12 }}>
            M3:
          </FormLabel>
          <NumberInput
            fontSize={{ base: 10 }}
            size="xs"
            value={dispatch.quantity}
            onChange={(value) => {
              let quantity = 0;
              let igv = 0;

              if (value) {
                quantity = Number(value);
              }
              const subTotal = dispatch.price * quantity;
              if (igvCheck) {
                igv = subTotal * 0.18;
              }
              const total = subTotal + igv;
              setDispatch({ ...dispatch, quantity, subTotal, total, igv });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl id="price" width={{ base: '48%', md: '10%' }}>
          <FormLabel mb="6px" fontSize={{ base: 12 }}>
            Precio
          </FormLabel>
          <NumberInput
            fontSize={{ base: 10 }}
            size="xs"
            value={dispatch.price}
            onChange={(value) => {
              let price = 0;
              let igv = 0;
              if (value) {
                price = Number(value);
              }
              const subTotal = dispatch.quantity * price;
              if (igvCheck) {
                igv = subTotal * 0.18;
              }
              const total = subTotal + igv;
              setDispatch({ ...dispatch, price, subTotal, total, igv });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl width={{ base: '48%', md: '10%' }}>
          <FormLabel mb="6px" fontSize={{ base: 12 }}>
            Subtotal
          </FormLabel>
          <NumberInput
            fontSize={{ base: 10 }}
            size="xs"
            value={dispatch.subTotal}
            isDisabled
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl width={{ base: '48%', md: '10%' }}>
          <FormLabel mb="6px" fontSize={{ base: 12 }}>
            IGV
          </FormLabel>
          <NumberInput
            fontSize={10}
            size="xs"
            value={dispatch.igv}
            isDisabled
            onChange={(value) => {
              let igv = 0;
              if (value) {
                igv = Number(value);
              }
              const total = dispatch.subTotal + igv;
              setDispatch({ ...dispatch, total, igv });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl width={{ base: '48%', md: '10%' }}>
          <FormLabel mb="6px" fontSize={{ base: 12 }}>
            Total
          </FormLabel>
          <Input
            size="xs"
            type="text"
            value={dispatch.total}
            placeholder="subtotal + igv"
            disabled
            required
          />
        </FormControl>
        <Box
          alignItems="start"
          justifyItems="center"
          as={Flex}
          flexDir="column"
          flex={1}
          gap={2}
        >
          <Text>IGV?</Text>
          <Switch
            id="isChecked"
            defaultValue={igvCheck.toString()}
            flex={1}
            isChecked={igvCheck}
            onChange={(value) => {
              const ivgCheck = value.target.checked;
              let igvValue = 0;
              setIgvCheck(ivgCheck);
              if (ivgCheck) {
                igvValue = dispatch.subTotal * 0.18;
              }
              setDispatch({
                ...dispatch,
                igv: igvValue,
                total: dispatch.subTotal + igvValue,
              });
            }}
          />
        </Box>
      </Flex>

      <Box mt="10px" gap={2} as={Flex} justifyContent="end">
        <Button
          loadingText="Enviando"
          size="sm"
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
          size="sm"
        >
          Guardar
        </Button>

        {props.dispatch?._id && (
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleGenerateDispatchNote}
          >
            <DownloadIcon fontSize={20} />
            <Text ml="5px">Vale</Text>
          </Button>
        )}
      </Box>

      {/* order form modal */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={onClose}
        heading="Imprimir vale"
      >
        <>
          <FormLabel mb="6px" fontSize={{ base: 12 }}>
            Celular
          </FormLabel>
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 12 }}
            lineHeight="14px"
            height="32px"
            type="text"
            required
            onChange={(e) =>
              setDispatch({
                ...dispatch,
                phoneNumberToSend: e.target.value,
              })
            }
            value={dispatch?.phoneNumberToSend}
          />

          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleGenerateDispatchNote}
          >
            <DownloadIcon fontSize={20} />
            <Text ml="5px">Descargar</Text>
          </Button>
        </>
      </Modal>
    </Box>
  );
};

export default DispatchForm;
