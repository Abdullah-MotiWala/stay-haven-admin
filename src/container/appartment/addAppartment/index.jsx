import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelNamesList } from "../../../services/hotel";
import { DEFAULT_IMAGE, STETPS_FIELDS } from "../../../shared/constant";

import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Steps,
  Button,
  Avatar,
  Upload,
} from "antd";
import cloudimg from "../../../assets/icons/cloud-upload.png";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import editIcon from "../../../assets/icons/editIcon.svg";

// import { createRoom, getById, updateRoom } from "../../../services/rooms";
import {
  createAppartment,
  getById,
  updateAppartment,
} from "../../../services/appartments";
const AddNewAppartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [hotel, setHotel] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [roomTypesList, setRoomTypesList] = useState([]);

  const selectedFeatures = Form.useWatch("features", form) || [];
  const selectedFacility = Form.useWatch("facility", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];

  const { Option } = Select;

  useEffect(() => {
    const fetchHotelNamesList = async () => {
      try {
        const res = await getHotelNamesList();
        console.log(res?.data?.data, "lastID2wq===");
        setHotelsList(res?.data.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };
    fetchHotelNamesList();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchAppartmentById = async () => {
      setFetching(true);
      try {
        const res = await getById(id);
        const appartment = res.data.data;
        console.log(appartment, "appartmentappartment");

        form.setFieldsValue({
          name: appartment.apartmentName || "",
          appartmentNumber: appartment.apartmentNumber || "",
          type: appartment.roomType?.id || appartment.typeId,
          bedType: appartment.bedType || "",
          roomSize: appartment.appartmentSize || "",
          maxAdults: appartment.maxAdults || 1,
          maxChildren: appartment.maxChildren || 0,
          pricePerNight: appartment.pricePerNight || 0.0,
          status: appartment.status || "available",
          description: appartment.description || "",
          mainImage: appartment.mainImage || "",
          galleryImages: appartment.galleryImages || [],
          hotel: appartment.hotel?.id,
          hostname: appartment.host?.name,
          email: appartment.host?.email,
          phoneNumber: appartment.host?.phone,
          // featureIds: appartment.featureIds || [],
          facility: appartment.features?.map((a) => a.id) || [],
          amenities: appartment.features?.map((r) => r.id) || [],
          features: appartment.features?.map((r) => r.id) || [],
        });
      } catch (err) {
        openNotification("error", "Failed to load hotel");
      } finally {
        setFetching(false);
      }
    };

    fetchAppartmentById();
  }, [id, isEditMode, form]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [amenityRes, featuresRes, facilityRes, roomTypeRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_FEATURE"),
          getAllFeature("ROOM_FACILITY"),
          getAllFeature("ROOM_TYPE"),
        ]);

        setAmenitiesList(amenityRes.data);
        setFeaturesList(featuresRes.data);
        setFacilityList(facilityRes.data);
        setRoomTypesList(roomTypeRes.data);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };

    fetchFeatures();
  }, []);

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

  const handleSubmit = async (values) => {
    setLoading(true);

    const payload = {
      apartmentName: values.name,
      apartmentNumber: values.appartmentNumber,
      hotelId: values.hotel,
      type: values.type,
      bedType: values.bedType,
      apartmentSize: values.appartmentSize,
      maxAdults: values.guests,
      maxChildren: values.childrens,
      description: values.description,
      pricePerNight: Number(values.pricePerNight),
      status: values.status,
      featureIds: [...values.features, ...values.amenities, ...values.facility],
      hostName: values.hostname,
      hostEmail: values.email,
      hostPhone: values.phoneNumber,
      hostImage: "https://ui-avatars.com/api/?name=Abdullah+Khan",
    };

    try {
      let res;

      if (isEditMode) {
        res = await updateAppartment(id, payload);
      } else {
        res = await createAppartment(payload);
      }

      if (res?.status !== 200 && res?.status !== 201) {
        throw new Error("API failed");
      }

      openNotification(
        "success",
        isEditMode
          ? "Appartment updated successfully"
          : "Appartment created successfully",
      );

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);

      openNotification(
        "error",
        err?.response?.data?.message || "Internal Server Error",
      );

      return;
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Appartment Details",
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
              {isEditMode ? "Edit Appartment" : "Add New Appartment"}
            </h1>
            <p className="text-lg text-darkGray font-medium">
              {isEditMode
                ? "Fill in the details below to edit a  appartment to your hotel inventory."
                : "Fill in the details below to add a new appartment to your hotel inventory."}
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 ">
            <div className="px-6 py-4 mb-6 ">
              <h2 className="text-lg font-semibold text-black  ">
                Appartment Details
              </h2>
              <hr />
            </div>
            <div className="p-6 px-36 pb-14">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="w-full">
                  <label className="text-base text-lightSeconday font-medium">
                    Appartment Name
                  </label>
                  <Form.Item
                    preserve={true}
                    name="name"
                    label=""
                    rules={[
                      {
                        required: true,
                        message: "appartment Name is required",
                      },
                    ]}
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
                    Appartment Number
                  </label>

                  <Form.Item
                    preserve={true}
                    name="appartmentNumber"
                    rules={[
                      {
                        required: true,
                        message: "Appartment Number  is required",
                      },
                    ]}
                  >
                    <Input
                      className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                      placeholder="Enter appartment number"
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

                    rules={[
                      {
                        required: true,
                        message: "Appartment Name is required",
                      },
                    ]}
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
                    Appartment Type
                  </label>

                  <Form.Item
                    preserve={true}
                    name="type"
                    label=""
                    rules={[
                      {
                        required: true,
                        message: "Appartment Type is required",
                      },
                    ]}
                  >
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                     {roomTypesList?.map((item) => (
                      <Option key={item.id} value={item.id}>
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
                    Appartment Size
                  </label>
                  <Form.Item
                    preserve={true}
                    name="appartmentSize"
                    label=""
                    rules={[
                      {
                        required: true,
                        message: "Appartment Size is required",
                      },
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
                    rules={[{ required: true, message: "guest is required" }]}
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
                      { required: true, message: "childern is required" },
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
                    Appartment Description
                  </label>

                  <Form.Item
                    preserve={true}
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Appartment Description is required",
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
                Appartment Images
              </h2>
            </div>

            <div className="p-[8%] pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT: Main Image Section */}
                <div className="flex flex-col gap-4">
                  <label className="text-[15px] font-semibold text-gray-900">
                    Upload Appartment (Main) image
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
                        // onChange={handleMainImageChange}
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
                        // onChange={handleGalleryChange}
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
              type="button"
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
              {isEditMode ? "Edit Appartment" : "Add New Appartment"}
            </h1>
            <p className="text-lg text-darkGray font-medium">
              {isEditMode
                ? "Fill in the details below to edit a  appartment to your hotel inventory."
                : "Fill in the details below to add a new appartment to your hotel inventory."}
            </p>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-lightSeconday ">
              <div className="px-6 py-4  ">
                <h2 className="text-lg font-semibold text-black  ">
                  Appartment Features
                </h2>
                <hr />
              </div>
              <div className="p-6 px-36 pb-14">
                <h3 className="font-semibold mb-4">
                  Select Appartment Features
                </h3>
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
                              className={`block w-full text-sm font-medium ${
                                isChecked ? "text-blue" : "text-lightText"
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
                    {amenitiesList.map((a) => {
                      const isChecked = selectedAmenities.includes(a.id);

                      return (
                        <div key={a.id} className="w-full">
                          <Checkbox
                            value={a.id}
                            className="w-full flex items-center"
                          >
                            <span
                              className={`block w-full text-sm font-medium ${
                                isChecked ? "text-blue" : "text-lightText"
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
                  Appartment Facilities
                </h2>
                <hr />
              </div>
              <div className="p-6 px-36 pb-14">
                <h3 className="font-semibold mb-4">
                  Select Appartment Facilities
                </h3>
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
                              className={`block w-full text-sm font-medium ${
                                isChecked ? "text-blue" : "text-lightText"
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
                  Host Details
                </h2>
                <hr />
              </div>
              <div className="max-w-4xl mx-auto bg-white  rounded-lg">
                {/* <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <Avatar
                      size={64}
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                    />
                    <Upload showUploadList={false}>
                      <div className="absolute bottom-0 right-0 bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer">
                        <EditOutlined className="text-white text-xs" />
                      </div>
                    </Upload>
                  </div>

                  <div>
                    <p className="text-blue-600 font-medium cursor-pointer">
                      Upload Profile image
                    </p>
                    <p className="text-gray-400 text-sm">
                      Make sure face is clear
                    </p>
                  </div>
                </div> */}
                <div className="flex items-center gap-10 mb-14 ">
                  <div className="relative">
                    <Avatar
                      size={120}
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                    />
                    <Upload showUploadList={false}>
                      <div className="absolute bottom-3 right-2 bg-blue-600  rounded-full flex items-center justify-center cursor-pointer p-1 bg-blue">
                        {/* <EditOutlined className="text-white text-xs" /> */}
                        <img
                          src={editIcon}
                          alt="Edit Icon"
                          className="editIconImg"
                        />
                      </div>
                    </Upload>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue line-clamp-0">
                      Upload Profile image
                    </h2>
                    <p className="text-lightSeconday">
                      Make sure face is clear
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full ">
                    <label className="text-base text-lightSeconday font-medium">
                      Host Name
                    </label>

                    <Form.Item
                      preserve={true}
                      name="hostname"
                      rules={[
                        {
                          required: true,
                          message: "Host Name is required",
                        },
                      ]}
                    >
                      <Input
                        className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium"
                        placeholder="Enter host name"
                      />
                    </Form.Item>
                  </div>

                  <div className="w-full ">
                    <label className="text-base text-lightSeconday font-medium">
                      Email
                    </label>

                    <Form.Item
                      preserve={true}
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Email is required",
                        },
                      ]}
                    >
                      <Input
                        className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium"
                        placeholder="Enter email"
                      />
                    </Form.Item>
                  </div>

                  <div className="w-full ">
                    <label className="text-base text-lightSeconday font-medium">
                      Phone Number
                    </label>

                    <Form.Item
                      preserve={true}
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Phone Number is required",
                        },
                      ]}
                    >
                      <Input
                        className="flex-1 h-12 p-2 border border-lightSeconday rounded-md font-medium"
                        placeholder="Enter phone number"
                        // addonBefore="+92"
                      />
                    </Form.Item>
                  </div>
                </div>
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
              disabled={loading}
              className="px-10 py-2 bg-blue text-white rounded-md"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Apartment"}
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
          type: "single room",
          bedType: "Single Bed",
          appartmentSize: "e.g. 25 m²",
          guests: "1",
          childrens: "1",
          status: "available",
          features: [],
          amenities: [],
          facility: [],
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
            onClose={() => navigate("/admin/appartments")}
            title={
              !isEditMode
                ? "Appartment Added Successfully!"
                : "Appartment Updated Successfully!"
            }
            description={
              !isEditMode
                ? "The Appartment has been added successfully."
                : "The Appartment has been updated successfully."
            }
            showButton
            buttonText="View Appartment"
            onButtonClick={() => navigate("/admin/appartments")}
          />
        </>
      )}
    </>
  );
};

export default AddNewAppartment;
