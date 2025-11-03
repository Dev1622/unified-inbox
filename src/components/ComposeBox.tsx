'use client';

import { useState } from 'react';

export default function ComposeBox({
  to,
  channel,
  contactId,
  onMessageSent,
}: {
  to: string;
  channel: string;
  contactId: string;
  onMessageSent?: () => void;
}) {
  const [body, setBody] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const handleSend = async () => {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message: body, channel, contactId }),
    });

    if (res.ok) {
      setBody('');
      setSentNotice(true);
      setTimeout(() => setSentNotice(false), 2000);
      onMessageSent?.();
    }
  };

  return (
    <div className="bg-white border rounded-md p-3 shadow-sm">
      {sentNotice && (
        <div className="text-green-600 text-sm mb-2">✅ Message sent successfully</div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-sky-500 text-white px-4 py-2 rounded text-sm hover:bg-sky-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
