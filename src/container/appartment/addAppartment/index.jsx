import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelNamesList, getHotelById } from "../../../services/hotel";
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
import { DeleteFilled, EditOutlined, UploadOutlined } from "@ant-design/icons";
import editIcon from "../../../assets/icons/editIcon.svg";
import { Trash2 } from "lucide-react";

// import { createRoom, getById, updateRoom } from "../../../services/rooms";
import {
  createAppartment,
  getById,
  updateAppartment,
} from "../../../services/appartments";
import { uploadMultipleMedia, uploadSingleMedia } from "../../../services/uploads";
import { Delete } from "lucide-react";
const AddNewAppartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();
  const [gallery, setGallery] = useState([]);
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
  const [hostImageFile, setHostImageFile] = useState(null);
  const [hostImagePreview, setHostImagePreview] = useState(DEFAULT_IMAGE);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState();
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const selectedFeatures = Form.useWatch("features", form) || [];
  const selectedFacility = Form.useWatch("facility", form) || [];
  const [policyList, setPolicyList] = useState([]);
  const selectedAmenities = Form.useWatch("amenities", form) || [];
  const [mainImage, setMainImage] = useState(null);
  const selectedPolicy = Form.useWatch("policy", form) || [];
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
    console.log(hotelsList, "hotellist data");
    const fetchAppartmentById = async () => {
      setFetching(true);
      try {
        const res = await getById(id);
        const appartment = res.data.data;
        console.log(appartment, "appartmentappartment");

        // Load room types for this hotel
        if (appartment.hotel?.id) {
          try {
            const hotelRes = await getHotelById(appartment.hotel.id);
            const hotelFeatures = hotelRes?.data?.data?.features || hotelRes?.data?.features || [];
            setRoomTypesList(hotelFeatures.filter(f => f.type === "ROOM_TYPE"));
          } catch (e) {
            console.error("Failed to load hotel room types", e);
          }
        }

        // Set main image preview if exists
        if (appartment.mainImage) {
          setMainImagePreview(appartment.mainImage);
        }

        // Set gallery previews if exist
        if (appartment.galleryImages && appartment.galleryImages.length > 0) {
          setGalleryPreviews(appartment.galleryImages);
        }

        form.setFieldsValue({
          name: appartment.apartmentName || "",
          appartmentNumber: appartment.apartmentNumber || "",
          type: appartment.roomType?.id || appartment.typeId || undefined,
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
          policy: appartment.features?.map((a) => a.id) || [],
          amenities: appartment.features?.map((r) => r.id) || [],
          features: appartment.features?.map((r) => r.id) || [],
          maxinfants: appartment.maxInfants || 0,
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
        const [amenityRes, featuresRes, facilityRes, roomTypeRes, policyTypeRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_FEATURE"),
          getAllFeature("ROOM_FACILITY"),
          getAllFeature("ROOM_TYPE"),
          getAllFeature("POLICY"),
        ]);
        console.log(roomTypeRes, "roomTypeResroomTypeRes===");
        setAmenitiesList(amenityRes.data.data);
        setFeaturesList(featuresRes.data.data);
        setFacilityList(facilityRes.data.data);
        setRoomTypesList(roomTypeRes.data.data);
        setPolicyList(policyTypeRes.data.data || []);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };

    fetchFeatures();
  }, []);

  const handleHostImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected host image:", file);

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        openNotification("error", "Host image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        openNotification("error", "Please select an image file");
        return;
      }

      setHostImageFile(file);  // ✅ hostImageFile set karo
      const reader = new FileReader();
      reader.onloadend = () => {
        setHostImagePreview(reader.result);  // ✅ hostImagePreview set karo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainImageChange = (e) => {
  const file = e.target.files[0];
  console.log("Selected main image:", file);
 
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      openNotification("error", "Main image size should be less than 5MB");
      return;
    }
 
    if (!file.type.startsWith('image/')) {
      openNotification("error", "Please select an image file");
      return;
    }
 
    setMainImageFile(file);
 
    // ✅ FIX: Form field value set karo taake validator pass ho aur error clear ho
    form.setFieldValue("mainImageUpload", file.name);
    form.validateFields(["mainImageUpload"]); // error turant clear karo
 
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};
 
// removeMainImage ko bhi update karo — form field reset karo
const removeMainImage = () => {
  setMainImageFile(null);
  setMainImagePreview(null);
  // ✅ FIX: Image remove hone par field clear karo taake validator dobara kaam kare
  form.setFieldValue("mainImageUpload", undefined);
};
 

  const removeHostImage = () => {
    setHostImageFile(null);
    setHostImagePreview(DEFAULT_IMAGE);
  };

  // Upload main image
  const uploadMainImage = async () => {
    if (!mainImageFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', mainImageFile);
      const response = await uploadSingleMedia(formData);
      return response.data.data.url;
    } catch (error) {
      console.error("Main image upload failed:", error);
      openNotification("error", "Failed to upload main image");
      return null;
    } finally {
      setUploading(false);
    }
  };
  const uploadHostImage = async () => {
    if (!hostImageFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', hostImageFile);
      const response = await uploadSingleMedia(formData);
      return response.data.data.url;
    } catch (error) {
      console.error("Host image upload failed:", error);
      openNotification("error", "Failed to upload host image");
      return null;
    } finally {
      setUploading(false);
    }
  };
  // Handle multiple gallery images selection
  // Handle multiple gallery images selection
  // Handle multiple gallery images selection
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected gallery files:", files);

    if (files.length > 0) {

      if (galleryFiles.length + files.length > 5) {
        openNotification("error", "Maximum 5 gallery images allowed");
        return;
      }


      const validFiles = files.filter(file => {

        if (file.size > 1 * 1024 * 1024) {
          openNotification("error", `${file.name} size should be less than 2MB`);
          return false;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          openNotification("error", `${file.name} is not an image file`);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      // Generate previews for valid files
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });

      setGalleryFiles(prev => [...prev, ...validFiles]);

      // Reset input value so same file can be selected again if needed
      e.target.value = null;
    }
  };

  // Remove single gallery image
  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload multiple gallery images - USING uploadMultipleMedia
  const uploadGalleryImages = async () => {
    if (galleryFiles.length === 0) return [];

    const uploadedUrls = [];
    setUploading(true);

    try {
      // Create FormData with all images
      const formData = new FormData();

      // Append all gallery files
      galleryFiles.forEach((file) => {
        formData.append('images', file); // 'images' field name as per backend
      });

      // Upload all images at once
      const response = await uploadMultipleMedia(formData);
      console.log("Gallery upload response:", response.data.data.data.data);

      // Get URLs from response - adjust according to your API response structure
      const urls = response?.data?.data?.url || response?.data?.data?.data?.url || [];
      console.log("urlswkiqowk", response?.data);
      console.log("urlswkiqowk", response?.data?.data);
      console.log("urlswkiqowk", response?.data?.data?.url);

      return urls;

    } catch (error) {
      console.error("Gallery images upload failed:", error);
      openNotification("error", "Failed to upload gallery images");
      return [];
    } finally {
      setUploading(false);
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

  //   // Upload main image if selected
  //   let mainImageUrl = null;
  //   if (mainImageFile) {
  //     mainImageUrl = await uploadMainImage();
  //     if (!mainImageUrl) {
  //       setLoading(false);
  //       return;
  //     }
  //   }

  //   // Upload gallery images if selected
  //   let galleryUrls = [];
  //   if (galleryFiles.length > 0) {
  //     galleryUrls = await uploadGalleryImages();
  //   }


  //   const payload = {
  //     apartmentName: values.name,
  //     apartmentNumber: values.appartmentNumber,
  //     hotelId: values.hotel,
  //     type: values.type,
  //     bedType: values.bedType,
  //     apartmentSize: values.appartmentSize,
  //     maxAdults: values.guests,
  //     maxChildren: values.childrens,
  //     description: values.description,
  //     pricePerNight: Number(values.pricePerNight),
  //     status: values.status,
  //     featureIds: [...values.features, ...values.amenities, ...values.facility],
  //     hostName: values.hostname,
  //     hostEmail: values.email,
  //     hostPhone: values.phoneNumber,
  //     hostImage: "https://ui-avatars.com/api/?name=Abdullah+Khan",
  //   };

  //   try {
  //     let res;

  //     if (isEditMode) {
  //       res = await updateAppartment(id, payload);
  //     } else {
  //       res = await createAppartment(payload);
  //     }

  //     if (res?.status !== 200 && res?.status !== 201) {
  //       throw new Error("API failed");
  //     }

  //     openNotification(
  //       "success",
  //       isEditMode
  //         ? "Appartment updated successfully"
  //         : "Appartment created successfully",
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

    // Upload main image if selected
    let mainImageUrl = null;
    if (mainImageFile) {
      mainImageUrl = await uploadMainImage();
      if (!mainImageUrl) {
        setLoading(false);
        return;
      }
    }

    let hostImageUrl = null;
    if (hostImageFile) {
      hostImageUrl = await uploadHostImage();
      if (!hostImageUrl) {
        setLoading(false);
        return;
      }
    }

    // Upload gallery images if selected
    let galleryUrls = [];
    if (galleryFiles.length > 0) {
      galleryUrls = await uploadGalleryImages();
    }
    console.log("galleryUrls", galleryUrls);


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
      featureIds: [...values.features, ...values.amenities, ...values.facility, ...values.policy],
      hostName: values.hostname,
      hostEmail: values.email,
      hostPhone: values.phoneNumber,
      maxInfants: Number(values.maxinfants),

      // hostImage: "https://ui-avatars.com/api/?name=Abdullah+Khan",
    };

    // 👇 YEH IMPORTANT LINES HAIN - IMAGES PAYLOAD MEIN ADD KARO 👇

    // Add mainImage to payload
    if (mainImageUrl) {
      payload.mainImage = mainImageUrl;  // New uploaded image
    } else if (isEditMode && mainImagePreview !== DEFAULT_IMAGE) {
      payload.mainImage = mainImagePreview;  // Existing image from edit mode
    }

    // Add hostImage to payload
    if (hostImageUrl) {
      payload.hostImage = hostImageUrl;  // New uploaded host image
    } else if (isEditMode && hostImagePreview !== DEFAULT_IMAGE) {
      payload.hostImage = hostImagePreview;  // Existing host image from edit mode
    }

    // Add galleryImages to payload
    if (galleryUrls.length > 0) {
      payload.galleryImages = galleryUrls;  // New uploaded gallery images
    } else if (isEditMode && galleryPreviews.length > 0) {
      payload.galleryImages = galleryPreviews;  // Existing gallery from edit mode
    }

    console.log("FINAL PAYLOAD WITH IMAGES:", payload); // Check karo images aa rahi hain

    try {
      let res;

      if (isEditMode) {
        res = await updateAppartment(id, payload);
      } else {
        res = await createAppartment(payload);
      }

      if (res?.data?.success === false) {
        openNotification("error", res?.data?.message || "Failed to save apartment");
        return;
      }

      if (res?.status !== 200 && res?.status !== 201) {
        throw new Error(res?.data?.message || "API failed");
      }

      openNotification(
        "success",
        isEditMode ? "Apartment updated successfully" : "Apartment created successfully",
      );
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      openNotification("error", err?.response?.data?.message || err?.message || "Internal Server Error");
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
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Type" showSearch>
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
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Hotel selection is required",
                  //   },
                  // ]}
                  >
                    <Select
                      className="w-full h-12 border border-lightSeconday rounded-md font-medium"
                      placeholder="Select a hotel"
                      onChange={async (val) => {
                        console.log("Selected Value:", val);
                        form.setFieldValue("type", undefined);
                        try {
                          const res = await getHotelById(val);
                          const hotelFeatures = res?.data?.data?.features || res?.data?.features || [];
                          const roomTypes = hotelFeatures.filter(f => f.type === "ROOM_TYPE");
                          setRoomTypesList(roomTypes);
                        } catch (e) {
                          console.error("Failed to load hotel room types", e);
                        }
                      }}
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      showSearch
                    >
                      {Array.isArray(hotelsList) && hotelsList.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
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
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} placeholder="Select appartment type">
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
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} placeholder="Select bed type">
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
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} placeholder="Select appartment size">
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
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} placeholder="Select number of guests">
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
                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} placeholder="Select number of childrens">
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
                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">
                      Max Infants
                    </label>
                    <Form.Item
                      preserve={true}
                      name="maxinfants"
                      label=""
                      rules={[
                        { required: true, message: "Max Infants is required" },
                      ]}
                    >
                      <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Max Infants">
                        {["0","1","2","3","4","5","6"].map((v) => (
                          <Option key={v} value={v}>{v} {v === "0" ? "Infants" : v === "1" ? "Infant" : "Infants"}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
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
                      <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} placeholder="Select status" >
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
                <Form.Item
                  name="mainImageUpload"
                  // ✅ FIX: validateTrigger="none" — automatic validation band, sirf onNext pe chalegi
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
                      Upload Appartment (Main) image
                    </label>
                    {!mainImagePreview ? (
                      <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                        <div className="flex justify-center mt-4">
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
                            Only JPG/PNG Files under 1 MB
                          </p>
                          <input
                            type="file"
                            onChange={handleMainImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full group">
                        <img
                          src={mainImagePreview}
                          alt="Main Preview"
                          className="w-full h-[180px] object-cover rounded-[15px] border border-gray-200"
                        />
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

                {/* RIGHT: Gallery Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-[15px] font-semibold text-dark">
                      Gallery (Optional) - Max 5 images
                    </label>
                   
                  </div>
                  <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
                    <div className="flex justify-center mt-4">
                      <img
                        src={cloudimg}
                        alt=""
                        className="w-6 h-6 text-gray-700"
                      />
                      <p className="text-sm text-gray-700 font-medium text-center px-4">
                        Click to upload multiple images
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Only JPG/PNG Files under 1 MB each
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Gallery Previews with Remove Option */}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4 max-h-[200px] overflow-y-auto p-2">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Gallery ${index}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-5 -right-2 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <DeleteFilled size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected Count */}
                  <p className="text-xs text-gray-400">
                    {galleryFiles.length}/5 images selected
                  </p>
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
            <div>
              {[


                { title: "Policy", name: "policy", list: policyList, selected: selectedPolicy, label: "Select Policy" },

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
                  Host Details
                </h2>
                <hr />
              </div>
              <div className="max-w-4xl px-4 mx-auto bg-white  rounded-lg">
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
                <Form.Item
                  name="hostImageUpload"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (hostImagePreview !== DEFAULT_IMAGE) return Promise.resolve();
                        return Promise.reject(new Error("Host image is required"));
                      },
                    },
                  ]}
                >
                  <div className="flex items-center gap-10 mb-14 ">
                    <div className="relative inline-block group">
                      {/* ✅ Pure Avatar ko label mein wrap kar diya taake click karne par input trigger ho */}
                      {hostImagePreview !== DEFAULT_IMAGE ? (
                        <div className="relative">
                          <Avatar
                            size={120}
                            src={hostImagePreview}
                            className="cursor-pointer transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-full flex items-center justify-center cursor-pointer" onClick={removeHostImage}>
                            <Trash2 size={30} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="host-image-upload" className="cursor-pointer">
                          <Avatar
                            size={120}
                            src="https://ui-avatars.com/api/?name=Host+Image"
                            className="hover:opacity-80 transition-opacity"
                          />
                        </label>
                      )}

                      <input
                        id="host-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleHostImageChange}
                        className="hidden"
                        style={{ display: "none" }}
                      />

                      {/* ✅ Agar aap edit icon bhi wapis lana chahen to label ko yahan bhi use kar sakte hain */}
                      {hostImagePreview === DEFAULT_IMAGE && (
                        <label
                          htmlFor="host-image-upload"
                          className="absolute bottom-2 right-2 bg-blue rounded-full flex items-center justify-center cursor-pointer p-2 hover:bg-blue-700 transition-colors shadow-lg"
                        >
                          <img
                            src={editIcon}
                            alt="Edit Icon"
                            className="w-4 h-4"
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-blue line-clamp-0">
                        Upload Profile image
                      </h2>
                      <p className="text-lightSeconday">
                        Make sure face is clear
                      </p>
                      {hostImageFile && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {hostImageFile.name} selected
                        </p>
                      )}
                    </div>
                  </div>
                </Form.Item>

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
              disabled={loading || uploading}
              className={`px-10 py-2 bg-blue text-white rounded-md ${(loading || uploading) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploading ? "Uploading Images..." : loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Apartment"}
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
          type: "",
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
