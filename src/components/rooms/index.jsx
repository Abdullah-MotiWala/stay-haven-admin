// import { useState } from "react";
// import { rooms, roomTypes } from "../../container/data/rooms";
// import RoomCard from "../RoomCard";
// import RoomDetail from "../roomDetail";
// import filter from "../../assets/icons/filter.png";
// import MatrixCard from "../MatrixCard";
// import home from "../../assets/icons/home.png"
// export default function Rooms() {
//   const [activeType, setActiveType] = useState("All Rooms");
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [showFilter, setShowFilter] = useState(false);
//   const [page, setPage] = useState(1);

//   const filteredRooms =
//     activeType === "All Rooms"
//       ? rooms
//       : rooms.filter((r) => r.type === activeType);

//   return (
//     <>


//       <MatrixCard showshadow="true" icon={home} />
//       <div className="p-0 gap-1 inline-flex  max-w-full overflow-hidden rounded-lg">
//         {roomTypes.map((type, index) => (
//           <button
//             key={type}
//             onClick={() => setActiveType(type)}
//             className={`
//         px-2 py-2 text-sm font-medium whitespace-nowrap
//         transition-colors duration-200 rounded-0 m-0 
        
//         ${activeType === type
//                 ? "bg-blue text-white"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//               }
//         ${index === 0 ? "" : ""}
//         ${index === roomTypes.length - 1 ? "" : ""}
//       `}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       <div className="p-4 md:p-6 bg-white min-h-screen">
//         {/* Top Buttons */}


//         {/* Filter Button */}
//         <div className="flex justify-between items-center mb-3 w-[65%]">
//           <h2 className="font-semibold text-gray-700">
//             All Rooms ({filteredRooms.length})
//           </h2>
//           <button
//             onClick={() => setShowFilter(!showFilter)}
//             className="border px-3 py-1.5 rounded-md text-sm bg-white"
//           >
//             <span>
//               <img src={filter} alt="" />
//             </span>
//           </button>
//         </div>

//         {/* Filter Panel */}
//        {showFilter && (
//   <div className="bg-white p-2 rounded-lg shadow mb-4">
//     <h3 className="text-lg font-semibold mb-1 text-gray-700">Apply Filters</h3>
    
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//       {/* Dropdowns Container */}
//       <div className="flex flex-wrap gap-4 flex-1">
        
//         {/* Sort by Hotel Name */}
//         <div className="relative w-full md:w-48">
//           <select 
//             className="block bg-[#F9F9F9] w-full appearance-none  border border-gray-300 rounded-md px-2 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             defaultValue=""
//           >
//             <option value="" disabled>Sort by hotel name</option>
//             <option>Standard</option>
//             <option>Deluxe</option>
//           </select>
//           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//             <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
//           </div>
//         </div>

//         {/* Sort by Status */}
//         <div className="relative w-full md:w-48 ">
//           <select 
//             className="block bg-[#F9F9F9] w-full appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             defaultValue=""
//           >
//             <option value="" disabled>Sort by status</option>
//             <option>$100 - $150</option>
//             <option>$150 - $200</option>
//           </select>
//           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//             <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
//           </div>
//         </div>

//       </div>

//       {/* Action Button */}
//       <div className="w-full md:w-auto flex justify-end">
//         <button className="bg-blue hover:bg-gray-300 text-white px-8 py-2 rounded-md font-medium transition-colors w-full md:w-auto">
//           Apply Filter
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//         {/* Layout */}
//         <div className="max-w-full ">
//           {/* LEFT - Cards */}
//           <div className="md:w-full">
//             {filteredRooms.map((room) => (
//               <RoomCard
//                 key={room.id}
//                 room={room}
//                 active={selectedRoom?.id === room.id}
//                 onClick={() => setSelectedRoom(room)}
//               />
//             ))}

//             {/* Pagination */}
//             <div className="flex justify-center gap-2 mt-4">
//               {[1, 2, 3].map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`w-8 h-8 rounded-md text-sm
//                   ${page === p
//                       ? "bg-blue-600 text-white"
//                       : "border bg-white"
//                     }`}
//                 >
//                   {p}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT - Detail Card */}
//           <div className="bg-white rounded-xl p-4 shadow min-h-[300px]">
//             {!selectedRoom ? (
//               <p className="text-gray-400 text-center mt-20">
//                 Select a room to see details
//               </p>
//             ) : (
//               <RoomDetail room={selectedRoom} />
//             )}
//           </div>
//         </div>
//       </div>
//     </>);
// }

import { useState } from "react";
import { rooms, roomTypes } from "../../container/data/rooms";
import RoomCard from "../RoomCard";
import RoomDetail from "../roomDetail";
import filter from "../../assets/icons/filter.png";
import MatrixCard from "../MatrixCard";
import home from "../../assets/icons/home.png"
export default function Rooms() {
  const [activeType, setActiveType] = useState("All Rooms");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const filteredRooms =
    activeType === "All Rooms"
      ? rooms
      : rooms.filter((r) => r.type === activeType);

  return (
    <>
    
    
    <MatrixCard showshadow="true" icon={home}/>
 
     <div className="p-0 gap-1 inline-flex  max-w-full overflow-hidden rounded-lg">
        {roomTypes.map((type, index) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`
        px-2 py-2 text-sm font-medium whitespace-nowrap
        transition-colors duration-200 rounded-0 m-0 
        
        ${activeType === type
                ? "bg-blue text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }
        ${index === 0 ? "" : ""}
        ${index === roomTypes.length - 1 ? "" : ""}
      `}
          >
            {type}
          </button>
        ))}
      </div>
    <div className="p-4 md:p-6 bg-white min-h-screen">
      {/* Top Buttons */}
     

       {/* Filter Button */}
        <div className="flex justify-between items-center mb-3 w-[65%]">
          <h2 className="font-semibold text-gray-700">
            All Rooms ({filteredRooms.length})
          </h2>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="border px-3 py-1.5 rounded-md text-sm bg-white"
          >
            <span>
              <img src={filter} alt="" />
            </span>
          </button>
        </div>

        {/* Filter Panel */}
       {showFilter && (
  <div className="bg-white p-2 rounded-lg shadow mb-4">
    <h3 className="text-lg font-semibold mb-1 text-gray-700">Apply Filters</h3>
    
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      {/* Dropdowns Container */}
      <div className="flex flex-wrap gap-4 flex-1">
        
        {/* Sort by Hotel Name */}
        <div className="relative w-full md:w-48">
          <select 
            className="block bg-[#F9F9F9] w-full appearance-none  border border-gray-300 rounded-md px-2 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>Sort by hotel name</option>
            <option>Standard</option>
            <option>Deluxe</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        {/* Sort by Status */}
        <div className="relative  w-full md:w-48 v">
          <select 
            className="block bg-[#F9F9F9] w-full appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>Sort by status</option>
            <option>$100 - $150</option>
            <option>$150 - $200</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <div className="w-full md:w-auto flex justify-end">
        <button className="bg-blue hover:bg-gray-300 text-white px-8 py-2 rounded-md font-medium transition-colors w-full md:w-auto">
          Apply Filter
        </button>
      </div>
    </div>
  </div>
)}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT - Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              active={selectedRoom?.id === room.id}
              onClick={() => setSelectedRoom(room)}
            />
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-md text-sm
                  ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "border bg-white"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT - Detail Card */}
        <div className="bg-white rounded-xl p-4 shadow min-h-[300px]">
          {!selectedRoom ? (
            <p className="text-gray-400 text-center mt-20">
              Select a room to see details
            </p>
          ) : (
            <RoomDetail room={selectedRoom} />
          )}
        </div>
      </div>
    </div>
 </> );
}