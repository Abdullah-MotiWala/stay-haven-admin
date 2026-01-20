import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function RevenueSnapshot({ revenue, onMonthChange }) {
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [open, setOpen] = useState(false);

  const dailyData = revenue?.dailyData || [];

  /* ---------------- CHART DATA ---------------- */
  const chartData = {
    labels: dailyData.map((d) => d.date),
    datasets: [
      {
        data: dailyData.map((d) => d.revenue),
        backgroundColor: (ctx) =>
          ctx.dataIndex === dailyData.length - 1
            ? "#2563EB"
            : "#A5C5FF",
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#2563EB",
        borderWidth: 1,
        callbacks: {
          title: (items) =>
            dailyData[items[0].dataIndex]?.date || "",
          label: (ctx) => `Revenue: ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: {
        grid: { color: "#E5E7EB" },
        ticks: { font: { size: 11 } },
      },
    },
  };

  /* ---------------- HANDLER ---------------- */
  const handleMonthSelect = (index) => {
    setSelectedMonth(index);
    setOpen(false);

    // 🔥 parent ko batao month change hua
    onMonthChange?.(index + 1); // 1–12
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between mb-6 relative">
        <div>
          <h2 className="text-lg font-bold">Revenue Snapshot</h2>
          <p className="text-sm text-gray-500">
            {MONTHS[selectedMonth]} performance
          </p>
        </div>

        {/* MONTH DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="border rounded-full px-4 py-1 text-sm flex items-center gap-2"
          >
            {MONTHS[selectedMonth]}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                    ${index === selectedMonth ? "font-semibold text-blue-600" : ""}
                  `}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHART */}
      <div className="h-[220px]">
        <Bar data={chartData} options={options} />
      </div>

      {/* FOOTER */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Revenue ({MONTHS[selectedMonth]})
          </p>

          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-xl font-bold">
              {revenue?.formattedTotal || "Rs. 0"}
            </h3>

            {revenue?.growth && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  revenue.growth.isPositive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {revenue.growth.percentage}%
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {revenue?.growth?.text || "vs last month"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">All time Revenue</p>
          <h3 className="text-xl font-bold mt-2">
            {revenue?.formattedAllTime || "Rs. 0"}
          </h3>
        </div>
      </div>
    </div>
  );
}
