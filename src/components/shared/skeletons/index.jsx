// Reusable skeleton pulse animation
const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// MatrixCard skeleton — 4 stat cards
export const MatrixCardSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-white p-5 rounded-3xl shadow-sm">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="relative p-5 rounded-2xl min-h-[120px] bg-gray-50 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <Pulse className="h-4 w-28 rounded-md" />
          <Pulse className="w-9 h-9 rounded-xl flex-shrink-0" />
        </div>
        <Pulse className="h-9 w-16 rounded-md mt-3" />
      </div>
    ))}
  </div>
);

// RoomCard / HostelCard skeleton
export const RoomCardSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex gap-4 bg-white p-2 rounded-xl border border-gray-100 animate-pulse">
        <div className="w-60 h-44 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex flex-col flex-1 gap-3 py-2">
          <Pulse className="h-4 w-24 rounded" />
          <Pulse className="h-5 w-40 rounded" />
          <div className="flex gap-3">
            <Pulse className="h-4 w-28 rounded" />
            <Pulse className="h-4 w-20 rounded" />
            <Pulse className="h-4 w-16 rounded" />
          </div>
          <Pulse className="h-4 w-full rounded" />
          <Pulse className="h-4 w-3/4 rounded" />
          <div className="flex justify-between mt-auto">
            <Pulse className="h-4 w-24 rounded" />
            <Pulse className="h-7 w-20 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// AppartmentCard skeleton (same layout as RoomCard)
export const AppartmentCardSkeleton = ({ count = 3 }) => (
  <RoomCardSkeleton count={count} />
);

// Table row skeleton (for hotels, hosts, bookings)
export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className={`flex gap-4 px-4 py-4 border-b border-dashed ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
        {[...Array(cols)].map((_, j) => (
          <Pulse key={j} className={`h-4 rounded flex-1 ${j === 0 ? "max-w-[40px]" : ""}`} />
        ))}
      </div>
    ))}
  </div>
);
