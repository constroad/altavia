import Slider from "react-slick";
import { Box, Flex, Link, Text } from "@chakra-ui/react";

import { APP_ROUTES } from "src/common/consts";
import { useScreenSize } from "src/common/hooks";
import { CalculatorIcon, NextIcon, PrevIcon } from "src/common/icons";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselProps {
  images: any[]
}

function SampleNextArrow(props: any) {
  const { onClick, isMobile } = props;
  return (
    <Box
      style={{
        display: 'flex',
        position: 'absolute',
        top: '32%',
        right: 5,
        zIndex: 200,
        height: isMobile ? '30px' : '110px',
        width: isMobile ? '30px' : '55px',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        borderTopLeftRadius: '6px',
        borderBottomLeftRadius: '6px',
        fontSize: 60,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <NextIcon className='transition-opacity duration-500 ease-in-out hover:opacity-[1]' color='white' opacity={0.70} fontSize={60} />
    </Box>
  );
}

function SamplePrevArrow(props: any) {
  const { onClick, isMobile } = props;
  return (
    <Box
      style={{
        display: 'flex',
        position: 'absolute',
        top: '32%',
        left: 5,
        zIndex: 200,
        height: isMobile ? '30px' : '110px',
        width: isMobile ? '30px' : '55px',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        borderTopRightRadius: '6px',
        borderBottomRightRadius: '6px',
        fontSize: 60,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <PrevIcon className='transition-opacity duration-500 ease-in-out hover:opacity-[1]' color='white' opacity={0.70} fontSize={60} />
    </Box>
  );
}

export const CarouselComponent = (props: CarouselProps) => {
  const { isMobile, isDesktop } = useScreenSize()

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1500,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow isMobile={isMobile} />,
    prevArrow: <SamplePrevArrow isMobile={isMobile} />,
  }

  const carouselHeight = '500px';

  const TypedSlider = Slider as unknown as React.ComponentType<any>;

  return (
    <Box
      w="full"
      bg="black"
      position="relative"
      height={isMobile ? carouselHeight : 'calc(100vh - 90px)'}
    >
      <Box
        className="font-logo"
        position='absolute'
        color='white'
        top='40px'
        left='120px'
        zIndex={200}
        fontSize={50}
        fontWeight={800}
        display={isDesktop ? 'block' : 'none'}
      >
        TRANSPORTE DE CARGA 
      </Box>
      <Box
        className="font-logo"
        position='absolute'
        color='white'
        top='90px'
        left='120px'
        zIndex={200}
        fontSize={50}
        fontWeight={800}
        display={isDesktop ? 'block' : 'none'}
      >
        SEGURO Y CONFIABLE
      </Box>

      <TypedSlider {...settings}>
        {props.images.map((img, idx) => (
          <Flex
            key={idx}
            w="full"
            justify="center"
            height={isMobile ? carouselHeight : 'calc(100vh - 90px)'}
          >
            <Box
              width="100%"
              style={{
                backgroundImage: img.url,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: isMobile ? carouselHeight : 'calc(100vh - 90px)',
              }}
            />
          </Flex>
        ))} 
      </TypedSlider>

      <Link
        className="font-logo"
        href={APP_ROUTES.contactanos}
        position='absolute'
        left={{ base: '30px', md: '120px'}}
        bottom={{ base: '-20px', md: '40px'}}
        bg='primary'
        width={{ base: '210px', md: '350px'}}
        fontSize={{ base: 14, md: 22}}
        lineHeight='26px'
        fontWeight={600}
        height={{ base: '40px', md: '64px'}}
        rounded='6px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        _hover={{
          textDecoration: 'none',
          bg: 'primary.400'
        }}
        gap={2}
      >
        <CalculatorIcon color='white' />
        <Text height={{ base: '20px', md: '18px' }} alignSelf='center' color='white'>SOLICITA UNA COTIZACIÓN!</Text>
      </Link>
      {/* <Box className="triangle" position='absolute' bottom={{ base: '-20px', md: '-28px' }} right={{ base: '240px', md: '445px'}} /> */}
    </Box>
  )
}
