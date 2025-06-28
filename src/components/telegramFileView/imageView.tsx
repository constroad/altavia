import {
  Box,
  Button,
  Flex,  
  Spinner,
  Text,
} from '@chakra-ui/react';
import { IMediaValidationSchema, MediaType } from 'src/models/media';
import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import { useTelegram } from 'src/common/hooks/useTelegram';
import {
  MagnifyingGlassMinusLightIcon,
  MagnifyingGlassPlusLightIcon,
  RefreshIcon,
} from 'src/common/icons';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { Modal } from 'src/components';

interface ImageViewProps extends ImgHTMLAttributes<HTMLImageElement> {
  allowOnClick?: boolean;
  media: IMediaValidationSchema;
  timeout?: number; // Tiempo máximo para cargar la imagen (en ms)
}

export const ImageView = (props: ImageViewProps) => {
  const { media, timeout = 5000, allowOnClick = true, ...rest } = props;
  const [urlThumbnail, setUrlThumbnail] = useState('');
  const [url, setUrl] = useState('');

  const [isVisible, setIsVisible] = useState(false); // Para lazy loading
  const [isLoading, setIsLoading] = useState(true); // Para el indicador de carga
  const [isLoadingOriginal, setIsLoadingOriginal] = useState(true); // Para el indicador de carga
  const [isModalOpen, setIsModalOpen] = useState(false); // Para el modal
  const [hasError, setHasError] = useState(false); // Indica si ocurrió un error
  const imgRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1); // Nivel de zoom
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posición de la imagen
  const [isDragging, setIsDragging] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const { type } = media;
  const { fileId, thumbnailFileId } = media.metadata;

  const { getFileUrl } = useTelegram({
    chat_id: '',
  });

  useEffect(() => {
    if (fileId) {
      getFileUrl(fileId).then((urlImage) => {
        setUrl(urlImage ?? '');
      });
    }
  }, [fileId]);
  useEffect(() => {
    if (thumbnailFileId) {
      getFileUrl(thumbnailFileId).then((urlImage) => {
        setUrlThumbnail(urlImage ?? '');
      });
    }
  }, [thumbnailFileId]);

  // useEffect(() => {
  //   if (isVisible && isLoading) {
  //     const timer = setTimeout(() => {
  //       setIsLoading(false);
  //       setHasError(true);
  //     }, timeout);

  //     return () => clearTimeout(timer); // Limpieza para evitar efectos secundarios
  //   }
  // }, [isVisible, isLoading, timeout]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getImageThumbnail = (fileUrl: string) => {
    const mediaType = type as MediaType;

    if (mediaType === 'GUIA') {
      return '/img/placeholders/guia.png';
    }

    if (mediaType === 'INVOICE') {
      return '/img/placeholders/invoice.png';
    }
    return fileUrl;
  };

  const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3)); // Máximo zoom x3
  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 1)); // Mínimo zoom x1

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      lastPosition.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const x = e.clientX - lastPosition.current.x;
      const y = e.clientY - lastPosition.current.y;
      setPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Box position="relative" ref={imgRef} w="100%" h="auto">
        {isLoading && (
          <Box bgColor="gray" zIndex="1" h={rest.height}>
            <Spinner size="sm" />
          </Box>
        )}
        {hasError && !isLoading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h={rest.height}
            bg="gray.100"
            cursor="pointer"
            onClick={() => {
              setHasError(false);
              setIsVisible(true);
            }}
          >
            <Text color="gray.500">Imagen no disponible</Text>
            <Button>
              <IconWrapper icon={RefreshIcon} />
            </Button>
          </Box>
        )}
        {!hasError && isVisible && (
          <img
            src={urlThumbnail}
            alt={''}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover', // Ajusta la imagen al contenedor sin distorsión
              objectPosition: 'center', // Centra la imagen
              display: isLoading ? 'none' : 'block',
              cursor: 'pointer',
              ...rest,
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            onClick={() => {
              if (allowOnClick) {
                setIsLoadingOriginal(true);
                setIsModalOpen(true);
              }
            }}
          />
        )}
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoadingOriginal && (
          <Box h={rest.height}>
            <Spinner size="sm" />
          </Box>
        )}

        <Box
          position="relative"
          overflow="hidden"
          cursor={zoom > 1 ? 'grab' : 'default'}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.3s',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <img
            src={url}
            alt={''}
            style={{
              width: '100%',
              pointerEvents: zoom > 1 ? 'none' : 'auto',
              // transform: `scale(${zoom})`,
              // transition: 'transform 0.3s',
              display: isLoadingOriginal ? 'none' : 'block',
            }}
            onLoad={() => setIsLoadingOriginal(false)}
          />
        </Box>

        <Flex position="absolute" bottom="10px" right="10px" gap="4">
          <Button onClick={handleZoomOut} disabled={zoom <= 1}>
            <IconWrapper icon={MagnifyingGlassMinusLightIcon} />
          </Button>
          <Button onClick={handleZoomIn} disabled={zoom >= 3}>
            <IconWrapper icon={MagnifyingGlassPlusLightIcon} />
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
