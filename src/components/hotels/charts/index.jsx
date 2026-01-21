import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function RevenueSnapshot({ revenue }) {
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [selectedMonth] = useState(currentMonthIndex);

  const dailyData = revenue?.dailyData || [];

  /* ---------------- PREPARE DATA ---------------- */
  const labels = dailyData.map(d => d.day);

  const values = dailyData.map(d => d.revenue);

  // 🔥 find last non-zero revenue day (highlight bar)
  const activeIndex = [...values]
    .map((v, i) => (v > 0 ? i : -1))
    .filter(i => i !== -1)
    .pop();

  /* ---------------- CHART DATA ---------------- */
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        barThickness: 10,
        borderRadius: 2,
        backgroundColor: ctx =>
          ctx.dataIndex === activeIndex
            ? "#2563EB" // dark blue (active)
            : "#9DBDFF", // light blue
      },
    ],
  }), [values, labels, activeIndex]);

  /* ---------------- CHART OPTIONS ---------------- */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#2563EB",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleColor: "#6B7280",
        bodyColor: "#111827",
        callbacks: {
          title: items => {
            const day = items[0].label;
            return `${day} ${MONTHS[selectedMonth]} ${currentYear}`;
          },
          label: ctx => `Total Revenue\n${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          callback: value =>
            value >= 1000 ? `${value / 1000}k` : value,
          font: { size: 11 },
        },
      },
    },
  };

  /* ---------------- TOTALS ---------------- */
  const totalRevenue = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* HEADER */}
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

      {/* CHART */}
      <div className="h-[220px]">
        <Bar data={chartData} options={options} />
      </div>

      {/* FOOTER */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Revenue (this month)
          </p>

          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-xl font-bold">
              {totalRevenue.toLocaleString()}
            </h3>

            {revenue?.growth && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  revenue.growth.isPositive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                ↑ {revenue.growth.percentage}%
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            vs last month
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">All time Revenue</p>
          <h3 className="text-xl font-bold mt-2">
            {revenue?.formattedAllTime || "0"}
          </h3>
        </div>
      </div>
    </div>
  );
}
