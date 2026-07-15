import React, { useState, useEffect } from "react";
import { Form, Checkbox, Input, Spin } from "antd";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";
import { getFeaturesByTypeApi, createFeatureApi, deleteFeatureApi } from "../../../services/setting";
import { openNotification } from "../../../network/notification";

const RoomRules = () => {
  const [roomRules, setRoomRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customValue, setCustomValue] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRoomRules = async () => {
    try {
      const res = await getFeaturesByTypeApi("POLICY");
      const data = res?.data?.data || res?.data;
      if (Array.isArray(data)) {
        setRoomRules(data);
      }
    } catch (err) {
      console.error("Failed to fetch room rules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomRules();
  }, []);

  const handleAddCustom = async () => {
    if (!customValue.trim()) return;
    setActionLoading(true);
    try {
      const payload = { title: customValue, type: "POLICY" };
      await createFeatureApi(payload);
      setCustomValue("");
      await fetchRoomRules();
      openNotification("success", "Rule added", "Room rule added successfully");
    } catch (err) {
      openNotification("error", "Error", "Failed to add room rule");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeatureApi(id);
      await fetchRoomRules();
      openNotification("success", "Rule removed", "Room rule removed successfully");
    } catch (err) {
      openNotification("error", "Error", "Failed to delete");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Room Rules & Policies</h3>
      <div className="max-w-6xl mx-auto my-6 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Select all rules & policies for your rooms</h3>

        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue mb-4">Room Rules & Policies</h3>
          <hr className="mb-6" />
          {loading ? (
            <Spin tip="Loading Room Rules..." />
          ) : (
            <Form.Item name="selectedFeatures">
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-6">
                  {roomRules.map((item) => (
                    <div key={item.id} className="flex justify-between max-w-64">
                      <p className="text-base text-lightSeconday px-2">{item.title}</p>
                      <img src={deleteIcon} alt="delete" onClick={() => handleDelete(item.id)} className="bg-lightRed rounded-lg p-1.5 h-8 w-8 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>
          )}
        </div>

        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg text-blue font-semibold mb-1">Add Custom Room Rule</h3>
          <hr className="mb-4" />
          <p className="text-lightText text-base font-normal mb-4">Add any additional rules or policies not listed above</p>
          <div className="flex flex-wrap gap-4">
            <Input className="w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" placeholder="Enter Custom Room Rule" value={customValue} onChange={(e) => setCustomValue(e.target.value)} onPressEnter={handleAddCustom} />
            <button type="button" disabled={actionLoading} className={`px-8 h-12 bg-blue text-white rounded-md font-semibold ${actionLoading ? "opacity-50" : ""}`} onClick={handleAddCustom}>
              {actionLoading ? "Adding..." : "Add in the above list"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomRules;
