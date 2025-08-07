'use client'

import React, { useState } from 'react'
import { generateMediaColumns, InputField, MediaForm, Modal, PageHeader, SelectField, TableComponent } from '@/components'
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useFetch } from '@/common/hooks/useFetch';
import { IMediaValidationSchema, MediaType } from '@/models/media';
import { API_ROUTES } from '@/common/consts';
import { getDateStringRange, parseLocalDate } from '@/utils/general';
import { RefreshIcon } from '@/common/icons';

const mediaTypes: MediaType[] = [
  'GENERAL_EXPENSE',
  'TRIP_TRACKING',
  'TRIP_EXPENSE',
  'TRIP_BILL_OF_LOADING',
  'TRIP_BILL_OF_LOADING_CARRIER',
  'TRIP_INVOICE',
  'TRIP_CREDIT_NOTE',
  'TRIP_PAYMENT',
  'VEHICLE',
  'DRIVER',
  'EMPLOYEE_AVATAR',
];

export default function MediasPage() {
  const { dateTo, dateFrom } = getDateStringRange(15);
  const [startDate, setStartDate] = useState(dateFrom);
  const [endDate, setEndDate] = useState(dateTo);
  const [type, setType] = useState<MediaType>()
  const [mediaSelected, setMediaSelected] = useState()
  const { onOpen, open, onClose } = useDisclosure()

  const { data, isLoading, refetch } = useFetch<IMediaValidationSchema[]>(
      API_ROUTES.media, {
        queryParams: {
          startDate: parseLocalDate(startDate).toDateString(),
          endDate: parseLocalDate(endDate).toDateString(),
          type
        }
      }
  );

  const handleCloseModal = () => {
    setMediaSelected(undefined)
    onClose();
  }

  const handleOnSuccess = () => {
    handleCloseModal();
    setTimeout(() => {
      refetch();
    }, 1000);
  }

  const columns = generateMediaColumns()

  const mediaTypeOptions = mediaTypes.map((type) => ({
    value: type,
    label: type.replace(/_/g, ' '), // Opcional: mejora la legibilidad
  }));

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Usuarios' />
      <Flex gap={1} alignItems="end" width="fit-content" mb={1}>
        <InputField
          size="xs"
          controlled
          name="startDate"
          label="Desde:"
          type="date"
          value={startDate}
          onChange={(value) => {
            setStartDate(String(value));
          }}
        />
        <InputField          
          size="xs"
          controlled
          name="endDate"
          label="Hasta:"
          type="date"
          value={endDate}
          onChange={(value) => {
            setEndDate(String(value));
          }}
        />
        <SelectField
          controlled
          size="xs"
          label="Tipo"
          name="mediaType"
          options={mediaTypeOptions}
          value={type}
          onChange={(value) => setType(value as MediaType)}
        />
        <Button onClick={refetch} size="xs">
          <RefreshIcon fontSize={36} />
        </Button>
      </Flex>

      <Flex mt='5px'>
          <Box w="100%">
          <TableComponent
            itemsPerPage={20}
            data={data ?? []}
            columns={columns}
            onEdit={(item) => {
              setMediaSelected(item);
              onOpen();
            }}
            isLoading={isLoading}
            pagination
            actions
          />
        </Box>
      </Flex>

      <Modal
        hideCancelButton
        isOpen={open}
        onClose={handleCloseModal}
        heading='Editar Media'
      >
        {mediaSelected && (
          <MediaForm
            media={mediaSelected!}
            onSuccess={handleOnSuccess}
            refetchMedias={refetch}
          />
        )}
      </Modal>

    </Flex>
  )
}
