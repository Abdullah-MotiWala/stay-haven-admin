import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createHotel, getHotelById, updateHotel } from "../../../services/hotel";
import Navbar from '../../../components/Navbar';

const amenitiesList = ["Free WiFi", "Pool", "Parking", "Breakfast", "Cold/Warm water", "Lunch/Dinner"];
const roomsList = ["One Bed Rooms", "Two Bed Rooms", "Three Bed Rooms", "Luxury Suites"];

const HotelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id && id !== 'new';
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: 'Karachi',
    country: 'Pakistan',
    address: '',
    email: '',
    pricePerNight: '',
    cancellation_policy: '',
    status: 'Active',
    amenities: [],
    rooms: []
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchHotelData = async () => {
        try {
          setLoading(true);
          const res = await getHotelById(id);
          const hotel = res.data;
          setFormData({
            ...hotel,
            status: hotel.isActive ? 'Active' : 'Inactive',
            pricePerNight: hotel.pricePerNight || hotel.price_per_night || '',
            amenities: hotel.amenities?.map(a => typeof a === 'string' ? a : a.name) || [],
            rooms: hotel.room_include?.map(r => typeof r === 'string' ? r : r.name) || [],
          });
          if (hotel.imageUrl) setSelectedImage(hotel.imageUrl);
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchHotelData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const toggleItem = (listName, item) => {
    setFormData(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).includes(item)
        ? prev[listName].filter(i => i !== item)
        : [...(prev[listName] || []), item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price_per_night: Number(formData.pricePerNight), // Matching DB
      pricePerNight: Number(formData.pricePerNight),
      isActive: formData.status === 'Active', // Mapping to boolean
      room_include: formData.rooms 
    };

    try {
      if (isEditMode) await updateHotel(id, payload);
      else await createHotel(payload);
      alert("Hotel Saved Successfully!");
      navigate('/admin/hotels');
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      alert("Error saving data. Please check required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen pb-12 font-sans text-[#1A1A1A]">
      <Navbar />
      
      <div className="max-w-[1250px] mx-auto px-8 pt-8">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 cursor-pointer hover:text-blue-600 w-fit" onClick={() => navigate(-1)}>
          <span className="text-lg">←</span> <span>Back</span>
        </div>

        <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-8">Add / Edit Hotel</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100">
          <div className="p-10">
            <h2 className="text-lg font-bold mb-10 text-[#1B2559]">Hotel Profile</h2>

            {/* --- Image Section --- */}
            <div className="flex items-center gap-10 mb-12">
              <div className="relative group">
                <div className="w-[320px] h-[180px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-gray-400 text-xs italic">Upload Hotel Image</p>
                    </div>
                  )}
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-[#0052FF] font-bold text-xl cursor-pointer">Upload Hotel Image</h3>
                <p className="text-gray-400 text-sm mt-1">Make sure image is clear</p>
              </div>

              {isEditMode && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 tracking-widest">Hotel ID</span>
                  <div className="bg-[#F4F7FE] px-5 py-2 rounded-xl text-sm font-mono font-bold text-gray-600">
                    {id.slice(0, 8)}
                  </div>
                </div>
              )}
            </div>

            {/* --- Input Fields --- */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-16">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Hotel Name *</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Grand Plaza Hotel" className="w-full p-3.5 border border-gray-200 rounded-xl bg-[#F4F7FE] focus:bg-white focus:border-[#0052FF] outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Price Per Night ($) *</label>
                <input required type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} placeholder="150" className="w-full p-3.5 border border-gray-200 rounded-xl bg-[#F4F7FE] focus:bg-white outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">City *</label>
                <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-xl bg-[#F4F7FE] focus:bg-white outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Country *</label>
                <input required name="country" value={formData.country} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-xl bg-[#F4F7FE] focus:bg-white outline-none" />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-gray-500">Hotel Location (Address) *</label>
                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-xl bg-[#F4F7FE] focus:bg-white outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-xl bg-[#F4F7FE] outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* --- Amenities & Rooms (Both Added Together) --- */}
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h3 className="font-bold text-lg mb-6 text-[#1B2559]">Ameneties Included</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  {amenitiesList.map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={formData.amenities.includes(item)} onChange={() => toggleItem('amenities', item)} className="w-5 h-5 rounded accent-[#0052FF]" />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-6 text-[#1B2559]">Rooms Included</h3>
                <div className="grid grid-cols-1 gap-y-4">
                  {roomsList.map(room => (
                    <label key={room} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={formData.rooms.includes(room)} onChange={() => toggleItem('rooms', room)} className="w-5 h-5 rounded accent-[#0052FF]" />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600">{room}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-gray-50 p-8 flex justify-end gap-5">
            <button type="button" onClick={() => navigate(-1)} className="px-10 py-2.5 border border-gray-200 rounded-full font-bold text-gray-400 hover:bg-gray-50">Back</button>
            <button type="submit" disabled={loading} className="px-10 py-2.5 bg-[#0052FF] text-white rounded-full font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? "Saving..." : "Save Chnages"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelForm;