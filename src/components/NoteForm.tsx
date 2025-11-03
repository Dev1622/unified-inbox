'use client';

import { useState } from 'react';

type Props = {
  contactId: string;
  onNoteCreated?: () => void;
};

export default function NoteForm({ contactId, onNoteCreated }: Props) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    await fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ contactId, body }),
      headers: { 'Content-Type': 'application/json' },
    });
    setBody('');
    setLoading(false);
    onNoteCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-md p-3 shadow-sm space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a note..."
        className="w-full border rounded px-3 py-2 text-sm"
        rows={2}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-sky-500 text-white px-4 py-2 rounded text-sm hover:bg-sky-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Add Note'}
      </button>
    </form>
  );
}
