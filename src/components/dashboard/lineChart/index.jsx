import { Line } from "@ant-design/plots";
import { Select } from "antd";
import Card from "../card";

const BookingStatistics = ({ bookingStatistics }) => {
  const chartData = [];
  
  (bookingStatistics || []).forEach((item) => {
    // Blue Line: Completed
    chartData.push({
      month: item.month,
      type: "Completed", 
      value: item.completed,
    });
    chartData.push({
      month: item.month,
      type: "Cancelled", 
      value: item.cancelled, 
    });
  });

  const config = {
    data: chartData,
    xField: "month",
    yField: "value",
    seriesField: "type",
    smooth: true,
    height: 285,
    color: ["#2563EB", "#F97316"],
    lineStyle: {
      lineWidth: 2,
    },
    yAxis: {
      grid: null,
    },
    xAxis: {
      tickLine: null,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      showMarkers: false,
    },
  };

  return (
    <Card
      title="Booking Statistics"
      right={
        <Select
          size="small"
          defaultValue="thisYear"
          options={[{ label: "This Year", value: "thisYear" }]}
        />
      }
    >
      {chartData.length > 0 ? (
        <Line {...config} key={chartData.length} /> 
      ) : (
        <div className="h-[285px] flex items-center justify-center text-gray-400">
          Loading Statistics...
        </div>
      )}
    </Card>
  );
};

export default BookingStatistics;




















// import { Line } from "@ant-design/plots";
// import { Select } from "antd";
// import Card from "../card";

// const BookingStatistics = ({bookingStatistics}) => {
//     const data = [
//       { month: "Jan", type: "Completed", value: 120 },
//       { month: "Jan", type: "Cancelled", value: 80 },
//       { month: "Feb", type: "Completed", value: 180 },
//       { month: "Feb", type: "Cancelled", value: 90 },
//       { month: "Mar", type: "Completed", value: 150 },
//       { month: "Mar", type: "Cancelled", value: 70 },
//       { month: "Apr", type: "Completed", value: 230 },
//       { month: "Apr", type: "Cancelled", value: 110 },
//       { month: "May", type: "Completed", value: 160 },
//       { month: "May", type: "Cancelled", value: 60 },
//       { month: "Jun", type: "Completed", value: 210 },
//       { month: "Jun", type: "Cancelled", value: 90 },
//       { month: "Jul", type: "Completed", value: 140 },
//       { month: "Jul", type: "Cancelled", value: 55 },
//       { month: "Aug", type: "Completed", value: 195 },
//       { month: "Aug", type: "Cancelled", value: 80 },
//       { month: "Sep", type: "Completed", value: 170 },
//       { month: "Sep", type: "Cancelled", value: 75 },
//       { month: "Oct", type: "Completed", value: 235 },
//       { month: "Oct", type: "Cancelled", value: 95 },
//       { month: "Nov", type: "Completed", value: 180 },
//       { month: "Nov", type: "Cancelled", value: 85 },
//       { month: "Dec", type: "Completed", value: 200 },
//       { month: "Dec", type: "Cancelled", value: 100 },
//     ];

//   const config = {
//     bookingStatistics,
//     xField: "month",
//     yField: "value",
//     seriesField: "type",
//     smooth: true,
//     height: 285,
//     color: ["#2563EB", "#F97316"],
//     lineStyle: {
//       lineWidth: 2,
//     },
//     yAxis: {
//       grid: null,
//     },
//     xAxis: {
//       tickLine: null,
//     },
//     legend: {
//       position: "top",
//     },
//     tooltip: {
//       showMarkers: false,
//     },
//   };

//   return (
//     <Card
//       title="Booking Statistics"
//       right={
//         <Select
//           size="small"
//           defaultValue="thisYear"
//           options={[{ label: "This Year", value: "thisYear" }]}
//         />
//       }
//     >
//       <Line {...config} />
//     </Card>
//   );
// };

// export default BookingStatistics;
