import Card from "../card";

const notifications = [
  {
    type: "danger",
    title: "Low room availability",
    message: "Only 2 rooms left in Deluxe Room – Karachi Hotel",
    time: "4:12 pm",
  },
  {
    type: "danger",
    title: "Pending bookings",
    message: "5 bookings pending approval",
    time: "4:12 pm",
  },
  {
    type: "info",
    title: "New booking received",
    message: "Lorem Ipsum is simply dummy text of the printing",
    time: "4:12 pm",
  },
  {
    type: "info",
    title: "Room updated",
    message: "Lorem Ipsum is simply dummy text of the printing",
    time: "4:12 pm",
  },
  {
    type: "danger",
    title: "Low room availability",
    message: "Only 2 rooms left in Deluxe Room – Karachi Hotel",
    time: "4:12 pm",
  },
];

const typeStyles = {
  danger: {
    bg: "bg-maxLightRed",
    dot: "bg-red",
    title: "text-red",
  },
  info: {
    bg: "bg-maxLightBlue",
    dot: "bg-mainBlue",
    title: "text-mainBlue",
  },
};

const NotificationsAlerts = () => {
  return (
    <div  className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-auto">
      <div className="flex justify-between px-4 pt-6 items-center mb-3">
        <span className="text-red font-medium text-lg">Notification & Alerts</span>
        <span className="text-blue text-sm font-medium cursor-pointer">
          View All
        </span>
      </div>

      <div className="space-y-1 divide-white">
        {notifications.map((item, index) => {
          const style = typeStyles[item.type];

          return (
            <div
              key={index}
              className={`flex items-start justify-between px-6 py-4 ${style.bg}`}
            >
              <div className="flex gap-4">
                <span className={`mt-1 w-3 h-3 rounded-full ${style.dot}`} />
                <div className="flex flex-col gap-0 m-0">
                  <p className={`font-semibold text-sm m-0 ${style.title}`}>
                    {item.title}
                  </p>
                  <p className="text-sm text-black m-0 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* TIME */}
              <span className="text-xs text-lightSeconday whitespace-nowrap">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsAlerts;
