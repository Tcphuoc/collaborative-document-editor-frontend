export interface CommonResponse<T> {
  data: T;
  message?: string;
  status_code: number;
}

export interface OptionType {
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit;
}
