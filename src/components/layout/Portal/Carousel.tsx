import { Box, Link, Text } from "@chakra-ui/react";
import Slider from "react-slick";

import { APP_ROUTES } from "src/common/consts";
import { useScreenSize } from "src/common/hooks";
import { CalculatorIcon, NextIcon, PrevIcon } from "src/common/icons";

import { carouselImages } from './config';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        fontSize: 36,
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
        fontSize: 36,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <PrevIcon className='transition-opacity duration-500 ease-in-out hover:opacity-[1]' color='white' opacity={0.70} fontSize={60} />
    </Box>
  );
}

export const CarouselComponent = () => {
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

  return (
    <div className='w-full bg-black relative' style={{ height: isMobile ? '135px' : 'calc(100vh - 90px)' }}>
      <Box className="font-logo" position='absolute' color='white' top='30px' right='60px' zIndex={200} fontSize={32} fontWeight={800} display={isDesktop ? 'block' : 'none'}>
        ConstRoad
      </Box>

      <Slider {...settings}>
        {carouselImages.map((img, idx) => (
          <div key={idx} className='w-full flex justify-center' style={{ height: isMobile ? '135px' : 'calc(100vh - 90px)' }}>
            <div
              className='w-full bg-cover bg-center'
              style={{ backgroundImage: img.url, height: isMobile ? '135px' : 'calc(100vh - 90px)' }}
            />
          </div>
        ))} 
      </Slider>

      <Link
        className="font-logo"
        href={APP_ROUTES.contactanos}
        position='absolute'
        left={{ base: '10px', md: '70px'}}
        bottom={{ base: '-20px', md: '40px'}}
        bg='#feb100'
        width={{ base: '230px', md: '350px'}}
        fontSize={{ base: 16, md: 22}}
        lineHeight='26px'
        fontWeight={600}
        height={{ base: '45px', md: '64px'}}
        rounded='6px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        _hover={{
          textDecoration: 'none',
          bg: '#DF9E08'
        }}
        gap={2}
      >
        <CalculatorIcon />
        <Text height='17px' alignSelf='center'>SOLICITA UNA COTIZACIÓN!</Text>
      </Link>
      {/* <Box className="triangle" position='absolute' bottom={{ base: '-20px', md: '-28px' }} right={{ base: '240px', md: '445px'}} /> */}
    </div>
  )
}
