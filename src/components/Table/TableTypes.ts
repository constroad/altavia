import { FlexProps, TableCellProps } from "@chakra-ui/react";

export type SortColumnStatus = 'none' | 'descending' | 'ascending';

export interface TableColumn<T = any> {
  key: string;
  label: string | ((data: T[]) => React.ReactNode);
  width?: string;
  bgColor?: string;
  color?: string;
  textAlign?: 'start' | 'center' | 'end';
  thStyles?: FlexProps,
  tdStyles?: TableCellProps;
  summary?: (value: number, data: T[]) =>  React.ReactNode;
  render?: (item: any, row: T) => React.ReactNode; 
  sorter?: (status: SortColumnStatus, a: any, b: any) => any;
}

export interface TableData {
  [key: string]: string | number | any,
}