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

      <div className="max-w-6xl mx-auto my-6 space-y-6">

        {/* ROOM FEATURES SECTION */}
        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue mb-4">Add Features to booking</h3>
          <hr className="mb-6" />
          <Form.Item name="selectedFeatures">
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-6">
                {features.map((item) => (
                  <div key={item.id} className="flex justify-between max-w-96">
                    <p className="text-base text-lightSeconday px-2">{item.title}</p>
                    <img src={deleteIcon} onClick={() => handleDelete(item.id)} className="bg-lightRed rounded-lg p-1.5 h-8 w-8 cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </div>

        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg text-blue font-semibold mb-1">Add Custom Features</h3>
          <hr className="mb-4" />
          <p className="text-lightText text-base font-normal mb-4">Add any additional Features not listed above</p>
          <div className="flex flex-wrap gap-4">
            <Input className="w-full sm:w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" placeholder="Enter Custom feature" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} />
            <button type="button" onClick={() => handleAdd(featureInput, "ROOM_FEATURE")} className="px-8 h-12 text-lg bg-blue text-white rounded-md">Add in the above list</button>
          </div>
        </div>

        <Divider />

        {/* ROOM FACILITIES SECTION */}
        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue mb-4">Add Room Facilities</h3>
          <hr className="mb-6" />
          <Form.Item name="selectedFacilities">
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-6">
                {facilities.map((item) => (
                  <div key={item.id} className="flex justify-between max-w-96">
                    <p className="text-base text-lightSeconday px-2">{item.title}</p>
                    <img src={deleteIcon} onClick={() => handleDelete(item.id)} className="bg-lightRed rounded-lg p-1.5 h-8 w-8 cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </div>

        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg text-blue font-semibold mb-1">Add Custom Facilities</h3>
          <hr className="mb-4" />
          <p className="text-lightText text-base font-normal mb-4">Add any additional facilities not listed above</p>
          <div className="flex flex-wrap gap-4">
            <Input className="w-full sm:w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" placeholder="Enter Custom facility" value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} />
            <button type="button" onClick={() => handleAdd(facilityInput, "ROOM_FACILITY")} className="px-8 h-12 text-lg bg-blue text-white rounded-md">Add in the above list</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingFeatures;