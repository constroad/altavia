import { Button, Flex, Text } from '@chakra-ui/react';

interface AddDispatchProps {
  orderId?: string;
}

export const AddDispatch = (props: AddDispatchProps) => {
  if (!props.orderId) {
    return null;
  }
  return (
    <Flex width="100%">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        borderBottom="solid 1px #e2e8f0"
        // borderBottomColor="whitesmoke"
      >
        <Text
          fontSize={{ base: 15, md: 25 }}
          fontWeight={700}
          color="black"
          lineHeight={{ base: '28px', md: '39px' }}
        >
          Despachos
        </Text>
        <Button size="xs" isDisabled={!props.orderId} colorScheme="yellow">
          Iniciar despacho
        </Button>
      </Flex>
    </Flex>
  );
};
