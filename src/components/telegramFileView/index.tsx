import {
  Box,
  Button,
  Flex,
  FlexProps,
  Show,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CSSProperties, ImgHTMLAttributes, useEffect, useState } from 'react';
import { useTelegram } from 'src/common/hooks/useTelegram';
import { CopyIcon, DownloadIcon, SaveIcon, TrashIcon } from 'src/common/icons';
import { IMediaValidationSchema, MediaType } from 'src/models/media';
import { API_ROUTES } from 'src/common/consts';
import { useMutate } from 'src/common/hooks/useMutate';
import { InputField } from '../form';
import { toast } from '../Toast';
import { ImageView } from './imageView';
import { VideoView } from './videoView';
import { copyToClipboard } from 'src/common/utils/copyToClipboard';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { Overlay } from '../Overlay';

interface TelegramFileViewProps {
  allowClick?: boolean;
  description?: string | JSX.Element;
  media: IMediaValidationSchema;
  canDelete?: boolean;
  canEdit?: boolean;
  canToggleView?: boolean;
  canCopyUrl?: boolean;
  onRefresh?: () => void;
  isTransportist?: boolean;
  imageStyle?: ImgHTMLAttributes<HTMLImageElement>;
  videoStyle?: CSSProperties;
  containerProps?: Omit<FlexProps, 'onClick' | 'flexDir'>;
  onSelect?: (media: IMediaValidationSchema) => void;
}

export const TelegramFileView = (props: TelegramFileViewProps) => {
  const [_, setLoadingImage] = useState(true);
  const [fileName, setFileName] = useState(props.media.name);
  const { type, url: telegramFileUrl } = props.media;
  const { fileId, thumbnailFileId } = props.media.metadata;
  const { open, onOpen, onClose } = useDisclosure();

  const { getFileUrl, isLoading, downloadFile, isDownloading } = useTelegram({
    chat_id: '',
  });
  const { mutate: onMutateMedia, isMutating } = useMutate(
    `${API_ROUTES.media}/:id`,
    {
      urlParams: {
        id: props.media._id,
      },
    }
  );

  const [url, setUrl] = useState('');

  useEffect(() => {
    let fileIdentifier = thumbnailFileId ?? fileId;
    setLoadingImage(true);
    if (props.media.mimeTye.includes('video')) {
      fileIdentifier = fileId;
      setLoadingImage(false);
    }
    if (fileIdentifier) {
      getFileUrl(fileIdentifier).then((urlImage) => {
        setUrl(urlImage ?? '');
      });
    }
  }, [fileId, thumbnailFileId]);

  const getImageThumbnail = (fileUrl: string) => {
    const mediaType = type as MediaType;
    if (mediaType === 'TRIP_BILL_OF_LOADING' || mediaType === 'TRIP_BILL_OF_LOADING_CARRIER') {
      return '/img/placeholders/guia.png';
    }
    if (mediaType === 'TRIP_INVOICE') {
      return '/img/placeholders/invoice.png';
    }
    return fileUrl;
  };

  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  const handleDelete = () => {
    onMutateMedia(
      'DELETE',
      {},
      {
        onSuccess: () => props.onRefresh?.(),
      }
    );
  };

  const renderDescription = () => {
    if (props.canEdit && !isLoading) {
      return (
        <Flex justifyContent="space-between" gap={1} mt={1} ml={1}>
          <InputField
            controlled
            name="Name"
            value={fileName}
            onChange={(value) => setFileName(value as string)}
          />
          <Button
            loading={isMutating}
            size="xs"
            colorScheme="blue"
            onClick={() => {
              onMutateMedia(
                'PUT',
                {
                  name: fileName,
                },
                {
                  onSuccess: () => {
                    props.onRefresh?.();
                    toast.success('Archivo actualizado');
                  },
                }
              );
            }}
          >
            <IconWrapper icon={SaveIcon} />
          </Button>
        </Flex>
      );
    }
    if (typeof props.description === 'string') {
      return (
        <Text mt={1} fontSize={11}>
          {props.description}
        </Text>
      );
    }
    if (typeof props.description !== 'string') {
      return <>{props.description}</>;
    }
  };

  const renderActions = () => {
    if (isLoading) {
      return null;
    }
    return (
      <>
        <Show when={props.canCopyUrl}>
          <Button
            variant="plain"
            size="xs"
            onClick={() => {
              copyToClipboard(telegramFileUrl, 'Url copiado');
            }}
          >
            <IconWrapper icon={CopyIcon} />
          </Button>
        </Show>

        <Show when={props.canDelete}>
          <Button variant="plain" size="xs" onClick={onOpen}>
            <IconWrapper icon={TrashIcon} color="red" />
          </Button>
        </Show>

        <Button
          variant="plain"
          size={'xs'}
          loading={isDownloading}
          onClick={() => {
            downloadFile(fileId, props.media.name);
          }}
        >
          <Flex flexDir="column" alignItems="center">
            {props.isTransportist && <Text>Descargar guia</Text>}
            <IconWrapper icon={DownloadIcon} size={17} />
          </Flex>
        </Button>
      </>
    );
  };

  return (
    <>
      <Overlay
        isOpen={open}
        actions={
          <Flex gap={2}>
            <Button
              size="xs"
              onClick={onClose}
              variant="outline"
              bgColor="white"
            >
              Cancelar
            </Button>
            <Button
              size="xs"
              bgColor="red"
              color="white"
              onClick={handleDelete}
              loading={isMutating}
            >
              Confirmar
            </Button>
          </Flex>
        }
      >
        <Flex
          //@ts-ignore
          flexDir="column"
          onClick={() => props.onSelect?.(props.media)}
          {...props.containerProps}
        >
          {props.media.mimeTye.includes('video') && (
            <VideoView media={props.media} videoStyle={props.videoStyle} />
          )}
          {!props.media.mimeTye.includes('image') &&
            !props.media.mimeTye.includes('video') &&
            getImageThumbnail(url) && (
              <img
                src={getImageThumbnail(url)}
                style={{ height: props.imageStyle?.height ?? '200px' }}
                alt=""
              />
          )}
          {props.media.mimeTye.includes('image') && (
            <ImageView
              media={props.media}
              height={props.imageStyle?.height}
              allowOnClick={props.allowClick}
            />
          )}
          <Flex
            alignItems="start"
            justifyContent="space-between"
            width="100%"
            height="40px"
          >
            <Box flex={1}>{renderDescription()}</Box>
            <Box>{renderActions()}</Box>
          </Flex>
        </Flex>
      </Overlay>
      {getImageThumbnail(url) && (
        <img
          src={getImageThumbnail(url)}
          style={{ display: 'none' }}
          onLoad={handleImageLoad}
          alt=""
        />
      )}
    </>
  );
};
