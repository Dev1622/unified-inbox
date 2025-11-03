import { Message } from '@/types/inbox';

type Props = {
  message: Message;
  onDelete?: () => void;
};

export default function MessageBubble({ message, onDelete }: Props) {
  const isInbound = message.direction === 'inbound';

  return (
    <div className={`mb-2 flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
      <div className={`relative max-w-xs p-2 rounded-lg text-sm ${isInbound ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
        <div>{message.body}</div>
        <div className="text-xs text-gray-500 mt-1">
          {message.channel} • {message.sentAt}
        </div>
        <button
          onClick={onDelete}
          className="absolute top-1 right-1 text-xs text-red-500 hover:underline"
        >
          
        </button>
      </div>
    </div>
  );
}
