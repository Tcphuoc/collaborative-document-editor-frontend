"use client"

import type { Editor } from "@tiptap/react";
import "@tiptap/extension-text-align";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const alignments = [
  { value: "left", icon: AlignLeft, label: "Căn trái", shortcut: "Ctrl + Shift + L" },
  { value: "center", icon: AlignCenter, label: "Căn giữa", shortcut: "Ctrl + Shift + E" },
  { value: "right", icon: AlignRight, label: "Căn phải", shortcut: "Ctrl + Shift + R" },
  { value: "justify", icon: AlignJustify, label: "Căn đều", shortcut: "Ctrl + Shift + J" },
];

interface AlignmentDropdownProps {
  editor: Editor | null
};

export function AlignmentDropdown({ editor }: AlignmentDropdownProps) {
  const activeAlignment =
    alignments.find(({ value }) => editor?.isActive({ textAlign: value })) ??
    alignments[0];

  const ActiveIcon = activeAlignment.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={!editor}
          aria-label="Căn chỉnh văn bản"
        >
          <ActiveIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <TooltipProvider>
          <div className="flex items-center gap-0.5 p-1">
            {alignments.map(({ value, icon: Icon, label, shortcut }) => (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <Toggle
                    size="sm"
                    pressed={editor?.isActive({ textAlign: value }) ?? false}
                    onPressedChange={() =>
                      editor?.chain().focus().setTextAlign(value).run()
                    }
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
