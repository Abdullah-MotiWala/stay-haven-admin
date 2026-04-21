import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createHotel, getHotelById, lastHotelId, updateHotel } from "../../../services/hotel";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select, Checkbox } from "antd";
import { uploadSingleMedia } from "../../../services/uploads";
import { getSettingsApi } from "../../../services/setting";
import { getAllUsers } from "../../../services/user";

const HotelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();
  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [hotel, setHotel] = useState({});
  const [lastId, setLastId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [uploading, setUploading] = useState(false);
  const [settingsPolicy, setSettingsPolicy] = useState("");
  const [hostsList, setHostsList] = useState([]);

  const selectedRooms = Form.useWatch("rooms", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const res = await lastHotelId();
        setLastId(res?.data?.data || res?.data);
      } catch {
        openNotification("error", "Failed to load hotel ID");
      }
    };
    fetchLastId();
  }, []);


 useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await getSettingsApi();
      const data = res?.data?.data;

      const policy = data?.cancellationPolicy || "";
      setSettingsPolicy(policy);

      if (!isEditMode) {
        form.setFieldsValue({
          cancellation_policy: policy,
        });
      }

    } catch {
      openNotification("error", "Failed to load settings");
    }
  };

  fetchSettings();
}, [form, isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchHotel = async () => {
      setFetching(true);
      try {
        const res = await getHotelById(id);
        const hotelData = res.data.data || res.data;
        setHotel(hotelData);

        if (hotelData.imageUrl) setImagePreview(hotelData.imageUrl);

        form.setFieldsValue({
          name: hotelData.name || "",
          city: hotelData.city || "",
          address: hotelData.address || "",
          email: hotelData.email || "",
          cancellation_policy: hotelData.cancellation_policy || "",
          isActive: hotelData.status || "active",
          isFeatured: hotelData.isFeatured || false,
          hostId: hotelData.hostId || hotelData.host?.id || undefined,
          amenities: hotelData.amenities?.map((a) => a.id) || [],
          rooms: hotelData.roomsIncluded?.map((r) => r.id) || [],
        });
      } catch {
        openNotification("error", "Failed to load hotel");
      } finally {
        setFetching(false);
      }
    };
    fetchHotel();
  }, [id, isEditMode, form]);

  useEffect(() => {
    getAllUsers({ type: "host", page: 1, limit: 100 })
      .then((res) => setHostsList(res.data?.data || []))
      .catch(() => openNotification("error", "Failed to load hosts"));
  }, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [amenityRes, roomRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_TYPE"),
        ]);
        setAmenitiesList(amenityRes.data.data || []);
        setRoomsList(roomRes.data.data || []);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };
    fetchFeatures();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      openNotification("error", "Image size should be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      openNotification("error", "Please select an image file");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const response = await uploadSingleMedia(formData);
      return response.data.data.url;
    } catch {
      openNotification("error", "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage();

      const payload = {
        hotelId: values.hotelId,
        name: values.name,
        city: values.city,
        address: values.address,
        email: values.email,
        cancellation_policy: values.cancellation_policy,
        status: values.isActive,
        isFeatured: values.isFeatured ?? false,
        hostId: values.hostId,
        featureIds: [...(values.amenities || []), ...(values.rooms || [])],
        ...(imageUrl ? { imageUrl } : {}),
      };

      if (isEditMode) {
        await updateHotel(id, payload);
        openNotification("success", "Hotel updated successfully");
      } else {
        await createHotel(payload);
        openNotification("success", "Hotel created successfully");
      }

      setIsModalOpen(true);
    } catch (err) {
      openNotification("error", err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-20 text-center text-blue font-semibold">Loading hotel details...</div>;
  }

  return (
    <>
        <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="min-h-screen w-full md:p-8 font-sans"
      >
 
        {/* Back Button */}
        <div>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(-1)}>
            <img src={arrowImg} alt="arrowImg" />
            <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
          </div>
          <hr className="-mt-4" />
        </div>
 
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Hotel" : "Add Hotel"}</h1>
          <p className="text-lg text-darkGray font-medium">
            {isEditMode ? "Edit hotel details and amenities" : "Add hotel details and amenities"}
          </p>
        </div>
 
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100">
          {/* Card Header */}
          <div className="px-6 py-4 mb-6">
            <h2 className="text-lg font-semibold text-black">Hotel Profile</h2>
            <hr />
          </div>
 
          {/* Card Body — was px-36, now responsive */}
          <div className="p-4 sm:p-6 lg:px-36 pb-14">
 
            {/* Image Upload + Hotel ID Row */}
            {/* 
              FIX: Was `flex justify-between` which caused overflow on small screens.
              Now stacks vertically on mobile, goes side-by-side on large screens.
            */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
 
              {/* Image Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative w-full sm:w-[260px] lg:w-[330px] h-[152px] flex-shrink-0">
                  <img
                    src={imagePreview}
                    className="w-full h-full rounded-[16px] object-cover border"
                    alt="hotel"
                  />
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[16px] opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <span className="text-white text-sm font-medium">
                      {uploading ? "Uploading..." : "Change Image"}
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    disabled={uploading}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue">Upload Hotel Image</h2>
                  <p className="text-lightSeconday">Make sure image is clear</p>
                  <p className="text-xs text-gray-400 mt-2">Max size: 5MB | Format: JPG, PNG, GIF</p>
                </div>
              </div>
 
              {/* Hotel ID */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-black font-semibold underline whitespace-nowrap">Hotel ID</span>
                <div className="w-24 text-center border py-3 rounded-md bg-havengray text-extradark border-lightSeconday cursor-not-allowed opacity-70 pointer-events-none">
                  <span className="select-none">
                    {isEditMode ? hotel.hotelId : lastId?.displayId}
                  </span>
                </div>
              </div>
            </div>
 
            {/* Form Fields Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">Hotel Name</label>
                <Form.Item name="name" rules={[{ required: true, message: "Hotel name is required" }]}>
                  <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter hotel name" />
                </Form.Item>
              </div>
 
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">City</label>
                <Form.Item name="city" rules={[{ required: true, message: "City is required" }]}>
                  <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select City" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                    <Option value="Karachi">Karachi</Option>
                    <Option value="Lahore">Lahore</Option>
                    <Option value="Islamabad">Islamabad</Option>
                  </Select>
                </Form.Item>
              </div>
 
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">Hotel Location</label>
                <Form.Item name="address" rules={[{ required: true, message: "Address is required" }]}>
                  <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter address" />
                </Form.Item>
              </div>
 
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">Hotel Email</label>
                <Form.Item name="email" rules={[{ required: true }, { type: "email", message: "Invalid email" }]}>
                  <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter email" />
                </Form.Item>
              </div>
 
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">Cancellation Policy</label>
                <Form.Item name="cancellation_policy" rules={[{ required: true, message: "Cancellation policy is required" }]}>
                  <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"  placeholder="Enter cancellation policy"
  disabled />
                </Form.Item>
              </div>
 
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">Status</label>
                <Form.Item name="isActive">
                  <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Status" showSearch>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="maintenance">Maintenance</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">Assign Host</label>
                <Form.Item name="hostId" rules={[{ required: true, message: "Please assign a host" }]}>
                  <Select
                    className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                    placeholder="Select Host"
                    showSearch
                    optionFilterProp="label"
                    options={hostsList.map((host) => ({
                      label: `${host.name}${host.email ? ` (${host.email})` : ""}`,
                      value: host.id,
                    }))}
                  />
                </Form.Item>
              </div>

              <div className="w-full flex items-center gap-3 pt-6">
                <Form.Item name="isFeatured" valuePropName="checked" className="mb-0">
                  <Checkbox>Mark as Featured Hotel</Checkbox>
                </Form.Item>
              </div>
            </div>
 
            {/* 
              AMENITIES SECTION
              FIX: Checkbox items were merging/overlapping because grid gap was too small
              and Checkbox.Group had no proper item sizing.
              
              Solution:
              - Each checkbox wrapped in a styled card-like container
              - `min-w-0` prevents flex children from overflowing
              - Responsive grid: 1 col mobile → 2 col sm → 3 col md → 4 col lg
              - Label truncation with `truncate` for long text
            */}
            <h3 className="font-semibold mb-4">Amenities Included</h3>
            <Form.Item
              name="amenities"
              className="w-full"
              rules={[{ required: true, message: "Please select at least one amenity" }]}
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                 {(Array.isArray(amenitiesList) ? amenitiesList : []).map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all min-w-0
                       `}
                    >
                      <Checkbox value={a.id} className="flex-shrink-0" />
                      <span
                        className={`text-sm font-medium truncate min-w-0
                          ${selectedAmenities.includes(a.id) ? "text-blue" : "text-lightText"}`}
                      >
                        {a.title}
                      </span>
                    </label>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>
 
            {/* 
              ROOMS SECTION
              Same fix as amenities above
            */}
            <h3 className="font-semibold mb-4 mt-6">Rooms Included</h3>
            <Form.Item
              name="rooms"
              className="w-full"
              rules={[{ required: true, message: "Please select at least one option" }]}
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                  {roomsList.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl  cursor-pointer transition-all min-w-0
                       `}
                    >
                      <Checkbox value={r.id} className="flex-shrink-0" />
                      <span
                        className={`text-sm font-medium truncate min-w-0
                          ${selectedRooms.includes(r.id) ? "text-blue" : "text-lightText"}`}
                      >
                        {r.title}
                      </span>
                    </label>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>
 
          </div>
        </div>
 
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`px-10 py-2 bg-blue text-white rounded-md ${loading || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {uploading ? "Uploading..." : loading ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
          </button>
        </div>
      </Form>
 
      {isModalOpen && (
        <SuccessModal
          open={true}
          onClose={() => navigate("/admin/hotels")}
          title={isEditMode ? "Hotel Updated Successfully!" : "Hotel Added Successfully!"}
          description={isEditMode ? "The hotel has been updated successfully." : "The hotel has been added successfully."}
          showButton
          buttonText="View Hotels"
          onButtonClick={() => navigate("/admin/hotels")}
        />
      )}
    </>
  );
};
export default HotelForm;