import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import MatrixCard from '../../../components/MatrixCard';
import Breadcrumb from '../../../components/Breadcrumb';
import HotelDirectory from '../../../components/Table'; // Ensure path is correct
import { getAllHotels, deleteHotel } from "../../../services/hotel";

const HotelsListing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();

        setHotels(res.data || []); 
        
      } catch (err) {
        console.error("Data fetch karne mein masla:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteHotel(id);

        setHotels(hotels.filter(hotel => hotel.id !== id));
        alert("Hotel deleted");
      } catch (err) {
        console.error("Any Problem in deleteing", err);
        alert("Can not be deleted.");
      }
    }
  };

  return (
    <div className="p-6 bg-[#F4F7FE] min-h-screen">
      <Navbar />
      
      <div className="mt-4">
        <Breadcrumb title="Hotels" />
      </div>

      <div className="mt-6">
        <MatrixCard />
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mt-8">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600 font-medium">Loading Hotels...</span>
          </div>
        ) : (
          <HotelDirectory data={hotels} onDelete={handleDelete}/>
        )}
      </div>
    </div>
  );
};

export default HotelsListing;