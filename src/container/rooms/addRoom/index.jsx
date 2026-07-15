import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelNamesList } from "../../../services/hotel";
import { STETPS_FIELDS } from "../../../shared/constant";
import { Trash2 } from "lucide-react";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select, Checkbox } from "antd";
import cloudimg from "../../../assets/icons/cloud-upload.png";
import { createRoom, getById, updateRoom } from "../../../services/rooms";
import { uploadMultipleMedia, uploadSingleMedia } from "../../../services/uploads";

const AddNewRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();
  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [policyList, setPolicyList] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [roomTypesList, setRoomTypesList] = useState([]);

  const selectedFeatures = Form.useWatch("features", form) || [];
  const selectedFacility = Form.useWatch("facility", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];
  const selectedPolicy = Form.useWatch("policy", form) || [];

  useEffect(() => {
    const fetchHotelNamesList = async () => {
      try {
        const res = await getHotelNamesList();
        setHotelsList(res?.data.data || res.data);
      } catch {
        openNotification("error", "Failed to load hotels");
      }
    };
    fetchHotelNamesList();
  }, []);

  const handleHotelChange = (val) => {
    form.setFieldValue("type", undefined);
    if (!val) { setRoomTypesList([]); return; }
    const hotel = hotelsList.find((h) => h.id === val);
    const types = (hotel?.features || []).filter((f) => f.type === "ROOM_TYPE");
    setRoomTypesList(types);
  };

  useEffect(() => {
    if (!isEditMode) return;
    const fetchRoomById = async () => {
      setFetching(true);
      try {
        const res = await getById(id);
        const room = res.data.data || res.data;

        const features = room.features?.filter((f) => f.type === "ROOM_FEATURE").map((f) => f.id) || [];
        const amenities = room.features?.filter((f) => f.type === "AMENITY").map((f) => f.id) || [];
        const facility = room.features?.filter((f) => f.type === "ROOM_FACILITY").map((f) => f.id) || [];
        const policy = room.features?.filter((f) => f.type === "POLICY").map((f) => f.id) || [];

        form.setFieldsValue({
          name: room.roomName || "",
          roomNumber: room.roomNumber || "",
          type: room.roomType?.id || room.roomTypeId,
          bedType: room.bedType || "",
          roomSize: room.roomSize || "",
          guests: String(room.maxAdults || 1),
          childrens: String(room.maxChildren || 0),
          pricePerNight: room.pricePerNight || 0.0,
          status: room.status || "available",
          description: room.description || "",
          hotel: room.hotel?.id,
          features,
          amenities,
          facility,
          policy,
          maxinfants: String(room.maxInfants || 0),
        });

        if (room.mainImage) setMainImagePreview(room.mainImage);
        if (room.galleryImages?.length) setGalleryPreviews(room.galleryImages);

        // Set room types from hotel's features
        if (room.hotel?.id) {
          const hotelsRes = await getHotelNamesList();
          const hotels = hotelsRes?.data?.data || hotelsRes?.data || [];
          const hotel = hotels.find((h) => h.id === room.hotel.id);
          const types = (hotel?.features || []).filter((f) => f.type === "ROOM_TYPE");
          setRoomTypesList(types);
          setHotelsList(hotels);
        }
      } catch {
        openNotification("error", "Failed to load room");
      } finally {
        setFetching(false);
      }
    };
    fetchRoomById();
  }, [id, isEditMode, form]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [amenityRes, featuresRes, facilityRes, policyTypeRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_FEATURE"),
          getAllFeature("ROOM_FACILITY"),
          getAllFeature("POLICY"),
        ]);
        setAmenitiesList(amenityRes.data.data || []);
        setFeaturesList(featuresRes.data.data || []);
        setFacilityList(facilityRes.data.data || []);
        setPolicyList(policyTypeRes.data.data || []);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };
    fetchFeatures();
  }, []);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      openNotification("error", "Image size must be under 2 MB");
      e.target.value = "";
      return;
    }
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (gallery.length + files.length > 5) {
      openNotification("error", `Maximum 5 images allowed. You already have ${gallery.length}.`);
      e.target.value = "";
      return;
    }
    const oversized = files.filter((f) => f.size > 1 * 1024 * 1024);
    if (oversized.length) {
      openNotification("error", `${oversized.length} image(s) exceed 2 MB limit`);
      e.target.value = "";
      return;
    }
    setGallery((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onNext = async () => {
    try {
      await form.validateFields(STETPS_FIELDS[currentStep]);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.log("Step validation failed:", error);
    }
  };

  const onBack = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let mainImageUrl = null;
      let galleryUrls = [];

      if (mainImage) {
        const formData = new FormData();
        formData.append("image", mainImage);
        const uploadRes = await uploadSingleMedia(formData);
        mainImageUrl = uploadRes?.data?.data?.url;
      }

      if (gallery.length > 0) {
        const formData = new FormData();
        gallery.forEach((file) => formData.append("images", file));
        const uploadRes = await uploadMultipleMedia(formData);
        galleryUrls = uploadRes?.data?.data?.map((item) => item.url) || [];
      }

      const payload = {
        roomName: values.name,
        roomNumber: values.roomNumber,
        hotelId: values.hotel,
        roomTypeId: values.type,
        bedType: values.bedType,
        roomSize: values.roomSize,
        maxAdults: Number(values.guests),
        maxChildren: Number(values.childrens),
        description: values.description,
        pricePerNight: Number(values.pricePerNight),
        status: values.status,
        featureIds: [
          ...new Set([
            ...(values.features || []),
            ...(values.amenities || []),
            ...(values.facility || []),
            ...(values.policy || []),
          ]),
        ],
        ...(mainImageUrl && { mainImage: mainImageUrl }),
        ...(galleryUrls.length > 0 && { galleryImages: galleryUrls }),
        maxInfants: Number(values.maxinfants || 0),
      };
      let res;
      if (isEditMode) {
        res = await updateRoom(id, payload);
      } else {
        res = await createRoom(payload);
      }

      if (![200, 201].includes(res?.status)) throw new Error("API failed");

      openNotification("success", isEditMode ? "Room updated successfully" : "Room created successfully");
      setIsModalOpen(true);
    } catch (err) {
      openNotification("error", err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Room Details",
      content: (
        <>
          <div>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(-1)}>
              <img src={arrowImg} alt="arrowImg" />
              <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
            </div>
            <hr className="-mt-4" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Room" : "Add New Room"}</h1>
            <p className="text-lg text-darkGray font-medium">
              {isEditMode ? "Fill in the details below to edit a room to your hotel inventory." : "Fill in the details below to add a new room to your hotel inventory."}
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100">
            <div className="px-6 py-4 mb-6">
              <h2 className="text-lg font-semibold text-black">Room Details</h2>
              <hr />
            </div>
            <div className="p-6 px-16 md:px-36 lg:px-36 pb-14">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Room Name</label>
                  <Form.Item preserve={true} name="name">
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Room Name" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {[{ label: "Deluxe", value: "Deluxe" }, { label: "Standard", value: "Standard" }].map((item) => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Room Number</label>
                  <Form.Item preserve={true} name="roomNumber" rules={[{ required: true, message: "Room Number is required" }]}>
                    <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter room number" />
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Select Hotel</label>
                  <Form.Item preserve={true} name="hotel">
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Hotel" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} onChange={handleHotelChange}>
                      {hotelsList?.map((item) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Room Type</label>
                  <Form.Item preserve={true} name="type" rules={[{ required: true, message: "Room Type is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Room Type" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {roomTypesList.map((item) => (
                        <Option key={item.id} value={item.id}>{item.title}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Bed Type</label>
                  <Form.Item preserve={true} name="bedType" rules={[{ required: true, message: "Bed Type is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Bed Type" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {[{ label: "Single Bed", value: "single bed" }, { label: "Queen Bed", value: "queen bed" }, { label: "King Bed", value: "king bed" }].map((item) => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Room Size</label>
                  <Form.Item preserve={true} name="roomSize" rules={[{ required: true, message: "Room Size is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Room Size" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {[{ label: "e.g. 25 m²", value: "e.g. 25 m²" }, { label: "e.g. 30 m²", value: "e.g. 30 m²" }, { label: "e.g. 35 m²", value: "e.g. 35 m²" }].map((item) => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Guest Adults</label>
                  <Form.Item preserve={true} name="guests" rules={[{ required: true, message: "Guest Adults is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Guests" showSearch filterOption={(input, option) =>
                      String(option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                    }>
                      {["1", "2", "3", "4", "5", "6", "7", "8"].map((v) => (
                        <Option key={v} value={v}>{v} Guests</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Childrens</label>
                  <Form.Item preserve={true} name="childrens" rules={[{ required: true, message: "Children is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Children" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {["0", "1", "2", "3", "4", "5", "6", "7", "8"].map((v) => (
                        <Option key={v} value={v}>{v}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div className="w-full">
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Max in fants</label>
                  <Form.Item preserve={true} name="maxinfants" rules={[{ required: true, message: "maxinfants is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Max Infants" showSearch filterOption={(input, option) =>
                      String(option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                    }>
                      {["0", "1", "2", "3", "4", "5", "6"].map((v) => (
                        <Option key={v} value={v}>{v} Maxinfants</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <label className="text-base text-lightSeconday font-medium">Room Description</label>
                <Form.Item preserve={true} name="description" rules={[{ required: true, message: "Room Description is required" }]}>
                  <Input.TextArea className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter description" />
                </Form.Item>
              </div>

              <h4 className="font-semibold my-8">Pricing & Status</h4>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Price Per Night</label>
                  <Form.Item preserve={true} name="pricePerNight" rules={[{ required: true, message: "Price Per Night is required" }]}>
                    <Input className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter price per night" />
                  </Form.Item>
                </div>
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Status</label>
                  <Form.Item preserve={true} name="status" rules={[{ required: true, message: "Status is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Status" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {[
                        { label: "Available", value: "available" },
                        { label: "Active", value: "active" },
                        { label: "Occupied", value: "occupied" },
                        { label: "Maintenance", value: "maintenance" },
                        { label: "Inactive", value: "inactive" },
                      ].map((item) => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 font-sans overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100">
              <h2 className="text-[18px] mb-0 font-semibold text-gray-900">Room Images</h2>
            </div>
            <div className="p-[8%] pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Form.Item
                  name="mainImageUpload"
                  validateTrigger="none"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (mainImagePreview) return Promise.resolve();
                        return Promise.reject(new Error("Main image is required"));
                      },
                    },
                  ]}
                >
                  <div className="flex flex-col gap-4">
                    <label className="text-[15px] font-semibold text-gray-900">
                      Upload Room (Main) image
                    </label>
                    {!mainImagePreview ? (
                      <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                        <div className="flex justify-center mt-4">
                          <img src={cloudimg} alt="" className="w-6 h-6 text-gray-700" />
                          <p className="text-sm text-gray-700 font-medium text-center px-4">
                            Drop your image here or{" "}
                            <span className="text-blue underline">Browse</span>
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-400">Only JPG/PNG Files under 1 MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full group">
                        <img
                          src={mainImagePreview}
                          alt="Main Preview"
                          className="w-full h-[180px] object-cover rounded-[15px] border border-gray-200"
                        />
                        {/* ✅ Black overlay + centered trash icon — same as appartment style */}
                        <div
                          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-[15px] flex items-center justify-center cursor-pointer"
                          onClick={removeMainImage}
                        >
                          <Trash2 size={40} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </Form.Item>


                <div className="flex flex-col gap-4">
                  <label className="text-[15px] font-semibold text-gray-900">Gallery (Optional)</label>
                  {galleryPreviews.length < 5 && (
                    <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                      <div className="flex justify-center mt-4">
                        <img src={cloudimg} alt="" className="w-6 h-6 text-gray-700" />
                        <p className="text-sm text-gray-700 font-medium text-center px-4">Upload multiple image</p>
                      </div>
                      <p className="text-[11px] text-gray-400">Only JPG/PNG Files under 1 MB (max 5)</p>
                      <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Gallery ${index + 1}`} className="w-full h-[80px] object-cover rounded-[10px] border border-gray-200" />
                          <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all">
              Back
            </button>
            <button type="button" onClick={onNext} className="px-10 py-2 bg-blue text-white rounded-md">
              Next
            </button>
          </div>
        </>
      ),
    },
    {
      title: "Features & Facilities",
      content: (
        <>
          <div>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(-1)}>
              <img src={arrowImg} alt="arrowImg" />
              <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
            </div>
            <hr className="-mt-4" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Room" : "Add New Room"}</h1>
            <p className="text-lg text-darkGray font-medium">
              {isEditMode ? "Fill in the details below to edit a room to your hotel inventory." : "Fill in the details below to add a new room to your hotel inventory."}
            </p>
          </div>

          <div>
            {[
              { title: "Room Features", name: "features", list: featuresList, selected: selectedFeatures, label: "Select Room Features" },
              { title: "Ameneties", name: "amenities", list: amenitiesList, selected: selectedAmenities, label: "Select Ameneties" },
              { title: "Policy", name: "policy", list: policyList, selected: selectedPolicy, label: "Select Policy" },
              { title: "Room Facilities", name: "facility", list: facilityList, selected: selectedFacility, label: "Select Room Facilities" },
            ].map(({ title, name, list, selected, label }) => (
              <div key={name} className="bg-white rounded-2xl shadow-sm border border-lightSeconday mb-4">
                <div className="px-6 py-4">
                  <h2 className="text-lg font-semibold text-black">{title}</h2>
                  <hr />
                </div>
                <div className="p-6 px-36 pb-14">
                  <h3 className="font-semibold mb-4">{label}</h3>
                  <Form.Item preserve={true} name={name} className="w-full" rules={[{ required: true, message: `Please select at least one ${title.toLowerCase()}` }]}>
                    <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                      {list.map((a) => (
                        <div key={a.id} className="w-full">
                          <Checkbox value={a.id} className="w-full flex items-center">
                            <span className={`block w-full text-sm font-medium ${selected.includes(a.id) ? "text-blue" : "text-lightText"}`}>
                              {a.title}
                            </span>
                          </Checkbox>
                        </div>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onBack} className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all">
              Back
            </button>
            <button type="button" onClick={() => form.submit()} disabled={loading} className="px-10 py-2 bg-blue text-white rounded-md">
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Room"}
            </button>
          </div>
        </>
      ),
    },
  ];

  if (fetching) {
    return <div className="p-20 text-center text-blue font-semibold">Loading room details...</div>;
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "Deluxe",
          bedType: "Single Bed",
          roomSize: "e.g. 25 m²",
          guests: "1",
          childrens: "0",
          status: "available",
          features: [],
          amenities: [],
          facility: [],
          policy: [],
        }}
        onFinish={handleSubmit}
        className="min-h-screen w-full md:p-8 font-sans"
      >
        <div className="steps-content">
          {steps.map((step, index) => (
            <div key={index} style={{ display: currentStep === index ? "block" : "none" }}>
              {step.content}
            </div>
          ))}
        </div>
      </Form>

      {isModalOpen && (
        <SuccessModal
          open={true}
          onClose={() => navigate("/admin/rooms")}
          title={!isEditMode ? "Room Added Successfully!" : "Room Updated Successfully!"}
          description={!isEditMode ? "The Room has been added successfully." : "The Room has been updated successfully."}
          showButton
          buttonText="View Rooms"
          onButtonClick={() => navigate("/admin/rooms")}
        />
      )}
    </>
  );
};

export default AddNewRoom;