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

import { useState, useEffect } from "react";
import { rooms, roomTypes } from "../../container/data/rooms";
import RoomCard from "../RoomCard";
import RoomDetail from "../roomDetail";
import filter from "../../assets/icons/filter.png";
import MatrixCard from "../MatrixCard";
import home from "../../assets/icons/home.png"
import search from "../../assets/icons/search.png"
import right_arrow from "../../assets/icons/right_arrow.png"
import { Pagination, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom";
// import { getAllHotels, deleteHotel, getStats } from "../../services/hotel";
import { getAllRooms, getStats, deleteRoom } from "../../services/rooms"
import home1 from "../../assets/icons/home-1.png";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/icons/home-3.png";
import home4 from "../../assets/icons/home-4.png";
import { openNotification } from "../../network/notification";
export default function Rooms() {
  const [activeType, setActiveType] = useState("All Rooms");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);



  const navigate = useNavigate();
  const [roomsdata, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    console.log("UseEffect Run Times");
    const fetchData = async () => {
      try {
        const res = await getAllRooms();
        setRooms(res.data, "rooms data");
        setRefresh(false);
        setLoading(true);
      } catch (err) {
        console.error("Data fetch error", err);
      }
    };

    fetchData();
  }, []);
  console.log(roomsdata, "this is rooms data ")
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        console.log(res.data, "Rooms===");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };

    fetchStats();
  }, []);

  const filteredRooms =
    activeType === "All Rooms"
      ? rooms
      : rooms.filter((r) => r.type === activeType);



  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteRoom(id);
        setRooms(roomsdata.filter((room) => room.id !== id));
        openNotification("success", "Hotel deleted successfully");
      } catch (err) {
        console.error("Any Problem in deleteing", err);
        openNotification("error", "Internal Server Error");
      }
    }
  };

  const cardsData = [
    {
      title: "Total Rooms",
      value: stats?.totalRooms,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: "+12%",
      trendText: "vs last week",
      showTrend: true,
    },
    {
      title: "Available",
      value: stats?.availableRooms,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: home2,
    },
    {
      title: "Occupied",
      value: stats?.occupiedRooms,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: home3,
    },
    {
      title: "Maintenance",
      value: stats?.maintenanceRooms,
      bg: "#F3F4FB",
      iconBg: "#CBCEE7",
      image: home4,
    },
  ];

  return (
    <>


      <MatrixCard showshadow="true" data={cardsData} icon={home} />

      <div className="p-0 ml-3 gap-[2px] inline-flex   overflow-hidden rounded-lg">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT COLUMN: Header, Filters, and Cards (Occupies 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-[#000000] text-lg">
              All Rooms ({filteredRooms.length})
            </h2>
            {/* Header & Filter Toggle Button */}
            <div className="flex justify-between items-center bg-white ">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <img src={search} className="w-4 h-4" />
                </span>
                <input type="text" className="border boeder-2 rounded-md bg-[#F9FAFC] font-medium px-5 py-2" placeholder="Search" />

              </div>

              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`border px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${showFilter ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white text-gray-600"
                  }`}
              >
                <img src={filter} alt="filter" className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Panel (Inline inside Left Column) */}
            {showFilter && (
              <div className="bg-white p-3 rounded-xlg shadow-md border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-[18px] font-medium">Apply Filter</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* Sort by Hotel */}
                  <div className="space-y-1.5">
                    {/* <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel Name</label> */}
                    <div className="relative">
                      <select className="block font-medium bg-[#F9F9F9] w-full appearance-none border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="" disabled selected>Sort by Hotel Name</option>
                        <option>Standard</option>
                        <option>Deluxe</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        {/* <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg> */}
                        <img src={right_arrow} alt="" />

                      </div>
                    </div>
                  </div>

                  {/* Sort by Status/Price */}
                  <div className="space-y-1.5">
                    {/* <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status/Price</label> */}
                    <div className="relative">
                      <select className="block font-medium bg-[#F9F9F9] w-full appearance-none border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="" disabled selected>Sort by Status </option>
                        <option>$100 - $150</option>
                        <option>$150 - $200</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        {/* //  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg> */}
                        <img src={right_arrow} alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button className="bg-[#0A5BE2] hover:bg-blue text-white px-2 py-2.5 rounded-md font-semibold transition-all text-sm h-[42px]">
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Room Cards List */}
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  active={selectedRoom?.id === room.id}
                  onClick={() => setSelectedRoom(room)}
                />
              ))}

              {/* Pagination */}
              <div className="flex justify-center gap-2 py-4">
                <ConfigProvider
                  theme={{
                    components: {
                      Pagination: {
                        itemActiveBg: '#0A5BE2',      // Background Blue
                        itemActiveColor: '#FFFFFF',   // Selected Text White
                        colorPrimary: '#0A5BE2',      // Border color
                        colorPrimaryHover: '#0A5BE2', // Hover par border color
                        colorPrimaryActive: '#0A5BE2',
                      },
                    },
                  }}
                >
                  <Pagination defaultCurrent={1} total={20} className="custom-pagination" />
                </ConfigProvider>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Detail Card (Sticky for better UX) */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
              {!selectedRoom ? (
                <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-gray-500 font-medium">Select a room to see details</p>
                  <p className="text-gray-400 text-sm mt-1">Click on any card from the list</p>
                </div>
              ) : (
                <RoomDetail room={selectedRoom} />
              )}
            </div>
          </div>

        </div>
      </div>
    </>);
}