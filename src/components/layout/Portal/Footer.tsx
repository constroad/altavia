import { Flex, Text } from "@chakra-ui/react";

import { IoMdMail, IoLogoWhatsapp } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { FaRoad, FaTruck } from "react-icons/fa";
import { FooterLink } from './FooterLink';

import { APP_ROUTES } from "src/common/consts";

const Footer = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear();
  return (
    <Flex
      as='footer'
      flexDir='column'
      justifyContent='space-between'
      width='100%'
      background='#3b3b3b'
      minHeight='210px'
    >
      <Flex
        flexDir={{ base: 'column' ,md: 'row' }}
        width={{ base: '100%', md: '90%' }}
        marginX='auto'
        paddingTop='25px'
        color='white'
        justifyContent={{ base: 'center', md: 'space-between' }}
        alignItems={{ base: 'center' }}
        gap={{ base: '10px' }}
      >
        <Flex flexDir='column' width={{ base: '100%', md: '420px' }} paddingX={{ base: '30px', md: '0px' }}>
          <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: 'auto', md: '0px' }} marginBottom='5px' >
            SERVICIOS
          </Text>
          <FooterLink
            href={APP_ROUTES.servicios + APP_ROUTES.mezclaAsfaltica}
            label="Mezcla asfáltica en caliente"
            icon={<FaRoad />}
          />
          <FooterLink
            href={APP_ROUTES.servicios + APP_ROUTES.colocacionAsfaltica}
            label="Colocación de mezcla asfáltica"
            icon={<FaRoad />}
          />
          <FooterLink
            href={APP_ROUTES.servicios + APP_ROUTES.transporte}
            label="Transporte de carga"
            icon={<FaTruck />}
          />
        </Flex>

        <Flex
          flexDir='column'
          width={{ base: '100%', md: '420px' }}
          paddingX={{ base: '30px', md: '0px' }}
          marginTop={{ base: '20px', md: '0px' }}
        >
          <Text borderBottom='2px solid #feb100' width='min-content' marginX={{ base: 'auto', md: '0px' }} >
            CONTÁCTANOS
          </Text>
          
          <Flex marginTop='10px' gap='8px' alignItems='center'>
            <MdLocationOn className='!w-[16px] !h-[16px]' />
            <Text width='100%' textAlign='justify' fontSize={14} fontWeight={300}>
              Planta Carapongo - Ate, Lima
            </Text>
          </Flex>

          <Flex marginTop='5px' gap={2} alignItems='center'>
            <IoMdMail />
            <Text className='w-[100%] text-justify text-[14px] font-[300]'>
              administracion@constroad.com
            </Text>
          </Flex>

          <FooterLink
            href='https://api.whatsapp.com/send?phone=51949376824'
            label="949 376 824"
            icon={<IoLogoWhatsapp />}
            target="_blank"
          />

        </Flex>
      </Flex>

      <Flex color='white' justifyContent='center' paddingY='10px' borderTop='0.5px solid' borderColor='#feb100' fontSize={14} marginTop='15px' background='#292929'>
        Constroad {currentYear}  -  Todos los derechos reservados.
      </Flex>
    </Flex>
  )
}

export default Footer