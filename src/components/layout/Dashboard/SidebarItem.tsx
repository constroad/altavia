import { Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

interface SidebarItemProps {
  opt: {
    name: string;
    path: string;
    icon: any; // Puedes cambiar a `IconType` de react-icons si quieres tipar mejor
  };
  pathname: string;
  isExpanded: boolean;
  isMobile?: boolean;
}

const SidebarItemComponent = ({
  opt,
  pathname,
  isExpanded,
  isMobile,
}: SidebarItemProps) => (
  <Link href={opt.path ?? "#"} passHref>
    <Flex
      alignItems="center"
      cursor="pointer"
      _hover={{ bg: "primary.400" }}
      bg={pathname.includes(opt.path) ? "primary.400" : ""}
      p={4}
      h="40px"
      maxH="56px"
    >
      <Icon
        as={opt.icon}
        mr={2}
        w={{ base: "18px", md: "22px" }}
        h={{ base: "18px", md: "22px" }}
      />
      {!isMobile && (
        <Text fontWeight={500} fontSize={16}>
          {isExpanded ? opt.name : ""}
        </Text>
      )}
    </Flex>
  </Link>
);

SidebarItemComponent.displayName = "SidebarItem";

export const SidebarItem = React.memo(SidebarItemComponent);
