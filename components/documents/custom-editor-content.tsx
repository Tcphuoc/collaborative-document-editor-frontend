'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { FormattingToolbar } from "@/components/documents/formatting-toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from '@tiptap/starter-kit';
import { useDocumentStore } from "@/lib/store/document-store";
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomEditorContent() {
  const setContent = useDocumentStore((state) => state.setContent);
  const setId = useDocumentStore((state) => state.setId);

  const { document_id } = useParams<{ document_id: string }>();

  useEffect(() => {
    setId(document_id);
  }, [document_id, setId]);

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
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <>
      <FormattingToolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}
