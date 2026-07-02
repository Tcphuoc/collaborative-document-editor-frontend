const API_BASE = '/api';

interface PatchDocumentPayload {
  title?: string;
  content?: string;
}

export async function patchDocument(id: string, payload: PatchDocumentPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to save document: ${res.status}`);
  }
}
