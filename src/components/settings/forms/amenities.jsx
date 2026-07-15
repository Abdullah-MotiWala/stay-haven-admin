import React, { useState, useEffect, useRef } from "react";
import { Form, Checkbox, Input, Spin } from "antd";
import { ImagePlus, Trash2 } from "lucide-react";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";
import { getFeaturesByTypeApi, createFeatureApi, deleteFeatureApi, updateFeatureApi } from "../../../services/setting";
import { uploadSingleMedia } from "../../../services/uploads";
import { openNotification } from "../../../network/notification";

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customValue, setCustomValue] = useState("");
  const [customIcon, setCustomIcon] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [uploadingNew, setUploadingNew] = useState(false);
  const newIconRef = useRef(null);
  const iconRefs = useRef({});

  const fetchAmenities = async () => {
    try {
      const res = await getFeaturesByTypeApi("AMENITY");
      const data = res?.data?.data || res?.data;
      if (Array.isArray(data)) setAmenities(data);
    } catch {
      openNotification("error", "Failed to fetch amenities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAmenities(); }, []);

  // Upload icon for existing amenity
  const handleIconUpload = async (id, file) => {
    if (!file) return;
    setUploadingIdx(id);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadSingleMedia(formData);
      const url = res?.data?.data?.url;
      if (!url) throw new Error();
      await updateFeatureApi(id, { icon: url });
      await fetchAmenities();
      openNotification("success", "Icon updated");
    } catch {
      openNotification("error", "Failed to upload icon");
    } finally {
      setUploadingIdx(null);
    }
  };

  // Upload icon for new amenity
  const handleNewIconUpload = async (file) => {
    if (!file) return;
    setUploadingNew(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadSingleMedia(formData);
      const url = res?.data?.data?.url;
      if (!url) throw new Error();
      setCustomIcon(url);
    } catch {
      openNotification("error", "Failed to upload icon");
    } finally {
      setUploadingNew(false);
    }
  };

  const handleAddCustom = async () => {
    if (!customValue.trim()) return;
    setActionLoading(true);
    try {
      let iconUrl = customIcon;

      // Agar file selected hai but upload pending hai toh pehle upload karo
      if (newIconRef.current?.files?.[0] && !customIcon) {
        const formData = new FormData();
        formData.append("image", newIconRef.current.files[0]);
        const res = await uploadSingleMedia(formData);
        iconUrl = res?.data?.data?.url || "";
      }

      const payload = { title: customValue, type: "AMENITY", ...(iconUrl ? { icon: iconUrl } : {}) };
      await createFeatureApi(payload);
      setCustomValue("");
      setCustomIcon("");
      if (newIconRef.current) newIconRef.current.value = "";
      await fetchAmenities();
      openNotification("success", "Amenity added successfully");
    } catch {
      openNotification("error", "Failed to add amenity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeatureApi(id);
      await fetchAmenities();
      openNotification("success", "Amenity removed");
    } catch {
      openNotification("error", "Failed to delete");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Amenities</h3>

      <div className="max-w-6xl mx-auto my-6 space-y-6">
        {/* Existing Amenities */}
        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue mb-4">
            Select all amenities available at your hotel
          </h3>
          <hr className="mb-6" />
          {loading ? <Spin tip="Loading Amenities..." /> : (
            <Form.Item name="selectedFeatures">
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  {amenities.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Icon preview / upload with hover edit overlay */}
                        <div
                          className="relative w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center cursor-pointer flex-shrink-0 group"
                          onClick={() => iconRefs.current[item.id]?.click()}
                          title="Click to change icon"
                        >
                          {uploadingIdx === item.id ? (
                            <Spin size="small" />
                          ) : item.icon ? (
                            <>
                              <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain" />
                              {/* Hover edit overlay */}
                              <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <ImagePlus size={16} className="text-gray-400" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={(el) => (iconRefs.current[item.id] = el)}
                            onChange={(e) => handleIconUpload(item.id, e.target.files[0])}
                          />
                        </div>
                        <p className="text-sm text-lightSeconday font-medium truncate">{item.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex-shrink-0"
                      >
                        <img
                          src={deleteIcon}
                          alt="delete"
                          className="bg-lightRed rounded-lg p-1.5 h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>
          )}
        </div>

        {/* Add Custom Amenity */}
        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg text-blue font-semibold mb-1">Add Custom Amenity</h3>
          <hr className="mb-4" />
          <p className="text-lightText text-base font-normal mb-4">Add any additional amenities not listed above</p>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Amenity Name</p>
              <Input
                className="w-64 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                placeholder="Enter Custom Amenity"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onPressEnter={handleAddCustom}
              />
            </div>

            {/* Icon upload for new amenity */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Icon (optional)</p>
              <div
                className="relative w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue transition group"
                onClick={() => newIconRef.current?.click()}
                title="Upload icon"
              >
                {uploadingNew ? (
                  <Spin size="small" />
                ) : customIcon ? (
                  <>
                    <img src={customIcon} alt="icon" className="w-8 h-8 object-contain" />
                    <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <ImagePlus size={18} className="text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={newIconRef}
                  onChange={(e) => handleNewIconUpload(e.target.files[0])}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={actionLoading || !customValue.trim()}
              className={`px-8 h-12 bg-blue text-white rounded-md font-semibold ${actionLoading ? "opacity-50" : ""}`}
              onClick={handleAddCustom}
            >
              {actionLoading ? "Adding..." : "Add to List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
