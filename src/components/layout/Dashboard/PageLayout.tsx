'use client';

import { ArrowLeftIcon } from '@/common/icons';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';
import { Button, Flex, FlexProps, Text } from '@chakra-ui/react';

interface PageLayoutProps extends FlexProps {
  title: string;
  onBack?: () => void;
  header?: React.ReactNode;
}

export const PageLayout = (props: PageLayoutProps) => {
  const { title, header, ...rest } = props;
  return (
    <Flex flexDir="column" gap={1} {...rest}>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Text
          fontSize={{ base: 16, md: 25 }}
          fontWeight={700}
          lineHeight={{ base: '28px', md: '39px' }}
        >
          Trips
        </Text>
        <Flex gap={1}>
          <Button
            type="button"
            colorPalette="danger"
            variant="solid"
            size="xs"
            onClick={props.onBack}
            fontSize={{ base: 10, md: 14 }}
          >
            Atras
            <IconWrapper icon={ArrowLeftIcon} />
          </Button>
          {header}
        </Flex>
      </Flex>
      {props.children}
    </Flex>
  );
};
