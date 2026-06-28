import { Header } from "@/components/documents/header";
import CustomEditorContent from "@/components/documents/custom-editor-content";

export default function EditDocumentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CustomEditorContent />
    </div>
  );
}
