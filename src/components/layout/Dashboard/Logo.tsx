import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

interface LogoProps {
  isExpanded: boolean;
  isMobile?: boolean;
}

const LogoComponent = ({ isExpanded, isMobile }: LogoProps) => (
  <Flex gap="6px" alignItems="center" h="72px" cursor="pointer">
    <Image
      src="/img/logos/altavia.ico"
      alt="altavia-logo"
      width={25}
      height={25}
    />
    {isExpanded && !isMobile && (
      <Text fontWeight={600} fontSize={18} className="font-logo" mt="8px">
        Altavía Perú
      </Text>
    )}
  </Flex>
);

LogoComponent.displayName = 'Logo';

export const Logo = React.memo(LogoComponent);

export default Logo;
