import { TableCellProps } from "@chakra-ui/react";

export interface TableColumn<T = any> {
  key: string;
  label: string | React.ReactNode;
  width?: string;
  bgColor?: string;
  color?: string;
  textAlign?: 'start' | 'center' | 'end';
  tdStyles?: TableCellProps;
  summary?: (value: number, data: T[]) =>  React.ReactNode;
  render?: (item: any, row: T) => React.ReactNode; 
}

export interface TableData {
  [key: string]: string | number | any,
}