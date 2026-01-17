// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createHotel } from "../../../services/hotel";
// import Navbar from "../../../components/Navbar";
// import { DEFAULT_IMAGE } from "../../../shared/constant";

// const amenitiesList = [
//   "Free WiFi",
//   "Pool",
//   "Parking",
//   "Breakfast",
//   "Cold/Warm water",
//   "Lunch/Dinner",
// ];
// const roomsList = [
//   "One Bed Rooms",
//   "Two Bed Rooms",
//   "Three Bed Rooms",
//   "Luxury Suites",
// ];

// const AddHotelForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // 1. Form State Management
//   const [formData, setFormData] = useState({
//     name: "",
//     city: "Karachi",
//     address: "",
//     email: "",
//     cancellation_policy: "",
//     status: "Active",
//     amenities: [],
//     rooms: [],
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Toggle Amenities (Checkboxes)
//   const toggleAmenity = (item) => {
//     setFormData((prev) => ({
//       ...prev,
//       amenities: prev.amenities.includes(item)
//         ? prev.amenities.filter((i) => i !== item)
//         : [...prev.amenities, item],
//     }));
//   };

//   // Toggle Rooms (Checkboxes)
//   const toggleRoom = (item) => {
//     setFormData((prev) => ({
//       ...prev,
//       rooms: prev.rooms.includes(item)
//         ? prev.rooms.filter((i) => i !== item)
//         : [...prev.rooms, item],
//     }));
//   };

//   // 2. Form Submission logic
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       console.log("Bheja janay wala data:", formData);
//       const res = await createHotel(formData);
//       console.log("Hotel create karne ka response:", res);
//       if (res) {
//         alert("Hotel Successfully Added!");
//       }
//     } catch (err) {
//       console.error("Error adding hotel:", err);
//       alert("Kuch masla hua, hotel add nahi ho saka.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* <Navbar />   */}
//       <form
//         className="min-h-screen w-full md:p-8 font-sans"
//         onSubmit={handleSubmit}
//       >
//         <div className="max-full mx-auto mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Add Hotel</h1>
//           <p className="text-sm text-gray-500 font-medium">
//             Add hotel details and amenities
//           </p>
//         </div>

//         <div className=" mx-auto bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
//           <div className="px-6 py-4 mb-6 ">
//             <h2 className="text-lg font-semibold text-black  ">
//               Hotel Profile
//             </h2>
//             <hr />
//           </div>

//           <div className="flex items-center justify-between px- mb-6 px-36">
//             <div className="flex gap-8 items-center px-6">
//               <div className="w-full lg:w-[330px] h-[152px] shrink-0">
//                 <img
//                   src={DEFAULT_IMAGE}
//                   className="w-full h-full rounded-[16px] object-cover border border-gray-100"
//                   alt={"image"}
//                 />
//               </div>
//               <div>
//                 <h1 className="text-[28px] font-medium text-blue leading-tight">
//                   {"Upload Hotel Image"}
//                 </h1>
//                 <p className="text-lightSeconday">Make sure image is clear</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="py-2">
//                 <span className="text-black font-normal underline">
//                   Hotel ID
//                 </span>
//               </div>
//               <div className="w-24 text-center border py-2 border-havengray   rounded-md ">
//                 <span className="py-2">301</span>
//               </div>
//             </div>
//           </div>

//           <div className="p-6  pt-2 px-44">
//             {/* Form Fields Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
//               <div className="space-y-0">
//                 <label className=" font-medium text-lightSeconday ml-1">
//                   Hotel Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter Hotel Name"
//                   className="w-full h-12 p-2  border border-lightSeconday rounded-md  text-extradark font-medium shadow-sm"
//                 />
//               </div>

//               <div className="space-y-0">
//                 <label className=" font-medium text-lightSeconday ml-1">
//                   City
//                 </label>
//                 <select
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   // className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium shadow-sm appearance-none"
//                   className="w-full h-12 p-2  border border-lightSeconday rounded-md  text-extradark font-medium shadow-sm"
//                 >
//                   <option value="Karachi">Karachi</option>
//                   <option value="Lahore">Lahore</option>
//                   <option value="Islamabad">Islamabad</option>
//                 </select>
//               </div>

//               <div className="space-y-0">
//                 <label className=" font-medium text-lightSeconday ml-1">
//                   Hotel Location
//                 </label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   placeholder="Enter location"
//                   className="w-full h-12 p-2  border border-lightSeconday rounded-md  text-extradark font-medium shadow-sm"
//                 />
//               </div>

//               <div className="space-y-0">
//                 <label className=" font-medium text-lightSeconday ml-1">
//                   Hotel Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter Email Address"
//                   className="w-full h-12 p-2  border border-lightSeconday rounded-md  text-extradark font-medium shadow-sm"
//                 />
//               </div>
//               <div className="space-y-0">
//                 <label className=" font-medium text-lightSeconday ml-1">
//                   Cancellation Policy
//                 </label>
//                 <input
//                   type="text"
//                   name="cancellation_policy"
//                   value={formData.cancellation_policy}
//                   onChange={handleInputChange}
//                   placeholder="Enter policy"
//                   className="w-full h-12 p-2  border border-lightSeconday rounded-md  text-extradark font-medium shadow-sm"
//                 />
//               </div>
//               <div className="space-y-0">
//                 <label className=" font-medium text-lightSeconday ml-1">
//                   Hotel Status
//                 </label>
//                 <select
//                   name="city"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   // className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium shadow-sm appearance-none"
//                   className="w-full h-12 p-2  border border-lightSeconday rounded-md  text-extradark font-medium shadow-sm"
//                 >
//                   <option value="Karachi">active</option>
//                   <option value="Lahore">Inactive</option>
//                   <option value="Islamabad">Maintenance</option>
//                 </select>
//               </div>
//             </div>

//             {/* Amenities Section */}
//             <div className="mb-10">
//               <h3 className="text-base font-semibold text-extradark mb-6">
//                 Amenities Included
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
//                 {amenitiesList.map((item) => {
//                   const checked = formData.amenities.includes(item);
//                   return (
//                     <label
//                       key={item}
//                       className="flex items-center gap-3 cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={() => toggleAmenity(item)}
//                         className="w-5 h-5 rounded border-lightGray text-blue checked:accent-blue"
//                       />
//                       <span
//                         className={`text-sm font-medium ${
//                           checked ? "text-blue" : "text-lightText"
//                         }`}
//                       >
//                         {item}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Rooms Section */}
//             <div className="mb-4">
//               {/* <h3 className="text-base font-bold text-gray-900 mb-6"> */}
//               <h3 className="text-base font-semibold text-extradark mb-6">
//                 Rooms Included
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
//                 {roomsList.map((room) => {
//                   const checked = formData.rooms.includes(room);
//                   return (
//                     <label
//                       key={room}
//                       className="flex items-center gap-3 cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={() => toggleRoom(room)}
//                         // className="w-5 h-5 rounded border-gray-300 text-blue"
//                         className="w-5 h-5 rounded border-lightGray text-blue checked:accent-blue"
//                       />
//                       <span
//                         className={`text-sm font-medium ${
//                           checked ? "text-blue" : "text-lightText"
//                         }`}
//                       >
//                         {room}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="  flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}

//             className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             // className="px-10   py-10 bg-blue text-white rounded-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-all"
//             className="bg-blue px-10 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-all"
//           >
//             {loading ? "Saving..." : "Save"}
//             {/* Save */}
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default AddHotelForm;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHotel,
  getHotelById,
  updateHotel,
} from "../../../services/hotel";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";

// const amenitiesList = [
//   "Free WiFi",
//   "Pool",
//   "Parking",
//   "Breakfast",
//   "Cold/Warm water",
//   "Lunch/Dinner",
// ];

const roomsList = [
  "One Bed Rooms",
  "Two Bed Rooms",
  "Three Bed Rooms",
  "Luxury Suites",
];

const HotelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 detect edit mode
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    city: "Karachi",
    address: "",
    email: "",
    cancellation_policy: "",
    status: "Active",
    amenities: [], // ✅ AMENITY FEATURE IDs
    rooms: [],
  });

  /* =============================
     FETCH HOTEL (EDIT MODE)
  ============================== */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchHotel = async () => {
      setFetching(true);
      try {
        const res = await getHotelById(id);
        const hotel = res.data;

        setFormData({
          name: hotel.name || "",
          city: hotel.city || "Karachi",
          address: hotel.address || "",
          email: hotel.email || "",
          cancellation_policy: hotel.cancellation_policy || "",
          status: hotel.isActive ? "Active" : "Inactive",
          amenities: Array.isArray(hotel.amenities)
            ? hotel.amenities.map((a) => a.id)
            : [],

          rooms: Array.isArray(hotel.roomsIncluded)
            ? hotel.roomsIncluded.map((r) => r.id)
            : [],
        });
      } catch (err) {
        console.error("Failed to load hotel:", err);
        alert("Hotel load nahi ho saka");
      } finally {
        setFetching(false);
      }
    };

    fetchHotel();
  }, [id, isEditMode]);

  useEffect(() => {
    // if (!isEditMode) return;

    const fetchFeatures = async () => {
      setFetching(true);
      try {
        const res = await getAllFeature("AMENITY");
        const features = res.data;

        setAmenitiesList(features);
      } catch (err) {
        console.error("Failed to load hotel:", err);
        alert("Hotel load nahi ho saka");
      } finally {
        setFetching(false);
      }
    };

    fetchFeatures();
  }, []);

  /* =============================
     INPUT HANDLERS
  ============================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (id) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((i) => i !== id)
        : [...prev.amenities, id],
    }));
  };

  const toggleRoom = (id) => {
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.includes(id)
        ? prev.rooms.filter((i) => i !== id)
        : [...prev.rooms, id],
    }));
  };

  /* =============================
     SUBMIT (ADD / UPDATE)
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      city: formData.city,
      address: formData.address,
      email: formData.email,
      cancellation_policy: formData.cancellation_policy,
      status: formData.status,

      featureIds: [...formData.amenities, ...formData.rooms],
    };

    try {
      if (isEditMode) {
        await updateHotel(id, payload);
        alert("Hotel updated successfully");
      } else {
        await createHotel(payload);
        alert("Hotel added successfully");
      }

      navigate("/admin/hotels");
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-20 text-center text-blue font-semibold">
        Loading hotel details...
      </div>
    );
  }

  /* =============================
     UI
  ============================== */
  return (
    <form
      className="min-h-screen w-full md:p-8 font-sans"
      onSubmit={handleSubmit}
    >
      <div>
        <div
          className="flex  items-center gap-4 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <div>
            <img src={arrowImg} alt="arrowImg" />
          </div>
          <p className="text-darkGray underline font-medium text-lg mt-3">
            Back
          </p>
        </div>
        <hr className="-mt-4" />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Hotel" : "Add Hotel"}
        </h1>
        <p className="text-lg text-darkGray font-medium">
          {isEditMode
            ? "Edit hotel details and amenities"
            : "Add hotel details and amenities"}
        </p>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 ">
        <div className="px-6 py-4 mb-6 ">
          <h2 className="text-lg font-semibold text-black  ">Hotel Profile</h2>
          <hr />
        </div>
        <div className="p-6 px-36 pb-14">
          {/* IMAGE */}
          <div className="flex   justify-between mb-10">
            <div className="flex items-center gap-20 ">
              <img
                src={DEFAULT_IMAGE}
                className="w-[330px] h-[152px] rounded-[16px] object-cover border"
                alt="hotel"
              />
              <div>
                <h2 className="text-xl font-semibold text-blue">
                  Upload Hotel Image
                </h2>
                <p className="text-lightSeconday">Make sure image is clear</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="py-2">
                <span className="text-black font-semibold underline">
                  Hotel ID
                </span>
              </div>
              <div className="w-24 text-center border py-2 border-havengray   rounded-md ">
                <span className="py-2">301</span>
              </div>
            </div>
          </div>

          {/* FORM GRID */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Hotel Name */}
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">
                Hotel Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                placeholder="Enter hotel name"
              />
            </div>

            {/* City */}
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>

            {/* Hotel Location */}
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">
                Hotel Location
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                placeholder="Enter location"
              />
            </div>

            {/* Hotel Email */}
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">
                Hotel Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                placeholder="Enter email"
              />
            </div>

            {/* Cancellation Policy */}
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">
                Cancellation Policy
              </label>
              <input
                type="text"
                name="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={handleInputChange}
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                placeholder="Enter policy"
              />
            </div>

            {/* Status */}
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* AMENITIES */}
          <h3 className="font-semibold mb-4">Amenities Included</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {amenitiesList.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(item.id)}
                  onChange={() => toggleAmenity(item.id)}
                  className="w-5 h-5 rounded border-lightGray text-blue checked:accent-blue"
                />
                <span
                  className={`text-sm font-medium ${
                    formData.amenities.includes(item.id)
                      ? "text-blue"
                      : "text-lightText"
                  }`}
                >
                  {item.title}
                </span>
                {/* {item} */}
              </label>
            ))}
          </div>

          {/* ROOMS */}
          <h3 className="font-semibold mb-4">Rooms Included</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roomsList.map((room) => (
              <label key={room} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.rooms.includes(room)}
                  onChange={() => toggleRoom(room)}
                  className="w-5 h-5 rounded border-lightGray text-blue checked:accent-blue"
                />
                <span
                  className={`text-sm font-medium ${
                    formData.rooms.includes(room)
                      ? "text-blue"
                      : "text-lightText"
                  }`}
                >
                  {room}
                </span>
                {/* {room} */}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-10 py-2 bg-blue text-white rounded-md"
        >
          {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
