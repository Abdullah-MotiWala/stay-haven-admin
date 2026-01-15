import React from 'react';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import leftangle from '../../../assets/icons/leftangle.png'
const amenitiesList = [
  "Free WiFi",
  "Pool",
  "Parking",
  "Breakfast",
  "Cold/Warm water",
  "Lunch/Dinner",
];

const roomsList = [
  "One Bed Rooms",
  "Two Bed Rooms",
  "Three Bed Rooms",
  "Luxury Suites",
];
const AddHotelForm = () => {

  const [amenities, setAmenities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const toggleRoom = (item) => {
    setRooms((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <>

      <form
        className="min-h-screen w-full md:p-8 font-sans"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submitted");
        }}
      >
        <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
          <img src={leftangle} alt="" />
          <button className='text-gray-600 flex'>Back</button>

        </div>
        {/* Page Title */}
        <div className="max-full mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add / Edit Hotel</h1>
          <p className="text-sm text-gray-500 font-medium">Edit hotel details and amenities</p>
        </div>

        {/* Main White Card */}
        <div className="max-full mx-auto bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="p-4 text-lg font-bold text-gray-900 mb-6 border-b pb-4 border-gray-100">Hotel Profile</h2>

          <div className="p-6 md:p-[10%] pt-2 ">

            {/* Header Section: Image Upload & Hotel ID */}
            <div className="flex flex-col p-8 md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-56 h-32 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400"
                    alt="Hotel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <button className="text-[#2563eb] text-lg font-bold hover:underline block">Upload Hotel Image</button>
                  <p className="text-xs text-gray-400 font-medium mt-1">Make sure image is clear</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700 underline decoration-2 underline-offset-4">Hotel ID</span>
                <div className="bg-[#F3F4F6] px-6 py-2 rounded-xl text-sm font-bold text-gray-800 border border-gray-100">
                  321-02
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
              {/* Row 1 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Hotel Name</label>
                <input type="text" placeholder="Grand Plaza Hotel" className="w-full placeholder-dark p-3 bg-white border border-[#6C7293] rounded-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">City</label>
                <select className="w-full  p-3 bg-white border border-[#6C7293] rounded-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium  appearance-none">
                  <option>Karachi / Lahore / Islamabad</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Hotel Location</label>
                <input type="text" placeholder="Main Shahra-e-Faisal, Karachi" className="w-full placeholder-dark   p-4 bg-white border border-[#6C7293] rounded-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium " />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Hotel Email</label>
                <input type="email" placeholder="info@grandplazahotel.com" className="w-full placeholder-dark p-4 bg-white border border-[#6C7293] rounded-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium " />
              </div>

              {/* Row 3 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Cancellation Policy</label>
                <input type="text" placeholder="Upto  24 hours before checkin" className="w-full  placeholder-dark p-4 bg-white border border-[#6C7293] rounded-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium " />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Hotel Status</label>
                <select className="w-full   p-4 bg-white border border-[#6C7293] rounded-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium  appearance-none">
                  <option>Active / Inactive / Maintenance</option>
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-10">
              <h3 className="text-base font-bold text-gray-900 mb-6">
                Amenities Included
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
                {amenitiesList.map((item) => {
                  const checked = amenities.includes(item);

                  return (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(item)}
                        className="w-5 h-5 rounded accent-blue border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                      />

                      <span
                        className={`text-sm  ${checked ? "text-[#2563eb]" : "text-blue-300"
                          }`}
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rooms */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-6">
                Rooms Included
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4">
                {roomsList.map((room) => {
                  const checked = rooms.includes(room);

                  return (
                    <label
                      key={room}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRoom(room)}
                        className="w-5 h-5 accent-blue rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                      />

                      <span
                        className={`text-sm ${checked ? "text-[#2563eb]" : "text-blue-300"
                          }`}
                      >
                        {room}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

         <div className="w-full max-w-[1200px] mx-auto mt-8 mb-10 px-4 md:px-0">
                <div className="flex justify-end items-center gap-4">

                    {/* White Button (Cancel/Back) */}
                    <button
                        type="button"
                        onClick={() => console.log("Cancel Clicked")}
                        className="px-10 py-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-[15px] 
                     hover:bg-[#0A5BE2] hover:text-white hover:border-gray-400 transition-all duration-200 shadow-sm active:scale-95"
                    >
                        Back
                    </button>

                    {/* Blue Button (Save/Update) */}
                    <button
                        type="submit"
                        onClick={() => console.log("Save Clicked")}
                        className="px-10 py-4 rounded-lg bg-blue  text-white font-bold text-[15px] 
                     hover:bg-white hover:text-[#0A5BE2]  shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                        Save Changes
                    </button>

                </div>
            </div>

      </form>
    </>
  );
};

export default AddHotelForm;