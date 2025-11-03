import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

type ContactAnalytics = {
  name: string;
  channels: Record<string, number>; 
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<ContactAnalytics[]>([]);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(res => setData(res.perContact || []));
  }, []);

  const contactNames = data.map(d => d.name);
  const whatsappCounts = data.map(d => d.channels.whatsapp || 0);
  const emailCounts = data.map(d => d.channels.email || 0);

  const chartData = {
    labels: contactNames,
    datasets: [
      {
        label: 'WhatsApp',
        data: whatsappCounts,
        backgroundColor: '#25D366',
      },
      {
        label: 'Email',
        data: emailCounts,
        backgroundColor: '#4285F4',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Messages per Contact by Channel</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
