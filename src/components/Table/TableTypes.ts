export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

export interface TableData {
  [key: string]: string | number;
}
