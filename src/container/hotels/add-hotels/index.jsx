import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHotel } from "../../../services/hotel";
import Navbar from "../../../components/Navbar";
import { DEFAULT_IMAGE } from "../../../shared/constant";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Form State Management
  const [formData, setFormData] = useState({
    name: "",
    city: "Karachi",
    location: "",
    email: "",
    policy: "",
    status: "Active",
    amenities: [],
    rooms: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Amenities (Checkboxes)
  const toggleAmenity = (item) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((i) => i !== item)
        : [...prev.amenities, item],
    }));
  };

  // Toggle Rooms (Checkboxes)
  const toggleRoom = (item) => {
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.includes(item)
        ? prev.rooms.filter((i) => i !== item)
        : [...prev.rooms, item],
    }));
  };

  // 2. Form Submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Bheja janay wala data:", formData);
      const res = await createHotel(formData); // Data backend ko bhej rahe hain
      if (res) {
        alert("Hotel Successfully Added!");
        navigate("/admin/hotels"); // Wapis list par le jayein
      }
    } catch (err) {
      console.error("Error adding hotel:", err);
      alert("Kuch masla hua, hotel add nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar />   */}
      <form
        className="min-h-screen w-full md:p-8 font-sans"
        onSubmit={handleSubmit}
      >
        <div className="max-full mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Hotel</h1>
          <p className="text-sm text-gray-500 font-medium">
            Add hotel details and amenities
          </p>
        </div>

        <div className=" mx-auto bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 mb-6 ">
            <h2 className="text-lg font-semibold text-black  ">
              Hotel Profile
            </h2>
            <hr />
          </div>

          <div className="flex items-center justify-between px- mb-6 px-36">
            <div className="flex gap-8 items-center px-6">
              <div className="w-full lg:w-[330px] h-[152px] shrink-0">
                <img
                  src={DEFAULT_IMAGE}
                  className="w-full h-full rounded-[16px] object-cover border border-gray-100"
                  alt={"image"}
                />
              </div>
              <div>
                <h1 className="text-[28px] font-medium text-blue leading-tight">
                  {"Upload Hotel Image"}
                </h1>
                <p className="text-lightSeconday">Make sure image is clear</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="py-2">
                <span className="text-black font-normal underline">
                  Hotel ID
                </span>
              </div>
              <div className="w-24 text-center border py-2 border-havengray   rounded-md ">
                <span className="py-2">301</span>
              </div>
            </div>
          </div>

          <div className="p-6  pt-2 px-44">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
              <div className="space-y-0">
                <label className="text-sm font-bold text-gray-400 ml-1">
                  Hotel Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Grand Plaza Hotel"
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium shadow-sm appearance-none"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">
                  Hotel Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Main Shahra-e-Faisal, Karachi"
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">
                  Hotel Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="info@grandplazahotel.com"
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Amenities Section */}
            <div className="mb-10">
              <h3 className="text-base font-bold text-gray-900 mb-6">
                Amenities Included
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
                {amenitiesList.map((item) => {
                  const checked = formData.amenities.includes(item);
                  return (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(item)}
                        className="w-5 h-5 rounded border-gray-300 text-[#2563eb]"
                      />
                      <span
                        className={`text-sm font-bold ${
                          checked ? "text-[#2563eb]" : "text-gray-400"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rooms Section */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-6">
                Rooms Included
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
                {roomsList.map((room) => {
                  const checked = formData.rooms.includes(room);
                  return (
                    <label
                      key={room}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRoom(room)}
                        className="w-5 h-5 rounded border-gray-300 text-[#2563eb]"
                      />
                      <span
                        className={`text-sm font-bold ${
                          checked ? "text-[#2563eb]" : "text-gray-400"
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

        {/* Buttons */}
        <div className="max-w-6xl mx-auto mt-10 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-3 bg-white border rounded-full text-gray-600 font-bold hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-[#2563eb] text-white rounded-full font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddHotelForm;
