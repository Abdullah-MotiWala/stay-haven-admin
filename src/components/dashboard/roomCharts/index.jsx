import Card from "../card";

const AvailabilityProgress = ({ title, units }) => {
  return (
    <Card title={title}>
      <div className="space-y-4">
        {units.map((unit) => {
          const total = unit.occupied + unit.available + unit.reserved;

          return (
            <div key={unit.name} className="space-y-2">
              <div className="flex h-8 rounded-xl overflow-hidden">
                <div
                  className="bg-[#8B0000] flex items-center px-3 text-white text-sm"
                  style={{
                    width: `${(unit.occupied / total) * 100}%`,
                  }}
                >
                  {unit.name}
                </div>

                <div
                  className="bg-[#C24141]"
                  style={{
                    width: `${(unit.available / total) * 100}%`,
                  }}
                />

                <div
                  className="bg-[#F87171]"
                  style={{
                    width: `${(unit.reserved / total) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3  text-sm">
                <div className="flex flex-col gap-0 mx-2">
                  <p className="text-xs font-medium text-lightSeconday m-0 ">
                    Occupied
                  </p>
                  <p className="font-medium text-lg text-extradark m-0">
                    {unit.occupied}
                  </p>
                </div>
                <div className="flex flex-col gap-0 px-2 border-l border-r">
                  <p className="text-xs font-medium text-lightSeconday m-0 ">
                    Available
                  </p>
                  <p className="font-medium text-lg text-extradark m-0">
                    {unit.available}
                  </p>
                </div>
                <div className="flex flex-col gap-0 mx-2 ">
                  <p className="text-xs font-medium text-lightSeconday m-0 ">
                    Reserved
                  </p>
                  <p className="font-medium text-lg text-extradark m-0">
                    {unit.reserved}
                  </p>
                </div>

                

                
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AvailabilityProgress;
