import { Pie } from "@ant-design/plots";
import Card from "../card";

const BookingStatus = ({ bookingStatus , height}) => {
  const allowedStatuses = ["Booked", "Checked-In", "Cancelled"];

  const chartData = (bookingStatus || [])
    .filter((item) => allowedStatuses.includes(item.status))
    .map((item) => ({
      type: item.status,
      value: item.count,
      percentage: item.percentage,
    }));

  const checkedInData = chartData.find((d) => d.type === "Checked-In") || chartData[0];
  const centerDisplay = chartData[0];

  const statusColors = {
    "Booked": "#8B0002",
    "Checked-In": "#FF9402",
    "Cancelled": "#EF6C6E",
  };

  const config = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.7,

    scale: {
      color: {
        domain: ["Booked", "Checked-In", "Cancelled"],
        range: ["#8B0002", "#FF9402", "#EF6C6E"],
      },
    },

    pieStyle: {
      lineCap: "round",
    },
    legend: false,
    statistic: {
      title: {
        customHtml: () => `<div style="font-size:14px; color:#6B7280; font-weight:500;">${centerDisplay?.type || "Confirmed"}</div>`,
      },
      content: {
        customHtml: () => `<div style="font-size:36px; font-weight:700; color:#111827;">${checkedInData?.percentage || 0}%</div>`,
      },
    },
  };

  return (
    <Card
      title="Booking Status"
      right={<span className="text-sm text-gray-500">Today</span>}
      height={height}
    >
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
        {chartData.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: statusColors[item.type] || "#ccc" }}
            />
            <span className="text-gray-800">
              {item.type} - {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="h-[230px] flex items-center justify-center">
        {chartData.length > 0 ? <Pie {...config} /> : <p>No Data Available</p>}
      </div>
    </Card>
  );
}

export default BookingStatus;