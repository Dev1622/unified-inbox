'use client';

import { useState } from 'react';

export default function ScheduleMessageForm({
  contactId,
  onScheduled,
}: {
  contactId: string;
  onScheduled?: () => void;
}) {
  const [body, setBody] = useState('');
  const [delayMinutes, setDelayMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();

    const res = await fetch('/api/scheduled', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId,
        body,
        channel: 'whatsapp',
        scheduledAt,
      }),
    });

    setLoading(false);
    if (res.ok) {
      setBody('');
      setSuccess(true);
      onScheduled?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-md p-3 shadow-sm space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Schedule a Message</h3>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your message..."
        className="w-full border rounded px-3 py-2 text-sm"
        rows={2}
        required
      />

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">Send in:</label>
        <select
          value={delayMinutes}
          onChange={(e) => setDelayMinutes(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={5}>5 minutes</option>
          <option value={60}>1 hour</option>
          <option value={1440}>1 day</option>
          <option value={4320}>3 days</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-sky-500 text-white px-4 py-2 rounded text-sm hover:bg-sky-600 disabled:opacity-50"
      >
        {loading ? 'Scheduling...' : 'Schedule'}
      </button>

      {success && <p className="text-green-600 text-sm">Message scheduled!</p>}
    </form>
  );
}
