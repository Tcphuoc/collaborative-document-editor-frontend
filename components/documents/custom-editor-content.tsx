'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { FormattingToolbar } from "@/components/documents/formatting-toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from '@tiptap/starter-kit';

export default function CustomEditorContent() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'custom-tiptap-editor',
      }
    }
  });

  return (
    <>
      <FormattingToolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}
