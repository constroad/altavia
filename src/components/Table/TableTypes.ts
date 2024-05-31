export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  bgColor?: string;
  textAlign?: 'start' | 'center' | 'end';
  render?: (item: any, row: any) => React.ReactNode; 
}

export interface TableData {
  [key: string]: string | number | any;
}
