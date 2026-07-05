export interface CommonResponse<T> {
  data: T;
  message?: string;
  status_code: number;
}

export interface PaginationData {
  current_page: number;
  previous_page: number;
  next_page: number;
  limit: number;
  total: number;
}

export interface OptionType {
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit;
}
