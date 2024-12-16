export * from "./user";
export * from "./order";
export * from "./batch";

export type Column = {
  header: string;
  accessor: string;
  width?: string;
  sortField?: string;
};

export type BasePagingRequest = {
  page: number;
  pageSize: number;
};

export type BasePagingResponse<T> = {
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
};

export type Action = {
  title: any;
  className?: string;
  handler?: (item: any) => void;
};
