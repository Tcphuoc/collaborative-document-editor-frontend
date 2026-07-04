"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { createDocument, deleteDocument, getListDocuments } from "@/lib/api/documents";
import { Document } from "@/lib/type/document-api";
import { Button } from "@/components/ui/button";
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

export function ListDocuments() {
  const t = useTranslations("Documents");
  const locale = useLocale();
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const loadDocuments = useCallback(async () => {
    try {
      const response = await getListDocuments();
      setDocuments(response.data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount, not a cascading update
    loadDocuments();
  }, [loadDocuments]);

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

      {isLoading && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {!isLoading && isError && <p className="text-sm text-destructive">{t("error")}</p>}
      {!isLoading && !isError && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      )}

      {!isLoading && !isError && documents.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.title")}</TableHead>
              <TableHead>{t("columns.owner")}</TableHead>
              <TableHead>{t("columns.createdAt")}</TableHead>
              <TableHead>{t("columns.updatedAt")}</TableHead>
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
    </div>
  );
}
