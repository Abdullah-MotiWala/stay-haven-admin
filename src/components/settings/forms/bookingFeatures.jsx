import React, { useState, useEffect } from "react";
import { Form, Checkbox, Input, Spin, Divider } from "antd";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";
import { getFeaturesByTypeApi, createFeatureApi, deleteFeatureApi } from "../../../services/setting";
import { openNotification } from "../../../network/notification";

const BookingFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [featureInput, setFeatureInput] = useState("");
  const [facilityInput, setFacilityInput] = useState("");

  const fetchAllData = async () => {
    try {
      const [featRes, facRes] = await Promise.all([
        getFeaturesByTypeApi("ROOM_FEATURE"),
        getFeaturesByTypeApi("ROOM_FACILITY"),
      ]);
      setFeatures(featRes?.data?.data || featRes.data);
      setFacilities(facRes?.data?.data || facRes.data);
    } catch (err) {
      console.error("Failed to load features/facilities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAdd = async (title, type) => {
    if (!title.trim()) return;
    try {
      await createFeatureApi({ title, type });
      if (type === "ROOM_FEATURE") setFeatureInput("");
      else setFacilityInput("");
      
      await fetchAllData(); 
      openNotification("success", "Features added", `${title} added successfully`);
    } catch (err) {
      openNotification("error", "Error", "Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeatureApi(id);
      await fetchAllData();
      openNotification("success", "Features removed", "Item removed successfully");
    } catch (err) {
      openNotification("error", "Error", "Failed to delete");
    }
  };

  if (loading) return <Spin className="flex justify-center my-10" />;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Booking Features</h3>

      <div className="max-w-6xl mx-auto my-20 space-y-24">
        
        {/* ROOM FEATURES SECTION */}
        <section>
          <h3 className="text-lg font-semibold mb-8">Add Features to booking</h3>
          <Form.Item name="selectedFeatures"> 
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
                {features.map((item) => (
                  <div key={item.id} className="flex justify-between max-w-96">
                    <p value={item.id} className="text-base text-lightSeconday px-2">
                      {item.title}
                    </p>
                    <img 
                        src={deleteIcon} 
                        onClick={() => handleDelete(item.id)}
                        className="bg-lightRed rounded-lg px-2  cursor-pointer" 
                    />
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
          
          <div className="mt-14">
             <h3 className="text-lg text-extradark font-semibold">Add Custom Features</h3>
              <p className="text-lightText text-base font-normal">Add any additional Features not listed above</p>
            <Input 
                className="w-full sm:w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" 
                placeholder="Enter Custom feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
            />
            <button 
                type="button" 
                onClick={() => handleAdd(featureInput, "ROOM_FEATURE")} 
                className="px-8 mt-2 h-12 ml-6 text-lg py-2 bg-blue text-white rounded-md"
            >
                 Add in the above list
            </button>
          </div>
        </section>

        <Divider />

        {/* ROOM FACILITIES SECTION */}
        <section>
          <h3 className="text-lg font-semibold mb-8">Add Room Facilities</h3>
          <Form.Item name="selectedFeatures"> 
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10 ">
                {facilities.map((item) => (
                  <div key={item.id} className="flex justify-between max-w-96">
                    <p value={item.id} className="text-base text-lightSeconday px-2">
                      {item.title}
                    </p>
                    <img 
                        src={deleteIcon} 
                        onClick={() => handleDelete(item.id)} 
                        className="bg-lightRed rounded-lg px-2  cursor-pointer" 
                    />
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
          
          <div className="mt-14">
             <h3 className="text-lg text-extradark font-semibold">Add Custom Facilities</h3>
          <p className="text-lightText text-base font-normal">Add any additional facilities not listed above</p>
            <Input 
                className="w-full sm:w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" 
                placeholder="Enter Custom facility"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
            />
            <button 
                type="button" 
                onClick={() => handleAdd(facilityInput, "ROOM_FACILITY")} 
                className="px-8 mt-2 h-12 ml-6 text-lg py-2 bg-blue text-white rounded-md"
            >
                 Add in the above list
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BookingFeatures;