import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { APP_ROUTES } from "src/common/consts";
import { LocationIcon, MailIcon, RoadIcon, WhatsAppIcon } from "src/common/icons";
import { FooterLink } from './FooterLink';
import { SiNintendogamecube } from "react-icons/si";
import { LuPaintbrush } from "react-icons/lu";
import { MdFactory } from "react-icons/md";
import { usePathname, useRouter } from 'next/navigation'
import { useScreenSize } from "src/common/hooks";
import { SiFacebook } from "react-icons/si";
import { AiFillInstagram } from "react-icons/ai";
import { HiHome } from "react-icons/hi2";
import { FaPeopleGroup } from "react-icons/fa6";
import { BsMailbox2 } from "react-icons/bs";
import { TbLogin2 } from "react-icons/tb";
import { CustomIconButton } from "src/components/CustomIconButton";

const Footer = () => {
  const { isMobile } = useScreenSize()
  const router = useRouter()
  const path = usePathname() as string
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear();

  const openNewPage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Flex
      as='footer'
      flexDir='column'
      justifyContent='space-between'
      width='100%'
      background='#3b3b3b'
      minHeight={path === '/' ? '650px' : '249px'}
    >
      {path === '/' && (
        <Flex
          width={{ base: '100%', md: '100%' }}
          justifyContent={{ base: 'center', md: 'center' }}
          marginTop={{ base: '5px', md: '5px' }}
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

        <Flex flexDir={{ base: 'column', md: 'row' }} w='100%' justifyContent={{ base: 'start', md: 'space-between' }} pb='40px' h={{ base: 'calc(100vh - 105px)', md: '263px' }}>
          <Flex flexDir='column' width={{ base: '100%', md: 'fit-content' }} paddingX={{ base: '30px', md: '0px' }} zIndex={20}>
            <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: '0px', md: '0px' }} marginBottom='5px' className="font-logo" fontWeight={900} fontSize={{ base: 18, md: 20 }}>
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

          <Flex flexDir='column' width={{ base: '100%', md: 'fit-content' }} paddingX={{ base: '30px', md: '0px' }} zIndex={20} marginTop={{ base: '30px', md: '0px' }}>
            <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: '0px', md: '0px' }} marginBottom='0px' className="font-logo" fontWeight={900} fontSize={{ base: 18, md: 20 }}>
              MENÚ
            </Text>
            <FooterLink
              href={APP_ROUTES.home}
              label="Inicio"
              icon={<HiHome fontSize={ isMobile ? 20 : 22} />}
            />
            <FooterLink
              href={APP_ROUTES.nosotros}
              label="Nosotros"
              icon={<FaPeopleGroup fontSize={ isMobile ? 20 : 22} />}
            />
            <FooterLink
              href={APP_ROUTES.contactanos}
              label="Contáctanos"
              icon={<BsMailbox2 fontSize={ isMobile ? 20 : 22} />}
            />
            <FooterLink
              href={APP_ROUTES.login}
              label="Iniciar sesión"
              icon={<TbLogin2 fontSize={ isMobile ? 20 : 22} />}
            />
          </Flex>

          <Flex
            flexDir='column'
            width={{ base: '100%', md: 'fit-content' }}
            paddingX={{ base: '30px', md: '0px' }}
            marginTop={{ base: '20px', md: '0px' }}
            zIndex={20}
          >
            <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: '0px', md: '0px' }} className="font-logo" fontWeight={900} fontSize={{ base: 18, md: 20 }}>
              CONTÁCTANOS
            </Text>
            
            <Flex marginTop='10px' gap='8px' alignItems='top'>
              <LocationIcon fontSize={ isMobile ? 20 : 22} className="mt-[8px]"/>
              <Flex flexDir='column'>
                <Text width='100%' fontSize={{ base: 14, md: 16 }} fontWeight={600} className="font-logo">
                  Carapongo S/N Urb. El Portillo
                </Text>
                <Text width='100%' fontSize={{ base: 14, md: 16 }} fontWeight={600} className="font-logo">
                  Lurigancho - Chosica - Lima
                </Text>
              </Flex>
            </Flex>

            <Flex marginTop='5px' gap={2} alignItems='center'>
              <MailIcon fontSize={ isMobile ? 20 : 22 } />
              <Text
                w="100%"
                textAlign="justify"
                fontWeight={600}
                fontFamily="logo"
                fontSize={{ base: "14px", md: "16px" }}
              >
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
          w='100%'
          gap={{ base: '5px', md: '15px' }}
          left='0px'
          zIndex={30}
          h='30px'
          position='absolute'
          bottom={{ base: '50px', md: '45px' }}
          justifyContent='start'
          alignItems='center'
          px={{ base: '20px', md: '112px' }}
        >
          <CustomIconButton
            icon={<SiFacebook fontSize={isMobile ? 20 : 24} />}
            aria-label="Ir a nuestra página de Facebook"
            onClick={() => openNewPage('https://facebook.com/constroad/')}
            variant="plain"
            size="sm"
          />

          <CustomIconButton
            icon={<AiFillInstagram fontSize={isMobile ? 26 : 30} color="#1A202C" />}
            aria-label="Ir a nuestra página de Instagram"
            onClick={() => openNewPage('https://instagram.com/asfaltoconstroad/')}
            variant="plain"
            size="sm" // o "md", dependiendo de lo que configuraste en tu sizeMap
          />

          <CustomIconButton
            icon={<WhatsAppIcon fontSize={isMobile ? 22 : 26} color="gray.900" />}
            aria-label="Ir a nuestra página de WhatsApp"
            onClick={() => openNewPage('https://api.whatsapp.com/send?phone=51949376824')}
            variant="plain"
            size="sm" // o "md", dependiendo de lo que hayas mapeado en `sizeMap`
          />

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