"use client";

import type { Editor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { AlignmentDropdown } from "@/components/documents/toolbar/alignment-dropdown";
import { FormatText } from "@/components/documents/toolbar/format-text";

interface FormattingToolbarProps {
  editor: Editor | null
};

export function FormattingToolbar({ editor }: FormattingToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b px-2 py-1">
      <FormatText editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <AlignmentDropdown editor={editor} />
    </div>
  );
}
