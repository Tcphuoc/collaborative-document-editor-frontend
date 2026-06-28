"use client";

import type { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormatItem {
  label: string
  shortcut: string
  icon: React.ElementType
  action: (editor: Editor) => void
  isActive: (editor: Editor) => boolean
};

const formats: FormatItem[] = [
  {
    label: "In đậm",
    shortcut: "Ctrl + B",
    icon: Bold,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
  },
  {
    label: "In nghiêng",
    shortcut: "Ctrl + I",
    icon: Italic,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
  },
  {
    label: "Gạch dưới",
    shortcut: "Ctrl + U",
    icon: Underline,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
  },
  {
    label: "Gạch ngang",
    shortcut: "Ctrl + Shift + X",
    icon: Strikethrough,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
  },
];

interface FormatTextProps {
  editor: Editor | null
};

export function FormatText({ editor }: FormatTextProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5">
        {formats.map(({ label, shortcut, icon: Icon, action, isActive }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor ? isActive(editor) : false}
                onPressedChange={() => editor && action(editor)}
                disabled={!editor}
                aria-label={label}
              >
                <Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {label} - <kbd data-slot="kbd">{shortcut}</kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
