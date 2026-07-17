import React, { useState } from 'react';

const RevenueBarChart = ({ 
  chartData = [], 
  title = "Revenue Snapshot", 
  totalThisMonth = "0", 
  percentageGrowth = "0", 
  allTimeTotal = "0" 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">{title}</h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">Last 30 days performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
          This month
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>

      {/* Chart Container - Added padding-top for Tooltip space */}
      <div className="relative h-64 w-full pt-16 flex items-end justify-between gap-[2px] md:gap-2 mb-10">
        
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-16 h-full flex flex-col justify-between text-[11px] font-bold text-gray-400/80 -ml-8 md:-ml-10">
          <span>100k</span>
          <span>80k</span>
          <span>60k</span>
          <span>40k</span>
          <span>20k</span>
          <span>00</span>
        </div>

        {/* Bars Mapping */}
        {chartData.map((item, index) => {
          // Calculating height (assuming max value is 100 for percentage)
          const barHeight = `${(item.value / 100) * 100}%`;
          
          return (
            <div 
              key={index} 
              className="relative flex-1 h-full flex items-end group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip - Adjusted for 'Top' position to avoid clipping */}
              {hoveredIndex === index && (
                <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 min-w-[120px] bg-white border border-blue-100 shadow-2xl shadow-blue-100 rounded-xl p-3 pointer-events-none transition-all scale-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.date || 'Jan 2026'}</p>
                  <p className="text-[11px] font-bold text-gray-800 mt-0.5">Total Revenue</p>
                  <p className="text-sm font-extrabold text-[#2563eb] leading-tight">{item.amount || item.value}</p>
                  {/* Tooltip Tail */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-blue-50 rotate-45"></div>
                </div>
              )}

              {/* The Actual Bar */}
              <div 
                style={{ height: barHeight }}
                className={`w-full rounded-sm transition-all duration-300 cursor-pointer
                  ${hoveredIndex === index ? 'bg-[#2563eb]' : 'bg-[#bfdbfe] hover:bg-[#93c5fd]'}
                `}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#f8fafc] p-6 rounded-3xl flex justify-between items-center border border-gray-50">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Revenue (this month)</p>
            <h3 className="text-3xl font-bold text-[#111827]">{totalThisMonth}</h3>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-0.5 text-[#10b981] bg-[#ecfdf5] px-2.5 py-1 rounded-full text-xs font-bold">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
              {percentageGrowth}%
            </span>
            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase">vs last month</p>
          </div>
        </div>

        <div className="bg-[#f8fafc] p-6 rounded-3xl border border-gray-50">
          <p className="text-gray-500 text-sm font-semibold mb-1">All time Revenue</p>
          <h3 className="text-3xl font-bold text-[#111827]">{allTimeTotal}</h3>
        </div>
      </div>
    </div>
  );
};

// Default Usage Example:
export default function App() {
  const sampleData = Array.from({ length: 29 }, (_, i) => ({
    value: Math.floor(Math.random() * 90) + 10, // Height percentage
    amount: (Math.random() * 20000).toLocaleString(), // Hover amount
    date: `${i + 1} Jan 2026` // Hover date
  }));

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <RevenueBarChart 
        chartData={sampleData}
        totalThisMonth="112,450"
        percentageGrowth="12"
        allTimeTotal="6,267,000"
      />
    </div>
  );
}