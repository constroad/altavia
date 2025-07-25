'use client';

import { useEffect, useState } from 'react';
import { Button, VStack, Show, Flex, Grid } from '@chakra-ui/react';
import { Modal } from '../modal';
import { InputField, SelectField } from '../form';
import {
  EXPENSE_STATUS,
  EXPENSE_STATUS_MAP,
  IExpenseSchema,
} from '@/models/generalExpense';
import { CopyPaste } from '../upload/CopyPaste';
import { useMutate } from '@/common/hooks/useMutate';
import {
  ALTAVIA_BOT,
  API_ROUTES,
  GROUP_ADMINISTRACION_ALTAVIA,
  TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
} from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { toast } from 'src/components';
import { useMedias } from '@/common/hooks/useMedias';
import { TelegramFileView } from '../telegramFileView';
import { formatISODate, formatUtcDateTime } from '@/utils/general';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { ITripSchemaValidation } from '@/models/trip';
import { useBufferedFiles } from '@/common/hooks/useBufferedFiles';

interface ExpenseModalProps {
  trip: ITripSchemaValidation | null;
  expense?: IExpenseSchema;
  resourceId: string;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const ExpenseModal = (props: ExpenseModalProps) => {
  const { open, onClose, resourceId, expense, trip } = props;
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('paid');
  const [date, setDate] = useState(formatISODate(new Date()));
  const [amount, setAmount] = useState<number | ''>('');
  const { onSendWhatsAppText } = useWhatsapp({
    page: 'ExpenseModal',
  });

  const {
    uploadedFiles,
    objectUrls,
    onSelect,
    onPaste,
    removeFile,
    resetFiles,
  } = useBufferedFiles({
    immediateUpload: !!expense, // si ya existe, sube al instante
    onUpload: (file) => {
      onUpload(file, {
        type,
        fileName: file.name,
        metadata,
        onSuccess: handleRefreshMedias,
      });
    },
  });

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setStatus(expense.status);
      setAmount(expense.amount);
      setDate(formatISODate(expense.date));
    }
  }, [expense]);

  const isValidExpense = !!expense;

  const { mutate: mutateExpense, isMutating } = useMutate(API_ROUTES.expenses);
  const type = 'TRIP_EXPENSE';
  const metadata = {
    tripId: resourceId,
    expenseId: expense?._id,
  };
  const { onUpload, isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId,
  });

  const handleSave = () => {
    if (!description || !amount) {
      toast.error('Ingrese datos obligatorios');
      return;
    }
  
    const payload = {
      tripId: resourceId,
      description,
      amount,
      type: 'trip',
      status,
      date,
    };
  
    if (expense) {
      mutateExpense('PUT', payload, {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: () => {
          toast.success('Gasto Actualizado');
          handleRefreshMedias();
          resetForm();
        },
      });
      return;
    }
  
    mutateExpense('POST', payload, {
      onSuccess: (response) => {
        toast.success('Gasto de viaje registrado');
  
        if (uploadedFiles && uploadedFiles.length > 0) {
          let uploadedCount = 0;
  
          uploadedFiles.forEach((file) => {
            onUpload(file, {
              type,
              fileName: file.name,
              metadata: {
                ...metadata,
                expenseId: response._id,
              },
              onSuccess: () => {
                uploadedCount++;
                if (uploadedCount === uploadedFiles.length) {
                  handleRefreshMedias();
                  handleClose();
                }
              },
            });
          });
        } else {
          handleRefreshMedias();
          handleClose();
        }
  
        sendingAlert(response);
      },
    });
  };

  function sendingAlert(expense: IExpenseSchema) {    
    //@ts-ignore
    const date = formatUtcDateTime(expense.date as string)

    onSendWhatsAppText({
      message: `${ALTAVIA_BOT}

Se ha agregado un nuevo *Gasto* al viaje con destino a *${
        trip?.destination
      }*
- Fecha: ${date}
- Descripcion: ${expense.description}
- monto: ${expense.amount}
      `,
      to: GROUP_ADMINISTRACION_ALTAVIA,
    });
  }

  function resetForm() {
    resetFiles();
    setDescription('');
    setAmount('');
    setStatus('paid');
    setDate(formatISODate(new Date()));
  }

  const handleRefreshMedias = () => {
    useFetch.mutate(API_ROUTES.expenses);
    useFetch.mutate(API_ROUTES.media);
    props.onRefresh?.();
    refetch();
  };
  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} heading="Agregar Gasto">
      <VStack spaceY={0} w="100%" alignItems="start">
        <InputField
          size="xs"
          name="description"
          label="Descripcion"
          controlled
          value={description}
          onChange={(value) => setDescription(value as string)}
          isRequired
        />
        <Flex justifyContent="space-between" width="100%" gap={2}>
          <InputField
            type="date"
            size="xs"
            name="startDate"
            label="Fecha"
            controlled
            value={date}
            onChange={(value) => setDate(value as string)}
            isRequired
          />
          <InputField
            type="number"
            size="xs"
            name="startDate"
            label="Monto"
            controlled
            value={amount}
            onChange={(value) => setAmount(value as number)}
            isRequired
          />
        </Flex>

        <Flex
          justifyContent="space-between"
          width="100%"
          gap={2}
          alignItems="end"
        >
          <SelectField
            width="150px"
            isRequired
            label="Estado"
            name="status"
            size="xs"
            controlled
            value={status}
            onChange={(value) => setStatus(value)}
            options={EXPENSE_STATUS.map((status) => ({
              value: status,
              label: EXPENSE_STATUS_MAP[status],
            }))}
          />
          <Button
            onClick={handleSave}
            colorScheme="blue"
            size="xs"
            loading={isMutating || isUploading}
          >
            Guardar
          </Button>
        </Flex>

        <CopyPaste
          type="TRIP_EXPENSE"
          resourceId={resourceId}
          onSelect={onSelect}
          onPaste={onPaste}
          metadata={metadata}
          onSuccess={handleRefreshMedias}
        />

        <Show when={uploadedFiles.length > 0}>
          <VStack width="100%" spaceY={1}>
            {uploadedFiles.map((file, index) => (
              <Flex
                key={index}
                width="100%"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center" gap="2">
                  <img
                    src={objectUrls[index]}
                    alt={file.name}
                    style={{ height: '80px', borderRadius: '4px' }}
                  />
                  <span>{file.name}</span>
                </Flex>
                <Button
                  size="2xs"
                  variant="outline"
                  colorPalette='danger'
                  onClick={() => removeFile(index)}
                >
                  x
                </Button>
              </Flex>
            ))}
          </VStack>
        </Show>

        <Show when={medias?.length > 0}>
          <Grid templateColumns="repeat(2, 1fr)" gap="2">
            {medias
              ?.filter?.((x) => x.metadata.expenseId === expense?._id)
              ?.map?.((media) => (
                <TelegramFileView
                  key={media._id}
                  media={media}
                  description={media.name}
                  canDelete
                  onRefresh={handleRefreshMedias}
                  imageStyle={{
                    height: '200px',
                  }}
                />
              ))}
          </Grid>
        </Show>
      </VStack>
    </Modal>
  );
};
