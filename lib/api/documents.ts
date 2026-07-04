import { DEFAULT_FILTER } from "@/lib/constant/document-api";
import {
  PatchDocumentPayload,
  FilterPayload,
  ListDocumentsResponse,
} from "@/lib/type/document-api";
import { callApi } from "./common";

export async function getListDocuments(filterPayload: FilterPayload = DEFAULT_FILTER): Promise<ListDocumentsResponse> {
  const params = new URLSearchParams(filterPayload);

  return await callApi<ListDocumentsResponse>(`documents?${params}`);
}

export async function patchDocument(id: string, payload: PatchDocumentPayload): Promise<void> {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  await callApi(`documents/${id}`, options);
}
