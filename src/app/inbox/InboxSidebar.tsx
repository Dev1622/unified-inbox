import { Thread } from '@/types/inbox';

type Props = {
  threads: Thread[];
  onSelect: (id: string) => void;
  selectedId: string | null;
};


export default function InboxSidebar({ threads, onSelect }: Props) {
  return (
    <div className="w-1/3 border-r overflow-y-auto">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className="p-4 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(thread.id)}
        >
          <div className="font-semibold">{thread.name}</div>
          <div className="text-sm text-gray-600">{thread.lastMessage}</div>
          <div className="text-xs text-gray-400">{thread.lastSentAt}</div>
        </div>
      ))}
    </div>
  );
}
