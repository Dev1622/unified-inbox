import { LogoutButton } from '@/components/LogoutButton';

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <LogoutButton />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
