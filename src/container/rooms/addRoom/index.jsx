import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHotel,
  getHotelById,
  getHotelNamesList,
  lastHotelId,
  updateHotel,
} from "../../../services/hotel";
import { DEFAULT_IMAGE, STETPS_FIELDS } from "../../../shared/constant";
import { CloudUpload, FileText, Eye, Trash2 } from "lucide-react";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select, Checkbox, Steps, Button } from "antd";
import cloudimg from "../../../assets/icons/cloud-upload.png";
import eye from "../../../assets/icons/eye.png";
import { createRoom, getById, updateRoom } from "../../../services/rooms";
import { uploadMultipleMedia, uploadSingleMedia } from "../../../services/uploads";
const AddNewRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();
  const { Step } = Steps;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [policyList, setPolicyList] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [rulesPoliciesList, setRulesPoliciesList] = useState([]);
  const [hotel, setHotel] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  const selectedFeatures = Form.useWatch("features", form) || [];
  const selectedFacility = Form.useWatch("facility", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];
  const selectedPolicy = Form.useWatch("policy", form) || [];
  const [roomTypesList, setRoomTypesList] = useState([]);

  const { Option } = Select;

  useEffect(() => {
    const fetchHotelNamesList = async () => {
      try {
        const res = await getHotelNamesList();
        // console.log(res?.data?.data, "lastID2wq===");
        setHotelsList(res?.data.data || res.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };
    fetchHotelNamesList();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchRoomById = async () => {
      setFetching(true);
      try {
        const res = await getById(id);
        const room = res.data.data || res.data;
        console.log(room, "roomroomroom223423");

        form.setFieldsValue({
          name: room.roomName || "",
          roomNumber: room.roomNumber || "",
          type: room.roomType?.id || room.roomTypeId,
          bedType: room.bedType || "",
          roomSize: room.roomSize || "",
          maxAdults: room.maxAdults || 1,
          maxChildren: room.maxChildren || 0,
          pricePerNight: room.pricePerNight || 0.0,
          status: room.status || "available",
          description: room.description || "",
          mainImage: room.mainImage || "",
          galleryImages: room.galleryImages || [],
          hotel: room.hotel?.id,
          // featureIds: room.featureIds || [],
          // facility: room.features?.map((a) => a.id) || [],
          // amenities: room.features?.map((r) => r.id) || [],
          // features: room.features?.map((r) => r.id) || [],
        });
      } catch (err) {
        openNotification("error", "Failed to load hotel");
      } finally {
        setFetching(false);
      }
    };

    fetchRoomById();
  }, [id, isEditMode, form]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [amenityRes, featuresRes, facilityRes, roomTypeRes,policyTypeRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_FEATURE"),
          getAllFeature("ROOM_FACILITY"),
          getAllFeature("ROOM_TYPE"),
          getAllFeature("POLICY"),
        ]);
        // console.log(roomTypeRes.data.data, "roomTypeResroomTypeRes===");
        setAmenitiesList(amenityRes.data.data || []);
        setFeaturesList(featuresRes.data.data || []);
        setFacilityList(facilityRes.data.data || []);
        setPolicyList(policyTypeRes.data.data || []);
        setRoomTypesList(roomTypeRes.data.data || []);
        // setRulesPoliciesList(rulesPoliciesRes.data.data || []);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };

    fetchFeatures();
  }, []);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setGallery(files);
    }
  };



  const onNext = async () => {
    try {
      await form.validateFields(STETPS_FIELDS[currentStep]);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.log("Step validation failed:", error);
    }
  };

  const onBack = () => {
    setCurrentStep(currentStep - 1);
  };
  // const handleSubmit = async (values) => {
  //   setLoading(true);

  //   const payload = {
  //     roomName: values.name,
  //     roomNumber: values.roomNumber,
  //     hotelId: values.hotel,
  //     roomTypeId: values.type,
  //     bedType: values.bedType,
  //     roomSize: values.roomSize,
  //     maxAdults: values.guests,
  //     maxChildren: values.childrens,
  //     description: values.description,
  //     pricePerNight: Number(values.pricePerNight),
  //     status: values.status,
  //     featureIds: [...values.features, ...values.amenities, ...values.facility],
  //   };

  //   try {
  //     let res;

  //     if (isEditMode) {
  //       res = await updateRoom(id, payload);
  //     } else {
  //       res = await createRoom(payload);
  //     }

  //     if (![200, 201].includes(res?.status)) {
  //       throw new Error("API failed");
  //     }

  //     openNotification(
  //       "success",
  //       isEditMode ? "Room updated successfully" : "Room created successfully",
  //     );

  //     setIsModalOpen(true);
  //   } catch (err) {
  //     console.error(err);

  //     openNotification(
  //       "error",
  //       err?.response?.data?.message || "Internal Server Error",
  //     );

  //     return;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      let mainImageUrl = null;
      let galleryUrls = [];

      // Upload main image
      if (mainImage) {
        const formData = new FormData();
        formData.append("image", mainImage);

        const uploadRes = await uploadSingleMedia(formData);
        mainImageUrl = uploadRes?.data?.data?.url;
      }

      // Upload multiple images
      if (gallery.length > 0) {
        const formData = new FormData();

        gallery.forEach((file) => {
          formData.append("images", file);
        });

        const uploadRes = await uploadMultipleMedia(formData);
        galleryUrls =
          uploadRes?.data?.data?.map((item) => item.url) || [];
      }
      console.log(test)

      const payload = {
        roomName: values.name,
        roomNumber: values.roomNumber,
        hotelId: values.hotel,
        roomTypeId: values.type,
        bedType: values.bedType,
        roomSize: values.roomSize,
        maxAdults: Number(values.guests), // ✅ FIXED
        maxChildren: Number(values.childrens), // ✅ FIXED
        description: values.description,
        pricePerNight: Number(values.pricePerNight),
        status: values.status,
        featureIds: [
          ...new Set([
            ...values.features,
            ...values.amenities,
            ...values.facility,
            ...values.policy,
          ]),
        ],

        // 👇 IMPORTANT
        ...(mainImageUrl && { mainImage: mainImageUrl }),
        ...(galleryUrls.length > 0 && { galleryImages: galleryUrls }),
      };

      let res;

      if (isEditMode) {
        res = await updateRoom(id, payload);
      } else {
        res = await createRoom(payload);
      }

      if (![200, 201].includes(res?.status)) {
        throw new Error("API failed");
      }

      openNotification(
        "success",
        isEditMode
          ? "Room updated successfully"
          : "Room created successfully"
      );

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      openNotification(
        "error",
        err?.response?.data?.message || "Internal Server Error"
      );
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
            <div
              className="flex  items-center gap-4 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <div>
                <img src={arrowImg} alt="arrowImg" />
              </div>
              <p className="text-darkGray underline font-medium text-lg mt-3">
                Back
              </p>
            </div>
            <hr className="-mt-4" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Room" : "Add New Room"}
            </h1>
            <p className="text-lg text-darkGray font-medium">
              {isEditMode
                ? "Fill in the details below to edit a  room to your hotel inventory."
                : "Fill in the details below to add a new room to your hotel inventory."}
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 ">
            <div className="px-6 py-4 mb-6 ">
              <h2 className="text-lg font-semibold text-black  ">
                Room Details
              </h2>
              <hr />
            </div>
            <div className="p-6 px-36 pb-14">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Room Name
                  </label>
                  <Form.Item
                    preserve={true}
                    name="name"
                    label=""
                  // rules={[
                  //   { required: true, message: "Room Name is required" },
                  // ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {[
                        { label: "Deluxe", value: "Deluxe" },
                        { label: "Standard", value: "Standard" },
                      ].map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Room Number
                  </label>

                  <Form.Item
                    preserve={true}
                    name="roomNumber"
                    rules={[
                      { required: true, message: "Room Number  is required" },
                    ]}
                  >
                    <Input
                      className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                      placeholder="Enter room number"
                    />
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Select Hotel
                  </label>

                  <Form.Item
                    preserve={true}
                    name="hotel"
                    label=""
                  // rules={[
                  //   { required: true, message: "Room Name is required" },
                  // ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {hotelsList?.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Room Type
                  </label>

                  <Form.Item
                    preserve={true}
                    name="type"
                    label=""
                    rules={[
                      { required: true, message: "Room Type is required" },
                    ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {roomTypesList.map((item) => (
                        <Option key={item.id} value={item.id}> {/* Ab value ID jayegi */}
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Bed Type
                  </label>
                  <Form.Item
                    preserve={true}
                    name="bedType"
                    label=""
                    rules={[
                      { required: true, message: "Bed Type is required" },
                    ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {[
                        { label: "Single Bed", value: "single bed" },
                        { label: "Queen Bed", value: "queen bed" },
                        { label: "King Bed", value: "king bed" },
                        // { label: "Luxury Suits", value: "Luxury Suits" },
                      ].map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Room Size
                  </label>
                  <Form.Item
                    preserve={true}
                    name="roomSize"
                    label=""
                    rules={[
                      { required: true, message: "Room Size is required" },
                    ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {[
                        { label: "e.g. 25 m²", value: "e.g. 25 m²" },
                        { label: "e.g. 30 m²", value: "e.g. 30 m²" },
                        { label: "e.g. 35 m²", value: "e.g. 35 m²" },
                      ].map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Guest Adults
                  </label>
                  <Form.Item
                    preserve={true}
                    name="guests"
                    label=""
                    rules={[
                      { required: true, message: "Room Size is required" },
                    ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {[
                        { label: "1 Guests", value: "1" },
                        { label: "2 Guests", value: "2" },
                        { label: "3 Guests", value: "3" },
                        { label: "4 Guests", value: "4" },
                        { label: "5 Guests", value: "5" },
                        { label: "6 Guests", value: "6" },
                        { label: "7 Guests", value: "7" },
                        { label: "8 Guests", value: "8" },
                      ].map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Childrens
                  </label>
                  <Form.Item
                    preserve={true}
                    name="childrens"
                    label=""
                    rules={[
                      { required: true, message: "Room Size is required" },
                    ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                      {[
                        { label: "1 Children", value: "1" },
                        { label: "2 Childrens", value: "2" },
                        { label: "3 Childrens", value: "3" },
                        { label: "4 Childrens", value: "4" },
                        { label: "5 Childrens", value: "5" },
                        { label: "6 Childrens", value: "6" },
                        { label: "7 Childrens", value: "7" },
                        { label: "8 Childrens", value: "8" },
                      ].map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div>
                <div className="w-full ">
                  <label className="text-base text-lightSeconday font-medium">
                    Room Description
                  </label>

                  <Form.Item
                    preserve={true}
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Room Description is required",
                      },
                    ]}
                  >
                    <Input.TextArea
                      className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium"
                      placeholder="Enter description"
                    />
                  </Form.Item>
                </div>

                <h4 className="font-semibold my-8">Pricing & Status</h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="w-full ">
                    <label className="text-base text-lightSeconday font-medium">
                      Price Per Night
                    </label>

                    <Form.Item
                      preserve={true}
                      name="pricePerNight"
                      rules={[
                        {
                          required: true,
                          message: "Price Per Night is required",
                        },
                      ]}
                    >
                      <Input
                        className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium"
                        placeholder="Enter price per night"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">
                      Status
                    </label>
                    <Form.Item
                      preserve={true}
                      name="status"
                      label=""
                      rules={[
                        { required: true, message: "Status is required" },
                      ]}
                    >
                      <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                        {[
                          { label: "Active", value: "available" },
                          { label: "In Active", value: "inactive" },
                          { label: "Maintenance", value: "maintenance" },
                          { label: "Occupied", value: "occupied" },
                        ].map((item) => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 font-sans overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100">
              <h2 className="text-[18px] mb-0 font-semibold text-gray-900">
                Room Images
              </h2>
            </div>

            <div className="p-[8%] pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT: Main Image Section */}
                <div className="flex flex-col gap-4">
                  <label className="text-[15px] font-semibold text-gray-900">
                    Upload Room (Main) image
                  </label>
                  <div className="relative  group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                    <div className="flex justify-center mt-4">
                      {/* <CloudUpload className="w-6 h-6 text-gray-700" /> */}
                      <img
                        src={cloudimg}
                        alt=""
                        className="w-6 h-6 text-gray-700"
                      />
                      <p className="text-sm text-gray-700 font-medium text-center px-4">
                        Drop your image here or{" "}
                        <span className="text-blue underline">Browse</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Only JPG/PNG Files under 2 MB
                      </p>
                      <input
                        type="file"
                        onChange={handleMainImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Main Image File Info Card */}
                  {/* {mainImage && (
                      <div className=" max-h-full h-[30%] flex items-center justify-between p-10  pt-2 pb-2 rounded-lg ">
                        <div className="flex items-center gap-3  overflow-hidden">
                          <div className="bg-[#DBEAFE] p-2 rounded-lg shrink-0">
                            <FileText className="w-6 h-6 text-blue" />
                          </div>
                          <div className="truncate">
                            <p className="text-[13px] font-semibold text-gray-800 truncate mb-0">
                              {mainImage.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mb-0">
                              {mainImage.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0 ml-2">
                          <button className="p-1.5 bg-[#DBEAFE] text-blue rounded-md hover:bg-blue-200 transition-colors">
                            <img src={eye} alt="" />
                          </button>
                          <button
                            onClick={() => setMainImage(null)}
                            className="p-1.5 bg-[#FEE2E2] text-red-500 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )} */}
                </div>

                {/* RIGHT: Gallery Section */}
                <div className="flex flex-col gap-4">
                  <label className="text-[15px] font-semibold text-gray-900">
                    Gallery (Optional)
                  </label>
                  <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                    <div className="flex justify-center mt-4">
                      {/* <CloudUpload className="w-6 h-6 text-gray-700" /> */}
                      <img
                        src={cloudimg}
                        alt=""
                        className="w-6 h-6 text-gray-700"
                      />
                      <p className="text-sm text-gray-700 font-medium text-center px-4">
                        Upload multiple image
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400">
                        Only JPG/PNG Files under 2 MB
                      </p>
                      <input
                        type="file"
                        multiple  // 👈 YEH IMPORTANT HAI
                        accept="image/*"
                        onChange={handleGalleryChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Gallery File List (Scrollable if many files) */}
                  <div className="max-h-full h-[30%] flex items-center justify-between p-10  pt-2 pb-2 rounded-lg ">
                    {/* {gallery.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 "
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-[#DBEAFE] p-2 rounded-lg shrink-0">
                              <FileText className="w-6 h-6 text-blue" />
                            </div>
                            <div className="truncate">
                              <p className="text-[13px] font-medium text-gray-800 truncate mb-0">
                                {file.name}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {file.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0 ml-2">
                            <button className="p-1.5 bg-[#DBEAFE] text-blue  rounded-md hover:bg-blue-200 transition-colors">
                              <img src={eye} alt="" />
                            </button>
                            <button
                              // onClick={() => removeGalleryImage(index)}
                              className="p-1.5 bg-[#FEE2E2] text-red-500 rounded-md hover:bg-red-200 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))} */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
            >
              Back
            </button>

            <button
              // type="submit"
              onClick={onNext}
              // disabled={loading}
              className="px-10 py-2 bg-blue text-white rounded-md"
            >
              {/* {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save"} */}
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
            <div
              className="flex  items-center gap-4 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <div>
                <img src={arrowImg} alt="arrowImg" />
              </div>
              <p className="text-darkGray underline font-medium text-lg mt-3">
                Back
              </p>
            </div>
            <hr className="-mt-4" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Room" : "Add New Room"}
            </h1>
            <p className="text-lg text-darkGray font-medium">
              {isEditMode
                ? "Fill in the details below to edit a  room to your hotel inventory."
                : "Fill in the details below to add a new room to your hotel inventory."}
            </p>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-lightSeconday ">
              <div className="px-6 py-4  ">
                <h2 className="text-lg font-semibold text-black  ">
                  Room Features
                </h2>
                <hr />
              </div>
              <div className="p-6 px-36 pb-14">
                <h3 className="font-semibold mb-4">Select Room Features</h3>
                <Form.Item
                  preserve={true}
                  name="features"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one features",
                    },
                  ]}
                >
                  <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {featuresList.map((a) => {
                      const isChecked = selectedFeatures.includes(a.id);

                      return (
                        <div key={a.id} className="w-full">
                          <Checkbox
                            value={a.id}
                            className="w-full flex items-center"
                          >
                            <span
                              className={`block w-full text-sm font-medium ${isChecked ? "text-blue" : "text-lightText"
                                }`}
                            >
                              {a.title}
                            </span>
                          </Checkbox>
                        </div>
                      );
                    })}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-lightSeconday ">
              <div className="px-6 py-4  ">
                <h2 className="text-lg font-semibold text-black  ">
                  Ameneties
                </h2>
                <hr />
              </div>
              <div className="p-6 px-36 pb-14">
                <h3 className="font-semibold mb-4">Select Ameneties</h3>
                <Form.Item
                  preserve={true}
                  name="amenities"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one amenity",
                    },
                  ]}
                >
                  <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {amenitiesList?.map((a) => {
                      const isChecked = selectedAmenities.includes(a.id);

                      return (
                        <div key={a.id} className="w-full">
                          <Checkbox
                            value={a.id}
                            className="w-full flex items-center"
                          >
                            <span
                              className={`block w-full text-sm font-medium ${isChecked ? "text-blue" : "text-lightText"
                                }`}
                            >
                              {a.title}
                            </span>
                          </Checkbox>
                        </div>
                      );
                    })}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-lightSeconday ">
              <div className="px-6 py-4  ">
                <h2 className="text-lg font-semibold text-black  ">
                  Policy
                </h2>
                <hr />
              </div>
              <div className="p-6 px-36 pb-14">
                <h3 className="font-semibold mb-4">Select Policy</h3>
                <Form.Item
                  preserve={true}
                  name="policy"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one Policy",
                    },
                  ]}
                >
                  <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {policyList?.map((a) => {
                      const isChecked = selectedPolicy.includes(a.id);

                      return (
                        <div key={a.id} className="w-full">
                          <Checkbox
                            value={a.id}
                            className="w-full flex items-center"
                          >
                            <span
                              className={`block w-full text-sm font-medium ${isChecked ? "text-blue" : "text-lightText"
                                }`}
                            >
                              {a.title}
                            </span>
                          </Checkbox>
                        </div>
                      );
                    })}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-lightSeconday ">
              <div className="px-6 py-4  ">
                <h2 className="text-lg font-semibold text-black  ">
                  Room Facilities
                </h2>
                <hr />
              </div>
              <div className="p-6 px-36 pb-14">
                <h3 className="font-semibold mb-4">Select Room Facilities</h3>
                <Form.Item
                  preserve={true}
                  name="facility"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one facility",
                    },
                  ]}
                >
                  <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {facilityList.map((a) => {
                      const isChecked = selectedFacility.includes(a.id);

                      return (
                        <div key={a.id} className="w-full">
                          <Checkbox
                            value={a.id}
                            className="w-full flex items-center"
                          >
                            <span
                              className={`block w-full text-sm font-medium ${isChecked ? "text-blue" : "text-lightText"
                                }`}
                            >
                              {a.title}
                            </span>
                          </Checkbox>
                        </div>
                      );
                    })}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
          
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
            >
              Back
            </button>

            <button
              htmlType="submit"
              // onClick={onNext}
              disabled={loading}
              className="px-10 py-2 bg-blue text-white rounded-md"
            >
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Room"}
              {/* Next */}
              {/* saving */}
            </button>
          </div>
        </>
      ),
    },
  ];

  if (fetching) {
    return (
      <div className="p-20 text-center text-blue font-semibold">
        Loading hotel details...
      </div>
    );
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "Deluxe",
          // type: "Single Bed Room",
          bedType: "Single Bed",
          roomSize: "e.g. 25 m²",
          guests: "1",
          childrens: "1",
          status: "available",
          features: [],
          amenities: [],
          facility: [],
          rulesPolicies: [],
        }}
        onFinish={handleSubmit}
        className="min-h-screen w-full md:p-8 font-sans"
      >
        <div className="steps-content">
          {steps.map((step, index) => (
            <div
              key={index}
              style={{ display: currentStep === index ? "block" : "none" }}
            >
              {step.content}
            </div>
          ))}
        </div>
      </Form>

      {isModalOpen && (
        <>
          <SuccessModal
            open={true}
            // onClose={() => setIsModalOpen(false)}
            onClose={() => navigate("/admin/rooms")}
            title={
              !isEditMode
                ? "Room Added Successfully!"
                : "Room Updated Successfully!"
            }
            description={
              !isEditMode
                ? "The Room has been added successfully."
                : "The Room has been updated successfully."
            }
            showButton
            buttonText="View Rooms"
            onButtonClick={() => navigate("/admin/rooms")}
          />
        </>
      )}
    </>
  );
};

export default AddNewRoom;
