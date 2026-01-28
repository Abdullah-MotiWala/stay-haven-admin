import React, { useState, useEffect } from "react";
import { Form, Checkbox, Input, Spin, message } from "antd";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";
import { getFeaturesByTypeApi, createFeatureApi, deleteFeatureApi } from "../../../services/setting";
import { openNotification } from "../../../network/notification";

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customValue, setCustomValue] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAmenities = async () => {
    try {
      const res = await getFeaturesByTypeApi("AMENITY");
      const data = res?.data?.data || res?.data;
      if (Array.isArray(data)) {
        setAmenities(data);
      }
    } catch (err) {
      console.error("Failed to fetch amenities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleAddCustom = async () => {
    if (!customValue.trim()) return;
    setActionLoading(true);
    try {
      const payload = { title: customValue, type: "AMENITY" };
      await createFeatureApi(payload);
      setCustomValue(""); 
      await fetchAmenities();
      openNotification("success", "Amenties added", "Amenity added successfully");
    } catch (err) {
      openNotification("error", "Error", "Failed to add amenity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeatureApi(id);
      await fetchAmenities(); 
      openNotification("success", "Amenties removed", "Amenity removed");
    } catch (err) {
      openNotification("error", "Error", "Failed to delete");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Amenities</h3>

      <div className="max-w-6xl mx-auto my-20">
        <h3 className="text-lg font-semibold mb-8">
          Select all amenities available at your hotel
        </h3>

        {loading ? <Spin tip="Loading Amenities..." /> : (
          <Form.Item name="selectedFeatures">
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-10 ">
                {amenities.map((item) => (
                  <div key={item.id} className="flex justify-between max-w-64">
                    <p value={item.id} className="text-base text-lightSeconday px-2">
                      {item.title}
                    </p>
                    
                    <img
                      src={deleteIcon}
                      alt="delete"
                      onClick={() => handleDelete(item.id)} 
                      className="bg-lightRed rounded-lg p-1.5 h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        )}

        <div className="mt-14">
          <h3 className="text-lg text-extradark font-semibold">Add Custom Amenity</h3>
          <p className="text-lightText text-base font-normal">Add any additional amenities not listed above</p>
          <div className="flex flex-wrap gap-4">
            <Input
              className="w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
              placeholder="Enter Custom Amenity"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onPressEnter={handleAddCustom} 
            />
            <button
              type="button" 
              disabled={actionLoading}
              className={`px-8 h-12 bg-blue text-white rounded-md font-semibold ${actionLoading ? 'opacity-50' : ''}`}
              onClick={handleAddCustom} 
            >
              {actionLoading ? "Adding..." : "Add in the above list"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;