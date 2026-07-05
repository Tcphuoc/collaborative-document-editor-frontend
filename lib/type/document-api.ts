import { CommonResponse, PaginationData } from "./common-api";

export type FilterPayload = {
  search?: string;
  page?: string;
  limit?: string;
  sort_column?: string;
  sort_direction?: string;
}

export interface PatchDocumentPayload {
  title?: string;
  content?: string;
}

export type ListDocumentsResponse = CommonResponse<{
  documents: Document[],
  pagination_data: PaginationData,
}>;

export type CreateDocumentResponse = CommonResponse<Document>;

export interface Document {
  id: string;
  title: string;
  content: string;
  created_user: {
    id: number,
    full_name: string;
  };
  created_at: string;
  updated_at: string;
}
