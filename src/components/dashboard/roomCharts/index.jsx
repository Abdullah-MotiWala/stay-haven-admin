import Card from "../card";

const AvailabilityProgress = ({ title, units , height}) => {
  return (
    <Card title={title} height={height}>
      <div className="space-y-4">
        {!units || units.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No data available</p>
        ) : (
          units.map((unit) => {
            const total = unit.occupied + unit.available + unit.reserved;
            // Only show rooms that have at least some activity
            if (total === 0) return null;

            const occupiedPct  = total > 0 ? (unit.occupied  / total) * 100 : 0;
            const availablePct = total > 0 ? (unit.available / total) * 100 : 0;
            const reservedPct  = total > 0 ? (unit.reserved  / total) * 100 : 0;

            return (
              <div key={unit.name} className="space-y-2">
                {/* Bar with absolute name label */}
                <div className="relative h-8 rounded-xl overflow-hidden bg-gray-100">
                  <div className="flex h-full w-full">
                    <div className="bg-[#8B0000]" style={{ width: `${occupiedPct}%` }} />
                    <div className="bg-[#C24141]" style={{ width: `${availablePct}%` }} />
                    <div className="bg-[#F87171]" style={{ width: `${reservedPct}%` }} />
                  </div>
                  {/* Name always visible on top-left */}
                  <span className="absolute inset-0 flex items-center px-3 text-white text-sm font-semibold drop-shadow-sm pointer-events-none">
                    {unit.name}
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 text-sm">
                  <div className="flex flex-col gap-0 mx-2">
                    <p className="text-xs font-medium text-lightSeconday m-0">Occupied</p>
                    <p className="font-medium text-lg text-extradark m-0">{unit.occupied}</p>
                  </div>
                  <div className="flex flex-col gap-0 px-2 border-l border-r">
                    <p className="text-xs font-medium text-lightSeconday m-0">Available</p>
                    <p className="font-medium text-lg text-extradark m-0">{unit.available}</p>
                  </div>
                  <div className="flex flex-col gap-0 mx-2">
                    <p className="text-xs font-medium text-lightSeconday m-0">Reserved</p>
                    <p className="font-medium text-lg text-extradark m-0">{unit.reserved}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default AvailabilityProgress;
