import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChannelPieChart() {
  const data = {
    labels: ['WhatsApp', 'Email'],
    datasets: [
      {
        data: [10, 7], 
        backgroundColor: ['#34B7F1', '#FFB6C1'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
    },
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Message Distribution by Channel</h2>
      <Pie data={data} options={options} />
    </div>
  );
}
