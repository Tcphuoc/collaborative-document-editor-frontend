import { DEFAULT_FILTER } from "@/lib/constant/document-api";
import {
  PatchDocumentPayload,
  FilterPayload,
  ListDocumentsResponse,
  CreateDocumentResponse,
} from "@/lib/type/document-api";
import { callApi } from "./common";

export async function getListDocuments(filterPayload: FilterPayload = DEFAULT_FILTER): Promise<ListDocumentsResponse> {
  const params = new URLSearchParams(filterPayload);

  return await callApi<ListDocumentsResponse>(`documents?${params}`);
}

export async function createDocument(): Promise<CreateDocumentResponse> {
  return await callApi<CreateDocumentResponse>(`documents/new`, { method: 'POST' });
}

export async function patchDocument(id: string, payload: PatchDocumentPayload): Promise<void> {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  await callApi(`documents/${id}`, options);
}

export async function deleteDocument(id: string): Promise<void> {
  await callApi(`documents/${id}`, { method: 'DELETE' });
}
