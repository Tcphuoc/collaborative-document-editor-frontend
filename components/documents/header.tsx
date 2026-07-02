"use client";

import { useDocumentStore } from "@/lib/store/document-store";
import { Button } from "@/components/ui/button";

export function Header() {
  const { isSaving, save } = useDocumentStore();

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <span className="font-semibold text-sm">Collaborative Document Editor</span>
      <Button size="sm" disabled={isSaving} onClick={save}>
        {isSaving ? "Đang lưu..." : "Lưu"}
      </Button>
    </header>
  );
}
