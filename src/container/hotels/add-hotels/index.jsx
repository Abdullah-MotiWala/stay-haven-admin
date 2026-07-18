import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createHotel, getHotelById, lastHotelId, updateHotel } from "../../../services/hotel";
import { DEFAULT_IMAGE } from "../../../shared/constant";
// import { PAKISTAN_CITIES } from "../../../shared/pakistanCities";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import MapPicker from "../../../components/shared/MapPicker";
import { Form, Input, Select, Checkbox } from "antd";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { uploadSingleMedia } from "../../../services/uploads";
import { getSettingsApi } from "../../../services/setting";
import { getAllUsers } from "../../../services/user";
import { PAKISTAN_CITIES } from "../../../components/shared/pakistanCities";

const GOOGLE_MAP_LIBRARIES = ["places"];

const AUTOCOMPLETE_OPTIONS = {
  componentRestrictions: { country: "pk" },
  fields: ["formatted_address", "geometry", "name"],
};

const fieldLabel = (text) => (
  <span className="text-[15px] font-medium text-gray-700">{text}</span>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6 mt-12 first:mt-0">
    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    <hr className="mt-3 border-gray-100" />
  </div>
);

const AddressAutocomplete = ({ value, onChange, onPlaceSelected, isLoaded }) => {
  const autocompleteRef = useRef(null);

  if (!isLoaded) {
    return (
      <Input
        size="large"
        className="rounded-lg"
        placeholder="e.g. Plot 5, Block 4, Clifton"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  }

  return (
    <Autocomplete
      onLoad={(autocomplete) => {
        autocompleteRef.current = autocomplete;
      }}
      onPlaceChanged={() => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.geometry?.location) return;
        const address = place.formatted_address || place.name || "";
        onChange?.(address);
        onPlaceSelected?.({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address,
        });
      }}
      options={AUTOCOMPLETE_OPTIONS}
    >
      <Input
        size="large"
        className="rounded-lg"
        placeholder="e.g. Plot 5, Block 4, Clifton"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </Autocomplete>
  );
};

const HotelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

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
  const latitude = Form.useWatch("latitude", form);
  const longitude = Form.useWatch("longitude", form);

  useEffect(() => {
    if (loadError) {
      openNotification("error", "Failed to load Google Maps. Check the API key.");
    }
  }, [loadError]);

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
          form.setFieldsValue({ cancellation_policy: policy });
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
          latitude: hotelData.latitude != null ? Number(hotelData.latitude) : undefined,
          longitude: hotelData.longitude != null ? Number(hotelData.longitude) : undefined,
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

  const handlePlaceSelected = ({ lat, lng, address }) => {
    form.setFieldsValue({ address, latitude: lat, longitude: lng });
  };

  const handleMapChange = ({ lat, lng, address }) => {
    form.setFieldsValue({
      latitude: lat,
      longitude: lng,
      ...(address ? { address } : {}),
    });
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
        latitude: values.latitude != null ? Number(values.latitude) : null,
        longitude: values.longitude != null ? Number(values.longitude) : null,
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
        requiredMark={false}
        className="min-h-screen w-full md:p-8 font-sans"
      >
        <div>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(-1)}>
            <img src={arrowImg} alt="arrowImg" />
            <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
          </div>
          <hr className="-mt-4" />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Hotel" : "Add Hotel"}</h1>
          <p className="text-lg text-darkGray font-medium">
            {isEditMode ? "Edit hotel details and amenities" : "Add hotel details and amenities"}
          </p>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100">
          <div className="p-4 sm:p-8 lg:px-16 xl:px-24 pb-14">

            <SectionHeader
              title="Hotel Image"
              subtitle="This photo appears on listings and search results"
            />

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative w-full sm:w-[280px] h-[160px] flex-shrink-0">
                  <img
                    src={imagePreview}
                    className="w-full h-full rounded-2xl object-cover border border-gray-200"
                    alt="hotel"
                  />
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-10"
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
                  <p className="text-base font-semibold text-gray-800">Upload a clear, high quality photo</p>
                  <p className="text-sm text-gray-400 mt-1">Hover the image to change it</p>
                  <p className="text-xs text-gray-400 mt-2">Max size 5MB · JPG, PNG or GIF</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3">
                <span className="text-sm font-medium text-gray-500">Hotel ID</span>
                <span className="text-base font-semibold text-gray-800 select-none">
                  {isEditMode ? `#${hotel.hotelId}` : lastId?.displayId || "—"}
                </span>
              </div>
            </div>

            <SectionHeader
              title="Basic Information"
              subtitle="Core details shown to guests"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <Form.Item
                label={fieldLabel("Hotel Name")}
                name="name"
                rules={[{ required: true, message: "Hotel name is required" }]}
              >
                <Input size="large" placeholder="e.g. Pearl Continental" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={fieldLabel("City")}
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  size="large"
                  placeholder="Select city"
                  showSearch
                  options={PAKISTAN_CITIES.map((city) => ({ label: city, value: city }))}
                />
              </Form.Item>

              <Form.Item
                label={fieldLabel("Hotel Email")}
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input size="large" placeholder="e.g. bookings@hotel.com" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={fieldLabel("Assign Host")}
                name="hostId"
                rules={[{ required: true, message: "Please assign a host" }]}
              >
                <Select
                  size="large"
                  placeholder="Select host"
                  showSearch
                  optionFilterProp="label"
                  options={hostsList.map((host) => ({
                    label: `${host.name}${host.email ? ` (${host.email})` : ""}`,
                    value: host.id,
                  }))}
                />
              </Form.Item>
            </div>

            <SectionHeader
              title="Location"
              subtitle="Start typing the address and pick a suggestion, or click on the map to drop a pin"
            />

            <Form.Item
              label={fieldLabel("Hotel Address")}
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <AddressAutocomplete
                isLoaded={isLoaded}
                onPlaceSelected={handlePlaceSelected}
              />
            </Form.Item>

            <Form.Item
              name="latitude"
              className="mb-0 h-0"
              rules={[{ required: true, message: "Please set the hotel location on the map" }]}
            >
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="longitude" className="mb-0 h-0">
              <Input type="hidden" />
            </Form.Item>

            <MapPicker
              isLoaded={isLoaded}
              value={
                latitude != null && longitude != null
                  ? { lat: latitude, lng: longitude }
                  : null
              }
              onChange={handleMapChange}
            />

            <SectionHeader
              title="Policies & Status"
              subtitle="Booking rules and listing visibility"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <Form.Item
                label={fieldLabel("Cancellation Policy")}
                name="cancellation_policy"
                rules={[{ required: true, message: "Cancellation policy is required" }]}
                extra={<span className="text-xs text-gray-400">Managed globally from Settings</span>}
              >
                <Input size="large" className="rounded-lg" disabled />
              </Form.Item>

              <Form.Item label={fieldLabel("Status")} name="isActive">
                <Select
                  size="large"
                  placeholder="Select status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Maintenance", value: "maintenance" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4 mt-2">
              <div>
                <p className="text-[15px] font-medium text-gray-700">Featured Hotel</p>
                <p className="text-sm text-gray-400">Featured hotels appear at the top of the homepage</p>
              </div>
              <Form.Item name="isFeatured" valuePropName="checked" className="mb-0">
                <Checkbox />
              </Form.Item>
            </div>

            <SectionHeader
              title="Amenities"
              subtitle="Select everything this hotel offers"
            />

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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all min-w-0
                        ${selectedAmenities.includes(a.id)
                          ? "border-blue bg-blue/5"
                          : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <Checkbox value={a.id} className="flex-shrink-0" />
                      <span
                        className={`text-sm font-medium truncate min-w-0
                          ${selectedAmenities.includes(a.id) ? "text-blue" : "text-gray-600"}`}
                      >
                        {a.title}
                      </span>
                    </label>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <SectionHeader
              title="Room Types"
              subtitle="Select the room categories available at this hotel"
            />

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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all min-w-0
                        ${selectedRooms.includes(r.id)
                          ? "border-blue bg-blue/5"
                          : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <Checkbox value={r.id} className="flex-shrink-0" />
                      <span
                        className={`text-sm font-medium truncate min-w-0
                          ${selectedRooms.includes(r.id) ? "text-blue" : "text-gray-600"}`}
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

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="m-0 h-12 px-10 border border-gray-300 bg-white text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`m-0 h-12 px-10 bg-blue text-white rounded-lg font-medium transition-all ${loading || uploading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
          >
            {uploading ? "Uploading..." : loading ? "Saving..." : isEditMode ? "Save Changes" : "Save Hotel"}
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