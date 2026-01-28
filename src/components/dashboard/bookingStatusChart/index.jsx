import { Pie } from "@ant-design/plots";
import Card from "../card";

const BookingStatus = ({bookingStatus}) => {
  console.log(bookingStatus,"bookingStatus===")
  const data = [
    { type: "Confirmed", value: 42 },
    { type: "Pending", value: 35 },
    { type: "Cancelled", value: 23 },
  ];

  const config = {
    data,
    angleField: "value",
    colorField: "type",

    radius: 1,
    innerRadius: 0.70,

    color: ["#EF6C6E", "#8B0002", "#FF9402"],

    pieStyle: {
      lineCap: "round",
    },
    legend: false,
    statistic: {
      title: {
        customHtml: () => {
          return `
            <div style="
              font-size:14px;
              color:#6B7280;
              font-weight:500;
              margin-bottom:4px;
            ">
              Confirmed
            </div>
          `;
        },
      },
      content: {
        customHtml: () => {
          return `
            <div style="
              font-size:36px;
              font-weight:700;
              color:#111827;
              line-height:1;
            ">
              42%
            </div>
          `;
        },
      },
    },

    interactions: [{ type: "element-active" }],
  };

  return (
    <Card
      title="Booking Status"
      right={<span className="text-sm text-gray-500">Today</span>}
    >
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm ">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8B0000]" />
          <span className="text-gray-800">Confirmed - 42%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF9800]" />
          <span className="text-gray-800">Pending - 35%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F87171]" />
          <span className="text-gray-800">Cancelled - 23%</span>
        </div>
      </div>

      <div className="h-[230px] flex items-center justify-center">
        <Pie {...config} />
      </div>
    </Card>
  );
};

export default BookingStatus;
