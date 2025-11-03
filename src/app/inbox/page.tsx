'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Thread } from '@/types/inbox';
import InboxSidebar from './InboxSidebar';
import InboxThread from './InboxThread';

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/thread')
      .then((res) => res.json())
      .then((data) => setThreads(data.threads));
  }, []);

  const selectedThread = threads.find((t) => t.id === selectedId);

  return (
    <div className="flex h-screen bg-sky-50 text-slate-800">
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">Attack Capital</h1>
          <button
            onClick={() => router.push('/analytics')}
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
          >
            View Analytics
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <InboxSidebar threads={threads} onSelect={setSelectedId} selectedId={selectedId} />
          <InboxThread thread={selectedThread} />
        </div>
      </div>
    </div>
  );
}
