import { Thread } from '@/types/inbox';
import MessageBubble from './MessageBubble';
import ComposeBox from '@/components/ComposeBox';
import ScheduleMessageForm from '@/components/ScheduleMessageForm';
import NoteForm from '@/components/NoteForm';
import { useEffect, useState } from 'react';

type Props = {
  thread?: Thread;
};

type Note = {
  id: string;
  body: string;
  createdAt: string;
};

type ScheduledMessage = {
  id: string;
  body: string;
  scheduledAt: string;
  createdAt: string;
};

type TimelineItem =
  | { type: 'message'; data: Thread['messages'][number] }
  | { type: 'note'; data: Note }
  | { type: 'scheduled'; data: ScheduledMessage };

export default function InboxThread({ thread }: Props) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'schedule' | 'email'>('chat');

  useEffect(() => {
    if (!thread?.id || !thread?.messages) return;

    const safeThread = thread;

    async function loadTimeline() {
      try {
        const [notesRes, scheduledRes] = await Promise.all([
          fetch(`/api/notes?contactId=${safeThread.id}`).then(res => res.json()),
          fetch(`/api/scheduled?contactId=${safeThread.id}`).then(res => res.json()),
        ]);

        const messages: TimelineItem[] = safeThread.messages.map(msg => ({
          type: 'message',
          data: msg,
        }));

        const notes: TimelineItem[] = notesRes.map((note: Note) => ({
          type: 'note',
          data: note,
        }));

        const scheduled: TimelineItem[] = scheduledRes.map((sched: ScheduledMessage) => ({
          type: 'scheduled',
          data: sched,
        }));

        const merged = [...messages, ...notes, ...scheduled].sort(
          (a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime()
        );

        setTimeline(merged);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      }
    }

    loadTimeline();
  }, [thread]);

  useEffect(() => {
    if (!thread?.id) return;

    const interval = setInterval(() => {
      fetch(`/api/messages?contactId=${thread.id}`)
        .then(res => res.json())
        .then(messages => {
          const messageItems: TimelineItem[] = messages.map((msg: Thread['messages'][number]) => ({
            type: 'message',
            data: msg,
          }));

          setTimeline(prev => {
            const filtered = prev.filter(item => item.type !== 'message');
            return [...filtered, ...messageItems].sort(
              (a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime()
            );
          });
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [thread?.id]);

  if (!thread) {
    return <div className="flex-1 p-4 text-slate-600">Select a contact</div>;
  }

  const safeThread = thread;

  return (
    <div className="flex-1 p-4 flex flex-col bg-sky-50 text-slate-800 overflow-hidden">
      <div className="text-lg font-semibold mb-4">{safeThread.name}</div>

      <div className="flex gap-6 border-b mb-4 text-sm font-medium">
        {['chat', 'notes', 'schedule', 'email'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'chat' | 'notes' | 'schedule' | 'email')}
            className={`pb-2 ${
              activeTab === tab ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {timeline.filter(t => t.type === 'message').map((item, i) => (
              <div key={`msg-${i}`} className="relative">
                <MessageBubble message={item.data} />
                <button
                  onClick={() => {
                    fetch(`/api/message/${item.data.id}`, { method: 'DELETE' })
                      .then(() => {
                        setTimeline(prev => prev.filter(t => t.data.id !== item.data.id));
                      });
                  }}
                  className="absolute top-1 right-2 text-xs text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-sky-50 pt-2">
            <ComposeBox
              to={safeThread.phone}
              channel={safeThread.messages.at(-1)?.channel ?? 'whatsapp'}
              contactId={safeThread.id}
              onMessageSent={() => {
                fetch(`/api/messages?contactId=${safeThread.id}`)
                  .then(res => res.json())
                  .then(messages => {
                    const messageItems: TimelineItem[] = messages.map((msg: Thread['messages'][number]) => ({
                      type: 'message',
                      data: msg,
                    }));

                    setTimeline(prev =>
                      [...prev.filter(item => item.type !== 'message'), ...messageItems].sort(
                        (a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime()
                      )
                    );
                  });
              }}
            />
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <>
          <NoteForm
            contactId={safeThread.id}
            onNoteCreated={() => {
              fetch(`/api/notes?contactId=${safeThread.id}`)
                .then(res => res.json())
                .then(notes => {
                  const noteItems: TimelineItem[] = notes.map((note: Note) => ({
                    type: 'note',
                    data: note,
                  }));

                  setTimeline(prev =>
                    [...prev.filter(item => item.type !== 'note'), ...noteItems].sort(
                      (a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime()
                    )
                  );
                });
            }}
          />
          {timeline.filter(t => t.type === 'note').map((item, i) => (
            <div
              key={`note-${i}`}
              className="relative bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-slate-700"
            >
              <div>📝 {item.data.body}</div>
              <div className="text-xs text-slate-400 mt-1">
                {new Date(item.data.createdAt).toLocaleString()}
              </div>
              <button
                onClick={() => {
                  fetch(`/api/note/${item.data.id}`, { method: 'DELETE' })
                    .then(() => {
                      setTimeline(prev => prev.filter(t => t.data.id !== item.data.id));
                    });
                }}
                className="absolute top-1 right-2 text-xs text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))}
        </>
      )}

      {activeTab === 'schedule' && (
        <>
          <ScheduleMessageForm
            contactId={safeThread.id}
            onScheduled={() => {
              fetch(`/api/scheduled?contactId=${safeThread.id}`)
                .then(res => res.json())
                .then(scheduled => {
                  const scheduledItems: TimelineItem[] = scheduled.map((sched: ScheduledMessage) => ({
                    type: 'scheduled',
                    data: sched,
                  }));

                  setTimeline(prev =>
                    [...prev.filter(item => item.type !== 'scheduled'), ...scheduledItems].sort(
                      (a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime()
                    )
                  );
                });
            }}
          />
          {timeline.filter(t => t.type === 'scheduled').map((item, i) => (
            <div
              key={`sched-${i}`}
              className="relative bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-slate-700"
            >
              <div>⏰ Scheduled: {item.data.body}</div>
              <div className="text-xs text-slate-400 mt-1">
                For: {new Date(item.data.scheduledAt).toLocaleString()}
              </div>
              <button
                onClick={() => {
                  fetch(`/api/scheduled/${item.data.id}`, { method: 'DELETE' })
                    .then(() => {
                       setTimeline(prev => prev.filter(t => t.data.id !== item.data.id));
                    });
                }}
                className="absolute top-1 right-2 text-xs text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))}
        </>
      )}

      {activeTab === 'email' && (
        <div className="bg-white border rounded-md p-4 shadow-sm text-sm">
          <div className="font-medium text-slate-800 mb-1">
            Subject: Welcome to Unified Inbox
          </div>
          <div className="text-slate-600 mb-2">
            Hi Surya, thanks for testing the inbox. This is a sample email to demonstrate the layout.
          </div>
          <div className="text-xs text-slate-400">
            Received: Nov 3, 2025, 6:45 PM
          </div>
        </div>
      )}
    </div>
  );
}
