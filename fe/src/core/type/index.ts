export * from "./user";

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
