// pages/attendance.tsx
import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { IAttendanceValidationSchema } from 'src/models/attendance';
import { toast } from 'src/components';
import { Clock } from 'src/components/clock';
import { formatDate } from 'src/utils/general';
import { IEmployeeValidationSchema } from 'src/models/employee';

const DynamicMap = dynamic(() => import('src/components/map/Map'), {
  ssr: false,
  loading: () => <Spinner />,
});

const TELEGRAM_TOKEN = '7278967592:AAHLnzjx3L-uYl3a96JhvIWbQ-YpBtF1kz8';
const TELEGRAM_GROUP_ID_ATTENDANCE = '-1002154744862';

interface RegisterAttendanceProps {
  employee?: IEmployeeValidationSchema;
  onGoBack?: () => void
}
export const RegisterAttendance = (props: RegisterAttendanceProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //API
  const { mutate, isMutating } = useMutate<IAttendanceValidationSchema>(
    API_ROUTES.attendance
  );

  //Handlers
  // starting video stream
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      toast.error('Error accediendo a la camara');
    }
  };
  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setPhoto(canvasRef.current.toDataURL('image/png'));
      }
    }
  };
  const handleGeolocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          toast.info(`localizacion: ${lat}-${lng}`);
          setLocation({ latitude: lat, longitude: lng });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setLoading(false);
        }
      );
      return;
    }
    setLoading(false);
    toast.error('Geolocation is not supported by this browser.');
  };

  const handleSend = async () => {
    if (photo && location) {
      const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;
      const formData = new FormData();

      // Convert base64 to Blob
      const response = await fetch(photo);
      const blob = await response.blob();
      formData.append('photo', blob, 'photo.png');

      const message = `
      Asistencia registrada:
      - Hora: ${new Date().toLocaleString()}
      - Ubicación: https://maps.google.com/?q=${location.latitude},${
        location.longitude
      }
    `.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1'); // space special characters

      try {
        formData.append('chat_id', TELEGRAM_GROUP_ID_ATTENDANCE);
        formData.append('caption', message);
        formData.append('parse_mode', 'MarkdownV2');

        await fetch(url, {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.log('error', err);
      }
      return;
    }
    toast.warning('active su ubicacion y tomese la foto');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const date = new Date();
    mutate('POST', {
      employeeId: '',
      name: '',
      date: date.toISOString(),
      startTime,
      endTime,
      location,
    });
  };

  // Iniciar el video cuando el componente se monta
  useEffect(() => {
    startVideo();
    handleGeolocation();
  }, []);

  return (
    <>
      <Flex gap={2} flexDir="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={20}>Hola {props.employee?.name}!</Text>
          <Avatar
            fontWeight="bold"
            size="sm"
            name="Jose"            
          />
        </Flex>
        <Flex flexDir="column" lineHeight={1.2}>
          <Text fontSize={14} color="gray">
            {formatDate()}
          </Text>
          <Text fontWeight={600} fontSize={20}>
            Registro de asistencia
          </Text>
        </Flex>

        <Clock>
          <>
            {photo ? (
              <Flex alignItems="center" justifyContent="center" mt={2}>
                <img
                  src={photo}
                  alt="Foto"
                  style={{
                    width: '50%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </Flex>
            ) : (
              <>
                <div
                  style={{
                    // position: 'relative',
                    width: '150px',
                    height: '150px',
                    overflow: 'hidden',
                    borderRadius: '50%',
                    marginTop: '10px',
                  }}
                >
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            )}
          </>
        </Clock>        
        <Flex alignItems="center" justifyContent="space-between" gap={5}>
          <Button onClick={handleSend}>Registrar entrada</Button>
          <Button onClick={handleSend}>Registrar Salida</Button>
        </Flex>
      </Flex>

      {loading && <Spinner />}
      {location.latitude !== 0 && location.longitude !== 0 && (
        <DynamicMap
          latitude={location.latitude}
          longitude={location.longitude}
        />
        // <iframe
        //   className="w-full"
        //   src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.784458000577!2d${location.longitude}!3d${location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c300705538cf%3A0xdb0d06d91ffcf2a3!2sconstroad!5e0!3m2!1ses-419!2spe!4v1709245188866!5m2!1ses-419!2spe`}
        //   width="600"
        //   height="450"
        //   loading="lazy"
        // />
      )}
    </>
  );
};
