import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelNamesList } from "../../../services/hotel";
import { DEFAULT_IMAGE, STETPS_FIELDS } from "../../../shared/constant";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, InputNumber, Select, Checkbox, Avatar, Image } from "antd";
import cloudimg from "../../../assets/icons/cloud-upload.png";
import editIcon from "../../../assets/icons/editIcon.svg";
import { Trash2 } from "lucide-react";
import { createAppartment, getById, updateAppartment } from "../../../services/appartments";
import { uploadMultipleMedia, uploadSingleMedia } from "../../../services/uploads";

const { Option } = Select;

const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") ||
      localStorage.getItem("adminUser") ||
      "{}"
    );
  } catch {
    return {};
  }
};

const AddNewAppartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();

  const currentUser = getCurrentUser();
  const isHost = currentUser?.userType === "host";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [roomTypesList, setRoomTypesList] = useState([]);
  const [hotelSelected, setHotelSelected] = useState(false);
  const [hostImageFile, setHostImageFile] = useState(null);
  const [hostImagePreview, setHostImagePreview] = useState(DEFAULT_IMAGE);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [policyList, setPolicyList] = useState([]);

  const selectedFeatures = Form.useWatch("features", form) || [];
  const selectedFacility = Form.useWatch("facility", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];
  const selectedPolicy = Form.useWatch("policy", form) || [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getHotelNamesList();
        setHotelsList(res?.data?.data || []);
      } catch {
        openNotification("error", "Failed to load hotels");
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [amenityRes, featuresRes, facilityRes, policyRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_FEATURE"),
          getAllFeature("ROOM_FACILITY"),
          getAllFeature("POLICY"),
        ]);
        setAmenitiesList(amenityRes.data.data);
        setFeaturesList(featuresRes.data.data);
        setFacilityList(facilityRes.data.data);
        setPolicyList(policyRes.data.data || []);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    const fetch = async () => {
      setFetching(true);
      try {
        const res = await getById(id);
        const apt = res.data.data;

        if (apt.hotel?.id) {
          try {
            const hotelsRes = await getHotelNamesList();
            const hotels = hotelsRes?.data?.data || hotelsRes?.data || [];
            setHotelsList(hotels);
            const hotel = hotels.find((h) => h.id === apt.hotel.id);
            const types = (hotel?.features || []).filter((f) => f.type === "ROOM_TYPE");
            setRoomTypesList(types);
            setHotelSelected(types.length > 0);
          } catch (e) {
            console.error("Failed to load hotel room types", e);
          }
        }

        if (apt.mainImage) setMainImagePreview(apt.mainImage);
        if (apt.galleryImages?.length > 0) setGalleryPreviews(apt.galleryImages);
        if (apt.host?.image) setHostImagePreview(apt.host.image);

        form.setFieldsValue({
          name: apt.apartmentName || "",
          appartmentNumber: apt.apartmentNumber || "",
          type: apt.roomType?.id || apt.typeId || undefined,
          bedType: apt.bedType || "",
          appartmentSize: apt.appartmentSize || "",
          maxAdults: String(apt.maxAdults || "1"),
          maxChildren: String(apt.maxChildren || "0"),
          maxinfants: String(apt.maxInfants || "0"),
          pricePerNight: apt.pricePerNight != null && apt.pricePerNight !== "" ? Number(apt.pricePerNight) : undefined,
          status: apt.status || "available",
          description: apt.description || "",
          hotel: apt.hotel?.id,
          hostname: apt.host?.name || "",
          email: apt.host?.email || "",
          phoneNumber: apt.host?.phone || "",
          facility: apt.features?.filter(f => f.type === "ROOM_FACILITY").map(f => f.id) || [],
          policy: apt.features?.filter(f => f.type === "POLICY").map(f => f.id) || [],
          amenities: apt.features?.filter(f => f.type === "AMENITY").map(f => f.id) || [],
          features: apt.features?.filter(f => f.type === "ROOM_FEATURE").map(f => f.id) || [],
        });
      } catch {
        openNotification("error", "Failed to load apartment");
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id, isEditMode, form]);

  const handleHotelChange = async (val) => {
    form.setFieldValue("type", undefined);
    setRoomTypesList([]);
    setHotelSelected(false);
    if (!val) return;
    const hotel = hotelsList.find((h) => h.id === val);
    const types = (hotel?.features || []).filter((f) => f.type === "ROOM_TYPE");
    setRoomTypesList(types);
    setHotelSelected(types.length > 0);
    if (types.length === 0) {
      openNotification("warning", "This hotel has no room types configured yet.");
    }
  };

  const handleHostImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { openNotification("error", "Host image should be less than 5MB"); return; }
    if (!file.type.startsWith("image/")) { openNotification("error", "Please select an image file"); return; }
    setHostImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setHostImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeHostImage = () => { setHostImageFile(null); setHostImagePreview(DEFAULT_IMAGE); };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { openNotification("error", "Main image should be less than 5MB"); return; }
    if (!file.type.startsWith("image/")) { openNotification("error", "Please select an image file"); return; }
    setMainImageFile(file);
    form.setFieldValue("mainImageUpload", file.name);
    form.validateFields(["mainImageUpload"]);
    const reader = new FileReader();
    reader.onloadend = () => setMainImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
    form.setFieldValue("mainImageUpload", undefined);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (galleryPreviews.length + files.length > 5) { openNotification("error", "Maximum 5 gallery images allowed"); return; }
    const validFiles = files.filter(f => {
      if (f.size > 1 * 1024 * 1024) { openNotification("error", `${f.name} should be less than 1MB`); return false; }
      if (!f.type.startsWith("image/")) { openNotification("error", `${f.name} is not an image`); return false; }
      return true;
    });
    if (!validFiles.length) return;
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryPreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    setGalleryFiles(prev => [...prev, ...validFiles]);
    e.target.value = null;
  };

  const removeGalleryImage = (index) => {
    const existingCount = galleryPreviews.length - galleryFiles.length;
    if (index >= existingCount) {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index - existingCount));
    }
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMainImage = async () => {
    if (!mainImageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", mainImageFile);
      const res = await uploadSingleMedia(fd);
      return res.data.data.url;
    } catch { openNotification("error", "Failed to upload main image"); return null; }
    finally { setUploading(false); }
  };

  const uploadHostImage = async () => {
    if (!hostImageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", hostImageFile);
      const res = await uploadSingleMedia(fd);
      return res.data.data.url;
    } catch { openNotification("error", "Failed to upload host image"); return null; }
    finally { setUploading(false); }
  };

  const uploadGalleryImages = async () => {
    if (!galleryFiles.length) return [];
    setUploading(true);
    try {
      const fd = new FormData();
      galleryFiles.forEach(f => fd.append("images", f));
      const res = await uploadMultipleMedia(fd);
      return res?.data?.data?.map((item) => item.url) || [];
    } catch { openNotification("error", "Failed to upload gallery images"); return []; }
    finally { setUploading(false); }
  };

  const onNext = async () => {
    try {
      await form.validateFields(STETPS_FIELDS[currentStep]);
      setCurrentStep(prev => prev + 1);
    } catch (err) {
    }
  };

  const onBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (values) => {
    setLoading(true);

    let mainImageUrl = null;
    if (mainImageFile) {
      mainImageUrl = await uploadMainImage();
      if (!mainImageUrl) { setLoading(false); return; }
    }

    let hostImageUrl = null;
    if (hostImageFile) {
      hostImageUrl = await uploadHostImage();
      if (!hostImageUrl) { setLoading(false); return; }
    }

    let galleryUrls = [];
    if (galleryFiles.length > 0) galleryUrls = await uploadGalleryImages();

    const payload = {
      apartmentName: values.name,
      apartmentNumber: values.appartmentNumber,
      hotelId: values.hotel,
      type: values.type,
      bedType: values.bedType,
      apartmentSize: values.appartmentSize,
      maxAdults: Number(values.maxAdults),
      maxChildren: Number(values.maxChildren),
      maxInfants: Number(values.maxinfants),
      description: values.description,
      pricePerNight: Number(values.pricePerNight),
      status: values.status,
      featureIds: [
        ...(values.features || []),
        ...(values.amenities || []),
        ...(values.facility || []),
        ...(values.policy || []),
      ],
    };

    if (!isHost) {
      payload.hostName = values.hostname;
      payload.hostEmail = values.email;
      payload.hostPhone = values.phoneNumber;
      if (hostImageUrl) payload.hostImage = hostImageUrl;
      else if (isEditMode && hostImagePreview && hostImagePreview !== DEFAULT_IMAGE)
        payload.hostImage = hostImagePreview;
    }

    if (mainImageUrl) payload.mainImage = mainImageUrl;
    else if (isEditMode && mainImagePreview) payload.mainImage = mainImagePreview;

    const existingGalleryUrls = galleryPreviews.filter((p) => typeof p === "string" && p.startsWith("http"));
    const combinedGallery = [...existingGalleryUrls, ...galleryUrls];
    if (combinedGallery.length > 0) payload.galleryImages = combinedGallery;

    try {
      let res;
      if (isEditMode) res = await updateAppartment(id, payload);
      else res = await createAppartment(payload);

      if (res?.data?.success === false) {
        openNotification("error", res?.data?.message || "Failed to save apartment");
        return;
      }
      if (res?.status !== 200 && res?.status !== 201)
        throw new Error(res?.data?.message || "API failed");

      openNotification("success", isEditMode ? "Apartment updated successfully" : "Apartment created successfully");
      setIsModalOpen(true);
    } catch (err) {
      openNotification("error", err?.response?.data?.message || err?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Apartment Details",
      content: (
        <>
          <div className="flex items-center gap-4 cursor-pointer mb-2" onClick={() => navigate(-1)}>
            <img src={arrowImg} alt="back" />
            <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
          </div>
          <hr className="-mt-4 mb-6" />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Apartment" : "Add New Apartment"}</h1>
            <p className="text-lg text-darkGray font-medium">Fill in the details below to {isEditMode ? "edit" : "add"} an apartment.</p>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100">
            <div className="px-6 py-4 mb-6">
              <h2 className="text-lg font-semibold text-black">Apartment Details</h2>
              <hr />
            </div>
            <div className="p-6 px-36 pb-14">

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Apartment Name</label>
                  <Form.Item preserve name="name" rules={[{ required: true, message: "Apartment Name is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select apartment name" showSearch>
                      {[{ label: "Deluxe", value: "Deluxe" }, { label: "Standard", value: "Standard" }].map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Apartment Number</label>
                  <Form.Item preserve name="appartmentNumber" rules={[{ required: true, message: "Apartment Number is required" }]}>
                    <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter apartment number" />
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Select Hotel</label>
                  <Form.Item preserve name="hotel" rules={[{ required: true, message: "Hotel selection is required" }]}>
                    <Select
                      className="w-full h-12 border border-lightSeconday rounded-md font-medium"
                      placeholder="Select a hotel"
                      onChange={handleHotelChange}
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      showSearch
                    >
                      {Array.isArray(hotelsList) && hotelsList.map(item => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Apartment Type
                    {!hotelSelected && <span className="text-xs text-orange-400 ml-2">(Select hotel first)</span>}
                  </label>
                  <Form.Item preserve name="type" rules={[{ required: true, message: "Apartment Type is required" }]}>
                    <Select
                      className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                      placeholder={hotelSelected ? "Select apartment type" : "Select hotel first"}
                      disabled={!hotelSelected}
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                      {roomTypesList.map(item => (
                        <Option key={item.id} value={item.id}>{item.title}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Bed Type</label>
                  <Form.Item preserve name="bedType" rules={[{ required: true, message: "Bed Type is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select bed type" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {[{ label: "Single Bed", value: "Single Bed" }, { label: "Queen Bed", value: "Queen Bed" }, { label: "King Bed", value: "King Bed" }].map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Apartment Size</label>
                  <Form.Item preserve name="appartmentSize" rules={[{ required: true, message: "Apartment Size is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select apartment size" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                      {["25 m²", "30 m²", "35 m²", "40 m²", "50 m²"].map(v => (
                        <Option key={v} value={v}>{v}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Max Adults</label>
                  <Form.Item preserve name="maxAdults" rules={[{ required: true, message: "Max Adults is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select max adults">
                      {["1","2","3","4","5","6","7","8"].map(v => (
                        <Option key={v} value={v}>{v} Adult{v !== "1" ? "s" : ""}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Max Children</label>
                  <Form.Item preserve name="maxChildren" rules={[{ required: true, message: "Max Children is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select max children">
                      {["0","1","2","3","4","5","6","7","8"].map(v => (
                        <Option key={v} value={v}>{v} {v === "1" ? "Child" : "Children"}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Max Infants</label>
                  <Form.Item preserve name="maxinfants" rules={[{ required: true, message: "Max Infants is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select max infants">
                      {["0","1","2","3","4","5","6"].map(v => (
                        <Option key={v} value={v}>{v} {v === "1" ? "Infant" : "Infants"}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

              </div>

              <div className="w-full mb-6">
                <label className="text-base text-lightSeconday font-medium">Apartment Description</label>
                <Form.Item preserve name="description" rules={[{ required: true, message: "Description is required" }]}>
                  <Input.TextArea className="p-2 border border-lightSeconday rounded-md font-medium" rows={4} placeholder="Enter description" />
                </Form.Item>
              </div>

              <h4 className="font-semibold my-8">Pricing & Status</h4>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Price Per Night</label>
                  <Form.Item
                    preserve
                    name="pricePerNight"
                    rules={[
                      { required: true, message: "Price Per Night is required" },
                      { type: "number", min: 1, message: "Price must be greater than 0" },
                    ]}
                  >
                    <InputNumber
                      className="w-full h-12 border border-lightSeconday rounded-md font-medium flex items-center"
                      placeholder="Enter price per night"
                      min={0}
                      precision={2}
                      controls={false}
                      keyboard={false}
                      style={{ width: "100%" }}
                      parser={(value) => value?.replace(/[^\d.]/g, "")}
                    />
                  </Form.Item>
                </div>
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">Status</label>
                  <Form.Item preserve name="status" rules={[{ required: true, message: "Status is required" }]}>
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select status">
                      {[
                        { label: "Available", value: "available" },
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Maintenance", value: "maintenance" },
                        { label: "Occupied", value: "occupied" },
                      ].map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mt-6 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100">
              <h2 className="text-[18px] mb-0 font-semibold text-gray-900">Apartment Images</h2>
            </div>
            <div className="p-[8%] pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                <Form.Item name="mainImageUpload" validateTrigger="none"
                  rules={[{ validator: () => mainImagePreview ? Promise.resolve() : Promise.reject(new Error("Main image is required")) }]}>
                  <div className="flex flex-col gap-4">
                    <label className="text-[15px] font-semibold text-gray-900">Upload Apartment (Main) Image</label>
                    {!mainImagePreview ? (
                      <div className="relative group w-full h-[100px] border-2 border-dashed border-blue rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                        <div className="flex justify-center mt-4">
                          <img src={cloudimg} alt="" className="w-6 h-6" />
                          <p className="text-sm text-gray-700 font-medium text-center px-4">
                            Drop your image here or <span className="text-blue underline">Browse</span>
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-400">Only JPG/PNG Files under 5 MB</p>
                        <input type="file" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <div className="relative w-full">
                        <Image
                          src={mainImagePreview}
                          alt="Main Preview"
                          width="100%"
                          height={180}
                          style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 15, border: "1px solid #e5e7eb" }}
                          preview={{ mask: <span className="text-sm font-medium">View</span> }}
                        />
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition z-10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </Form.Item>

                <div className="flex flex-col gap-4">
                  <label className="text-[15px] font-semibold text-dark">Gallery (Optional) - Max 5 images</label>
                  {galleryPreviews.length < 5 && (
                    <div className="relative group w-full h-[100px] border-2 border-dashed border-blue rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                      <div className="flex justify-center mt-4">
                        <img src={cloudimg} alt="" className="w-6 h-6" />
                        <p className="text-sm text-gray-700 font-medium text-center px-4">Click to upload multiple images</p>
                      </div>
                      <p className="text-[11px] text-gray-400">Only JPG/PNG Files under 1 MB each</p>
                      <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                  {galleryPreviews.length > 0 && (
                    <Image.PreviewGroup>
                      <div className="grid grid-cols-3 gap-2 mt-4 max-h-[200px] overflow-y-auto p-2">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              width="100%"
                              height={80}
                              style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                              preview={{ mask: <span className="text-xs font-medium">View</span> }}
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition z-10"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  )}
                  <p className="text-xs text-gray-400">{galleryPreviews.length}/5 images selected</p>
                </div>

              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all">Back</button>
            <button type="button" onClick={onNext} className="px-10 py-2 bg-blue text-white rounded-md">Next</button>
          </div>
        </>
      ),
    },
    {
      title: "Features & Facilities",
      content: (
        <>
          <div className="flex items-center gap-4 cursor-pointer mb-2" onClick={() => navigate(-1)}>
            <img src={arrowImg} alt="back" />
            <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
          </div>
          <hr className="-mt-4 mb-6" />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Apartment" : "Add New Apartment"}</h1>
          </div>

          {[
            { title: "Policy", name: "policy", list: policyList, selected: selectedPolicy },
            { title: "Apartment Features", name: "features", list: featuresList, selected: selectedFeatures },
            { title: "Amenities", name: "amenities", list: amenitiesList, selected: selectedAmenities },
            { title: "Apartment Facilities", name: "facility", list: facilityList, selected: selectedFacility },
          ].map(({ title, name, list, selected }) => (
            <div key={name} className="bg-white rounded-2xl shadow-sm border border-lightSeconday mb-4">
              <div className="px-6 py-4"><h2 className="text-lg font-semibold text-black">{title}</h2><hr /></div>
              <div className="p-6 px-36 pb-14">
                <Form.Item preserve name={name} className="w-full" rules={[{ required: true, message: `Please select at least one ${title.toLowerCase()}` }]}>
                  <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {list.map(a => (
                      <div key={a.id} className="w-full">
                        <Checkbox value={a.id} className="w-full flex items-center">
                          <span className={`block w-full text-sm font-medium ${selected.includes(a.id) ? "text-blue" : "text-lightText"}`}>{a.title}</span>
                        </Checkbox>
                      </div>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
          ))}

          {!isHost && (
            <div className="bg-white rounded-2xl shadow-sm border border-lightSeconday">
              <div className="px-6 py-4"><h2 className="text-lg font-semibold text-black">Host Details</h2><hr /></div>
              <div className="max-w-4xl px-4 mx-auto bg-white rounded-lg pb-8">
                <Form.Item name="hostImageUpload"
                  rules={[{ validator: () => hostImagePreview !== DEFAULT_IMAGE ? Promise.resolve() : Promise.reject(new Error("Host image is required")) }]}>
                  <div className="flex items-center gap-10 mb-14">
                    <div className="relative inline-block">
                      {hostImagePreview !== DEFAULT_IMAGE ? (
                        <div className="relative">
                          <Image
                            src={hostImagePreview}
                            alt="Host"
                            width={120}
                            height={120}
                            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%", border: "1px solid #e5e7eb" }}
                            preview={{ mask: <span className="text-xs font-medium">View</span> }}
                          />
                          <button
                            type="button"
                            onClick={removeHostImage}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition z-10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="host-image-upload" className="cursor-pointer">
                          <Avatar size={120} src="https://ui-avatars.com/api/?name=Host+Image" className="hover:opacity-80 transition-opacity" />
                        </label>
                      )}
                      <input id="host-image-upload" type="file" accept="image/*" onChange={handleHostImageChange} className="hidden" style={{ display: "none" }} />
                      {hostImagePreview === DEFAULT_IMAGE && (
                        <label htmlFor="host-image-upload" className="absolute bottom-2 right-2 bg-blue rounded-full flex items-center justify-center cursor-pointer p-2 shadow-lg">
                          <img src={editIcon} alt="Edit" className="w-4 h-4" />
                        </label>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-blue">Upload Profile Image</h2>
                      <p className="text-lightSeconday">Make sure face is clear</p>
                      {hostImageFile && <p className="text-xs text-green-600 mt-1">✓ {hostImageFile.name} selected</p>}
                    </div>
                  </div>
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">Host Name</label>
                    <Form.Item preserve name="hostname" rules={[{ required: true, message: "Host Name is required" }]}>
                      <Input className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter host name" />
                    </Form.Item>
                  </div>
                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">Email</label>
                    <Form.Item preserve name="email" rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}>
                      <Input className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter email" />
                    </Form.Item>
                  </div>
                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">Phone Number</label>
                    <Form.Item preserve name="phoneNumber" rules={[{ required: true, message: "Phone Number is required" }]}>
                      <Input className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter phone number" />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onBack} className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all">Back</button>
            <button
              type="button"
              disabled={loading || uploading}
              onClick={() => form.submit()}
              className={`px-10 py-2 bg-blue text-white rounded-md ${(loading || uploading) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploading ? "Uploading..." : loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Apartment"}
            </button>
          </div>
        </>
      ),
    },
  ];

  if (fetching) return <div className="p-20 text-center text-blue font-semibold">Loading apartment details...</div>;

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "Deluxe",
          bedType: "Single Bed",
          appartmentSize: "25 m²",
          maxAdults: "1",
          maxChildren: "0",
          maxinfants: "0",
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
          open
          onClose={() => navigate("/admin/appartments")}
          title={isEditMode ? "Apartment Updated Successfully!" : "Apartment Added Successfully!"}
          description={isEditMode ? "The Apartment has been updated." : "The Apartment has been added."}
          showButton
          buttonText="View Apartments"
          onButtonClick={() => navigate("/admin/appartments")}
        />
      )}
    </>
  );
};

export default AddNewAppartment;