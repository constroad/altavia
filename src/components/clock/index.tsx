// components/Clock.tsx
import { Box, Flex } from '@chakra-ui/react';
import React, { PropsWithChildren, useEffect, useState } from 'react';

type ClockProps = PropsWithChildren & {
  width?: number | string;
  height?: number | string;
};
export const Clock = (props: ClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      // bgColor="#f0f0f0"
    >
      <Flex
        position="relative"
        width={props.width ?? '300px'}
        height={props.height ?? '300px'}
        border="7px solid #ffcc00"
        rounded="50%"
        bgColor="#fff"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          // bgColor="#fff"
          // p="20px"
          // rounded="10px"
          // boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        >
          <Flex flexDir="column" justifyContent="center" alignItems="center"   width="100%">
            <Box fontSize="3em" color="#ffcc00">
              {hours}:{minutes}:{seconds}
            </Box>
            <Box mt="2px" fontSize="1em" color="#666">
              <span>GMT</span>
            </Box>
          </Flex>
          {props.children}
        </Flex>
      </Flex>
    </Flex>
  );
};
