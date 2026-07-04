import { FilterPayload } from "@/lib/type/document-api"

export const DEFAULT_FILTER: FilterPayload = {
  page: "1",
  limit: "10",
  sort_column: "updated_at",
  sort_direction: "desc",
}
