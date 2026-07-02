import { create } from 'zustand';
import { patchDocument } from '@/lib/api/documents';

interface DocumentStore {
  content: string;
  isSaving: boolean;
  id: string | null;
  setContent: (content: string) => void;
  setId: (id: string) => void;
  save: () => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  content: '',
  isSaving: false,
  id: null,
  setContent: (content) => set({ content }),
  setId: (id) => set({ id }),
  save: async () => {
    set({ isSaving: true });

    try {
      const id = get().id;
      if (!id) return;

      await patchDocument(id, { content: get().content });
    } finally {
      set({ isSaving: false });
    }
  },
}));
