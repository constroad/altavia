import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import Slider from "react-slick";

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
        top: '15%',
        right: isMobile ? '-25px' : '-70px',
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
      <NextIcon className='transition-opacity duration-500 ease-in-out hover:opacity-[1]' color='black' opacity={0.70} fontSize={60} />
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
        top: '15%',
        left: isMobile ? '-25px' : '-70px',
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
      <PrevIcon className='transition-opacity duration-500 ease-in-out hover:opacity-[1]' color='black' opacity={0.70} fontSize={60} />
    </Box>
  );
}

export const MiniCarousel = (props: CarouselProps) => {
  const { isMobile, isDesktop } = useScreenSize()

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    // dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1500,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow isMobile={isMobile} />,
    prevArrow: <SamplePrevArrow isMobile={isMobile} />,
  }

  return (
    <div className='w-full relative justify-center' style={{ height: isMobile ? '90px' : '150px' }}>
      <Slider {...settings}>
        {props.images.map((img, idx) => (
          <Flex key={idx} w='100%' justifyContent='center' alignItems='center'  style={{ height: isMobile ? '150px' : '150px' }} overflow='hidden' textAlign='center'>
            <Flex w='100%' mx='auto'>
              <Image alt={img.label} src={img.url} width='60%' height={{ base: '60px', md: '120px' }} />
            </Flex>
          </Flex>
        ))} 
      </Slider>
    </div>
  )
}
