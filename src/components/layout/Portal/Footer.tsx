import { Flex, Text } from "@chakra-ui/react";
import { APP_ROUTES } from "src/common/consts";
import { LocationIcon, MailIcon, RoadIcon, TruckIcon, WhatsAppIcon } from "src/common/icons";
import { FooterLink } from './FooterLink';
import { SiNintendogamecube } from "react-icons/si";
import { LuPaintbrush } from "react-icons/lu";
import { MdFactory } from "react-icons/md";
import { useRouter } from "next/router";
import { useScreenSize } from "src/common/hooks";

const Footer = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear();
  const router = useRouter()
  const { isMobile } = useScreenSize()
  return (
    <Flex
      as='footer'
      flexDir='column'
      justifyContent='space-between'
      width='100%'
      background='#3b3b3b'
      minHeight={router.pathname === '/' ? '650px' : '249px'}
    >
      {router.pathname === '/' && (
        <Flex
          width={{ base: '100%', md: '100%' }}
          justifyContent={{ base: 'center', md: 'center' }}
          marginTop={{ base: '20px', md: '5px' }}
          alignItems='center'
        >
          <iframe
            className='w-full'
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.784458000577!2d-76.87262702479192!3d-11.989411040835808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c300705538cf%3A0xdb0d06d91ffcf2a3!2sconstroad!5e0!3m2!1ses-419!2spe!4v1709245188866!5m2!1ses-419!2spe"
            width="600"
            height="400"
            loading="lazy"
          />
        </Flex>
      )}

      <Flex
        flexDir={{ base: 'column' ,md: 'column' }}
        width='100%'
        paddingTop='25px'
        px={{ base: '', md: '120px' }}
        color='white'
        justifyContent={{ base: 'center', md: 'space-between' }}
        alignItems={{ base: 'center' }}
        gap={{ base: '10px' }}
        backgroundImage='url(/img/proyects/estadisticas.png)'
        backgroundSize="cover"
        backgroundPosition='center'
        backgroundRepeat="no-repeat"
        pb='15px'
        position='relative'
      >
        <Flex bg='gray.800' w='100%' h='100%' opacity={0.8} zIndex={10} position='absolute' top='0' left='0'></Flex>

        <Flex flexDir={{ base: 'column', md: 'row' }} w='100%' justifyContent='space-around' pb='40px'>
          <Flex flexDir='column' width={{ base: '100%', md: '420px' }} paddingX={{ base: '30px', md: '0px' }} zIndex={20}>
            <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: 'auto', md: '0px' }} marginBottom='5px' className="font-logo" fontWeight={900} fontSize={{ base: 18, md: 20 }}>
              SERVICIOS
            </Text>
            <FooterLink
              href={APP_ROUTES.servicios + APP_ROUTES.mezclaAsfaltica}
              label="Mezcla asfáltica en caliente"
              icon={<SiNintendogamecube fontSize={ isMobile ? 20 : 22} />}
            />
            <FooterLink
              href={APP_ROUTES.servicios + APP_ROUTES.colocacionAsfaltica}
              label="Colocación de mezcla asfáltica"
              icon={<RoadIcon fontSize={ isMobile ? 20 : 22} />}
            />
            <FooterLink
              href={APP_ROUTES.servicios + APP_ROUTES.senalizacionVial}
              label="Señalización vial"
              icon={<LuPaintbrush fontSize={ isMobile ? 20 : 22} />}
            />
            <FooterLink
              href={APP_ROUTES.servicios + APP_ROUTES.alquilerPlanta}
              label="Alquiler de planta de asfalto"
              icon={<MdFactory fontSize={ isMobile ? 20 : 22} />}
            />
          </Flex>

          <Flex
            flexDir='column'
            width={{ base: '100%', md: '420px' }}
            paddingX={{ base: '30px', md: '0px' }}
            marginTop={{ base: '20px', md: '0px' }}
            zIndex={20}
          >
            <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: 'auto', md: '0px' }} className="font-logo" fontWeight={900} fontSize={{ base: 18, md: 20 }}>
              CONTÁCTANOS
            </Text>
            
            <Flex marginTop='10px' gap='8px' alignItems='top'>
              <LocationIcon fontSize={ isMobile ? 20 : 22} className="mt-[8px]"/>
              <Flex flexDir='column'>
                <Text width='100%' fontSize={{ base: 14, md: 16 }} fontWeight={600} className="font-logo">
                  Carapongo S/N Urbanización El Portillo
                </Text>
                <Text width='100%' fontSize={{ base: 14, md: 16 }} fontWeight={600} className="font-logo">
                  Lurigancho - Chosica - Lima
                </Text>
              </Flex>
            </Flex>

            <Flex marginTop='5px' gap={2} alignItems='center'>
              <MailIcon fontSize={ isMobile ? 20 : 22 } />
              <Text className='w-[100%] text-justify font-[600] font-logo' fontSize={{ base: 14, md: 16 }}>
                administracion@constroad.com
              </Text>
            </Flex>

            <FooterLink
              href='https://api.whatsapp.com/send?phone=51949376824'
              label="949 376 824"
              icon={<WhatsAppIcon fontSize={ isMobile ? 20 : 22 } />}
              target="_blank"
            />
          </Flex>
        </Flex>


        <Flex
          position='absolute'
          bottom={0}
          w='100%'
          color='white'
          justifyContent='center'
          paddingY='10px'
          borderTop='1px solid'
          borderColor='#feb100'
          fontSize={{ base: 14, md: 16 }}
          fontWeight={600}
          h='40px'
          zIndex={20}
          className="font-logo"
        >
          Constroad {currentYear}  -  Todos los derechos reservados.
        </Flex>
      </Flex>

    </Flex>
  )
}

export default Footer