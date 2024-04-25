import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { useAsync, useScreenSize } from 'src/common/hooks';
import {
  ClientType,
  IntranetLayout,
  ServiceQuoteType,
  toast,
  generateServiceQuoteColumns,
  generateMobileServiceQuoteColumns,
  TableComponent,
  Modal,
  ServiceQuoteModal,
} from 'src/components';
import { PlusIcon } from 'src/common/icons';
import { useRouter } from 'next/router';
import { useQuote } from 'src/context';

const fetcher = (path: string) => axios.get(path)
const deleteQuote = (path: string) => axios.delete(path)

export const ServiceQuotePage = () => {
  const [clientsDB, setClientsDB] = useState<ClientType[]>([])
  const [quotesDBList, setQuotesDBList] = useState<ServiceQuoteType[]>([])
  const { serviceQuoteSelected, setNewServiceQuoteSelected, setServiceQuoteSelected } = useQuote();

  const { isOpen: isOpenQuoteModal, onOpen: onOpenQuoteModal, onClose: onCloseQuoteModal } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter();

  const { run: runGetClients } = useAsync({ onSuccess(data) { setClientsDB(data.data) } })
  
  const { run: runGetQuotes, isLoading, refetch: refetchQuotes } = useAsync({ onSuccess(data) { setQuotesDBList(data.data) } })
  const { run: runDeleteQuote, isLoading: loadingDeleteQuote  } = useAsync()

  useEffect(() => {
    const fetchQuoteServicesClientData = async () => {
      
      const quotePromise = runGetQuotes(fetcher(API_ROUTES.serviceQuote), {
        refetch: () => runGetQuotes(fetcher(API_ROUTES.serviceQuote)),
        cacheKey: API_ROUTES.serviceQuote
      });

      const clientsPromise = runGetClients(fetcher(API_ROUTES.client), {
        cacheKey: `${API_ROUTES.client}-service-quote`
      });
  
      await Promise.all([quotePromise, clientsPromise]);
    };
  
    fetchQuoteServicesClientData();
  }, []);

  const handleNewQuoteClick = () => {
    router.push(ADMIN_ROUTES.newServiceQuote)
  }

  const handleEditQuote = (quote: ServiceQuoteType) => {
    router.push(ADMIN_ROUTES.newServiceQuote)
    setNewServiceQuoteSelected(quote)
  }

  // delete client
  const handleCloseDeleteModal = () => {
    setNewServiceQuoteSelected(undefined)
    onCloseDelete()
  }
  const handleDeleteClick = (quoteSelected: ServiceQuoteType) => {
    setNewServiceQuoteSelected(quoteSelected)
    onOpenDelete()
  }
  const handleDeleteQuote = () => {
    runDeleteQuote(deleteQuote(`${API_ROUTES.serviceQuote}/${serviceQuoteSelected?._id}`), {
      onSuccess: () => {
        refetchQuotes()
        toast.success('Cotizacion eliminada correctamente')
      },
      onError: (err) => {
        console.log(err)
        toast.error('Algo salio mal al eliminar la cotización, contacte al administrador')
      }
    })

    setNewServiceQuoteSelected(undefined)
    handleCloseDeleteModal()
  }

  // quote mobile preview
  const handleSelectQuote = (quote: ServiceQuoteType) => {
    setNewServiceQuoteSelected(quote)
    onOpenQuoteModal()
  }
  const handleCloseQuoteModal = () => {
    onCloseQuoteModal()
    setNewServiceQuoteSelected(undefined)
  }

  const columns = generateServiceQuoteColumns(clientsDB, handleSelectQuote)
  const mobileColumns = generateMobileServiceQuoteColumns(clientsDB, handleSelectQuote)
  const quoteClient = clientsDB.find(cli => cli._id === serviceQuoteSelected?.clientId)

  // Renders
  const deleteFooter = (
    <Button
      isLoading={loadingDeleteQuote}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteQuote}
    >
      Confirm
    </Button>
  )

  return (
    <IntranetLayout>
      <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        marginX='auto'
        gap='5px'
      >
        <Text
          fontSize={{ base: 20, md: 30 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
          marginX='auto'
        >
          Cotizaciones de servicio
        </Text>
        <Flex width='100%' justifyContent='end' gap='4px'>
          <Button
            size='sm'
            width={{base: '120px', md: '200px'}}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            onClick={handleNewQuoteClick}
            colorScheme='blue'
            height='25px'
            gap={2}
          >
            <Text>Nueva cotización</Text><PlusIcon fontSize={ isMobile ? 10 : 14 }/>
          </Button>
        </Flex>

        {isDesktop && (
          <TableComponent
            data={quotesDBList.sort((a,b) => b.nro - a.nro)}
            columns={columns}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
            pagination
            actions
          />
        )}

        {isMobile && (
          <TableComponent
            data={quotesDBList.sort((a,b) => b.nro - a.nro)}
            columns={mobileColumns}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
            pagination
            actions
          />
        )}
      </Flex>

      {/* delete quote modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDeleteModal}
        heading={`¿Estás seguro de eliminar la cotización ${serviceQuoteSelected?.nro}?`}
        footer={deleteFooter}
      />

      {/* VIEW */}
      {serviceQuoteSelected && (
        <Modal
          isOpen={isOpenQuoteModal}
          heading={quoteClient?.name}
          onClose={handleCloseQuoteModal}
        >
          <ServiceQuoteModal quote={serviceQuoteSelected} clients={clientsDB} />
        </Modal>
      )}

    </IntranetLayout>
  )
}

export default ServiceQuotePage;
