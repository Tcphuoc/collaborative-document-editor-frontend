import { OptionType } from "@/lib/type/common-api";
import { API_BASE } from "../constant/common-api";

export async function callApi<T>(path: string, options?: OptionType): Promise<T> {
  const url = `${API_BASE}/${path}`;
  const res = await fetch(url, { ...options });
  
  if (!res.ok) {
    throw new Error(`Failed to call ${url}[${options?.method ?? 'GET'}]: ${res.status}`);
  }

  return await res.json();
}
