'use client';

import { useRouter } from 'next/navigation';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ChannelPieChart from '@/components/ChannelPieChart';

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <button
          onClick={() => router.push('/inbox')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          Back to Inbox
        </button>
      </div>

      {/* Charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsDashboard />
        <ChannelPieChart />
      </div>
    </div>
  );
}
