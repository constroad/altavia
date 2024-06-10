export interface TableColumn<T = any> {
  key: string;
  label: string;
  width?: string;
  bgColor?: string;
  textAlign?: 'start' | 'center' | 'end';
  render?: (item: any, row: T) => React.ReactNode; 
}

export interface TableData {
  [key: string]: string | number | any;
}
