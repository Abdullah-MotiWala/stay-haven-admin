import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const labels = Array.from({ length: 30 }, (_, i) => i + 1);

const data = {
  labels,
  datasets: [
    {
      data: [
        90, 18, 22, 8, 30, 20, 25, 5, 12, 21.5, 15, 26,
        20, 30, 18, 23, 12, 30, 90, 15, 12, 18, 90, 10,
        22, 18, 25, 30, 18, 12,
      ],
      backgroundColor: (ctx) =>
        ctx.dataIndex === 9 ? "#2563EB" : "#A5C5FF",
      borderRadius: 0,
      barThickness: 10,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: "#fff",
      borderColor: "#2563EB",
      borderWidth: 1,
      titleColor: "#6B7280",
      bodyColor: "#111827",
      padding: 12,
      displayColors: false,
      callbacks: {
        title: () => "18 Jan 2026",
        label: (ctx) => `Total Revenue: ${ctx.raw}`,
      },
    },
    legend: { display: false },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      ticks: {
        callback: (val) => `${val}k`,
        color: "#6B7280",
        font: { size: 11 },
      },
      grid: {
        drawBorder: false,
        color: "#E5E7EB",
      },
    },
  },
};

export default function RevenueSnapshot() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">Revenue Snapshot</h2>
          <p className="text-sm text-gray-500">
            Last 30 days performance
          </p>
        </div>
        <button className="border rounded-full px-4 py-1 text-sm">
          This month
        </button>
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <Bar data={data} options={options} />
      </div>

      {/* Footer cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Revenue (this month)
          </p>
          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-xl font-bold">112,450</h3>
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
              ↑ 12%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            vs last month
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">All time Revenue</p>
          <h3 className="text-xl font-bold mt-2">6,267,000</h3>
        </div>
      </div>
    </div>
  );
}
