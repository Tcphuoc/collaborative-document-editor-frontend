"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Plus, Trash2 } from "lucide-react";

import { createDocument, deleteDocument, getListDocuments } from "@/lib/api/documents";
import { LIMIT_OPTIONS } from "@/lib/constant/document-api";
import { Document, FilterPayload } from "@/lib/type/document-api";
import { PaginationData } from "@/lib/type/common-api";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

type SortColumn = "title" | "created_user" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

const SORTABLE_COLUMNS: { key: SortColumn; labelKey: string }[] = [
  { key: "title", labelKey: "columns.title" },
  { key: "created_user", labelKey: "columns.owner" },
  { key: "created_at", labelKey: "columns.createdAt" },
  { key: "updated_at", labelKey: "columns.updatedAt" },
];

export function ListDocuments() {
  const t = useTranslations("Documents");
  const locale = useLocale();
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_OPTIONS[0]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }),
    [locale]
  );

  const fetchDocuments = useCallback(async (filter: FilterPayload) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await getListDocuments(filter);
      setDocuments(response.data.documents);
      setPagination(response.data.pagination_data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments({
      search,
      sort_column: sortColumn,
      sort_direction: sortDirection,
      page: String(page),
      limit: String(limit),
    });
  }, [fetchDocuments, search, sortColumn, sortDirection, page, limit]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const response = await createDocument();
      router.push(`/documents/${response.data.id}/edit`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((document) => document.id !== id));
    setDeletingId(null);
  };

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 1000);
  };

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / limit)) : 1;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("pageTitle")}</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" onClick={handleCreate} disabled={isCreating}>
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("createNew")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="w-80">
        <Field>
          <FieldLabel className="font-bold">{t("search")}</FieldLabel>
          <Input onChange={handleSearch} />
        </Field>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {!isLoading && isError && <p className="text-sm text-destructive">{t("error")}</p>}
      {!isLoading && !isError && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      )}

      {!isLoading && !isError && documents.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {SORTABLE_COLUMNS.map((column) => (
                <TableHead key={column.key}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2.5 has-data-[icon=inline-end]:pr-1.5"
                    onClick={() => handleSort(column.key)}
                  >
                    {t(column.labelKey)}
                    {sortColumn === column.key ? (
                      sortDirection === "asc" ? (
                        <ArrowUp data-icon="inline-end" />
                      ) : (
                        <ArrowDown data-icon="inline-end" />
                      )
                    ) : (
                      <ArrowUpDown data-icon="inline-end" className="text-muted-foreground" />
                    )}
                  </Button>
                </TableHead>
              ))}
              <TableHead className="text-right">{t("columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.title}</TableCell>
                <TableCell>{document.created_user.full_name}</TableCell>
                <TableCell>{dateFormatter.format(new Date(document.created_at))}</TableCell>
                <TableCell>{dateFormatter.format(new Date(document.updated_at))}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/documents/${document.id}/edit`)}
                    >
                      <Pencil />
                      {t("actions.edit")}
                    </Button>
                    <AlertDialog
                      open={deletingId === document.id}
                      onOpenChange={(open) => setDeletingId(open ? document.id : null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 />
                          {t("actions.delete")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteDialog.description", { title: document.title })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDelete(document.id)}
                          >
                            {t("deleteDialog.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && !isError && documents.length > 0 && pagination && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          limit={limit}
          limitOptions={LIMIT_OPTIONS}
          onLimitChange={handleLimitChange}
          rowsPerPageLabel={t("pagination.rowsPerPage")}
          pageInfoLabel={t("pagination.pageInfo", { page, totalPages })}
          previousLabel={t("pagination.previous")}
          nextLabel={t("pagination.next")}
        />
      )}
    </div>
  );
}
