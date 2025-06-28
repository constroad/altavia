import { CSSProperties, useEffect, useState } from 'react';
import { useTelegram } from 'src/common/hooks/useTelegram';
import { IMediaValidationSchema } from 'src/models/media';
import { VideoOverlay } from '../Overlay';
import { Modal } from '../modal';

interface VideoViewProps {
  media: IMediaValidationSchema;
  videoStyle?: CSSProperties;
}

export const VideoView = (props: VideoViewProps) => {
  const { media, ...rest } = props;
  const [url, setUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Para el modal
  const { fileId, thumbnailFileId } = media.metadata;

  const { getFileUrl, isLoading: isGettingUrl } = useTelegram({
    chat_id: '',
  });

  useEffect(() => {
    if (fileId) {
      getFileUrl(fileId).then((urlImage) => {
        setUrl(urlImage ?? '');
      });
    }
  }, [fileId]);

  return (
    <>
      <VideoOverlay show={!isModalOpen} onClick={() => setIsModalOpen(true)}>
        <video
          src={url}
          muted
          controls
          height={'auto'}
          style={{
            width: '100%',
            ...props.videoStyle,
            height: props.videoStyle?.height,
          }}
        />
      </VideoOverlay>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <video src={url} muted controls style={{ width: '100%' }} />
      </Modal>
    </>
  );
};
