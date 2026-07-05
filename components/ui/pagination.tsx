"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ELLIPSIS = "ellipsis";

function getPageRange(currentPage: number, totalPages: number): (number | typeof ELLIPSIS)[] {
  const siblings = 1;
  const start = Math.max(2, currentPage - siblings);
  const end = Math.min(totalPages - 1, currentPage + siblings);

  const pages: (number | typeof ELLIPSIS)[] = [1];
  if (start > 2) pages.push(ELLIPSIS);
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < totalPages - 1) pages.push(ELLIPSIS);
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  limitOptions: number[];
  onLimitChange: (limit: number) => void;
  rowsPerPageLabel: string;
  pageInfoLabel: string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  limitOptions,
  onLimitChange,
  rowsPerPageLabel,
  pageInfoLabel,
  previousLabel,
  nextLabel,
  className,
}: PaginationProps) {
  const pages = React.useMemo(
    () => getPageRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <div
      data-slot="pagination"
      className={cn("flex flex-wrap items-center justify-between gap-4", className)}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{rowsPerPageLabel}</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger size="sm" className="w-[72px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label={previousLabel}
        >
          <ChevronLeftIcon />
        </Button>

        {pages.map((page, index) =>
          page === ELLIPSIS ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-7 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={nextLabel}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <span className="text-sm text-muted-foreground">{pageInfoLabel}</span>
    </div>
  );
}

export { Pagination };
