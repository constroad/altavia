import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { CONSTROAD_COLORS } from 'src/styles/shared'
import { NextIcon, PrevIcon } from 'src/common/icons';

interface PaginationProps {
  currentPage: number;
  paginate: (page: number) => void;
  itemsPerPage: number
  data: any[]
  totalPages: number
}

export const Pagination = (props: PaginationProps) => {
  const { currentPage, paginate, itemsPerPage, data, totalPages } = props;
  
  const disabledPrevButton = currentPage === 1;
  const bgPrevButton = disabledPrevButton ? 'gray.100' : CONSTROAD_COLORS.lightGray;
  const hoverBgPrevButton = disabledPrevButton ? '' : CONSTROAD_COLORS.darkGray;
  const hoverColorPrevButton = disabledPrevButton ? '' : 'white';

  const disabledNextButton = (currentPage >= Math.ceil(data.length / itemsPerPage)) || totalPages <= 1;
  const bgNextButton = disabledNextButton ? 'gray.100' : CONSTROAD_COLORS.lightGray;
  const hoverBgNextButton = disabledNextButton ? '' : CONSTROAD_COLORS.darkGray;
  const hoverColorNextButton = disabledNextButton ? '' : 'white'

  const handlePrevClick = () => {
    if (!disabledPrevButton) {
      paginate(currentPage - 1)
    }
  }
  const handleNextClick = () => {
    if (!disabledNextButton) {
      paginate(currentPage + 1)
    }
  }

  return (
    <Flex justifyContent="start" py='10px' gap='8px' alignItems='center' px='6px' borderTop='0.5px solid' borderColor={CONSTROAD_COLORS.darkGray}>
      <Flex
        w='20px'
        h='20px'
        justifyContent='center'
        alignItems='center'
        bg={ bgPrevButton }
        _hover={{
          background: hoverBgPrevButton,
          color: hoverColorPrevButton,
        }}
        color={ disabledPrevButton ? 'gray.400' : '' }
        rounded='full'
        cursor={ disabledPrevButton ? 'not-allowed' : 'pointer' }
        onClick={ handlePrevClick }
      >
        <PrevIcon />
      </Flex>
      
      <Flex
        justifyContent='center'
        alignItems='center'
        width='40px'
        rounded='4px'
        border='1px solid'
        borderColor={CONSTROAD_COLORS.lightGray}
        fontSize={{ base: 10, md: 12 }}
        h='20px'
      >
        {currentPage}
      </Flex>

      <Flex
        w='20px'
        h='20px'
        justifyContent='center'
        alignItems='center'
        color={ disabledNextButton ? 'gray.400' : '' }
        bg={ bgNextButton }
        _hover={{
          background: hoverBgNextButton,
          color: hoverColorNextButton,
        }}
        rounded='full'
        cursor={ disabledNextButton ? 'not-allowed' : 'pointer' }
        onClick={ handleNextClick }
      >
        <NextIcon />
      </Flex>

      <Text fontSize={{ base: 10, md: 12 }} ml={{ base: '5px', md: '10px' }}>Página {currentPage} de {totalPages}</Text>
    </Flex>
  )
}
