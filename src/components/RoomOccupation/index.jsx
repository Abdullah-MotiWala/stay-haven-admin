const ProgressRow = ({
  label,
  used,
  total,
}) => {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <div className="space-y-2">
      {/* Label Row */}
      <div className="flex items-center justify-between text-sm font-medium text-gray-800">
        <span>{label}</span>
        <span className="text-black">
          {used} / {total} rooms
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-indigo-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const RoomOccupancyCard = ({
  title = "Room Type Occupancy",
  subtitle = "Live breakdown of room availability",
  data = [],
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-lg">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {/* Bars */}
      <div className="space-y-5">
        {data.map((item, index) => (
          <ProgressRow
            key={index}
            label={item.label}
            used={item.used}
            total={item.total}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomOccupancyCard;
