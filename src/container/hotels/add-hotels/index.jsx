import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHotel,
  getHotelById,
  lastHotelId,
  updateHotel,
} from "../../../services/hotel";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select, Checkbox } from "antd";
import { uploadSingleMedia } from "../../../services/uploads";
// import { uploadSingleMedia } from "../../../services/upload"; // Import upload service

const HotelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [hotel, setHotel] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [uploading, setUploading] = useState(false);

  const selectedRooms = Form.useWatch("rooms", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];

  const { Option } = Select;
  const isDisabled = true;

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const res = await lastHotelId();
        console.log(res?.data, "lastID===");
        setLastId(res?.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };
    fetchLastId();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchHotel = async () => {
      setFetching(true);
      try {
        const res = await getHotelById(id);
        const hotel = res.data;
        console.log(hotel.status, "hotel.statushotel.status");
        setHotel(hotel);

        // Set image preview if exists
        if (hotel.imageUrl) {
          setImagePreview(hotel.imageUrl);
        }

        form.setFieldsValue({
          name: hotel.name,
          city: hotel.city,
          address: hotel.address,
          email: hotel.email,
          cancellation_policy: hotel.cancellation_policy,
          isActive: hotel.status,
          amenities: hotel.amenities?.map((a) => a.id) || [],
          rooms: hotel.roomsIncluded?.map((r) => r.id) || [],
        });
      } catch (err) {
        openNotification("error", "Failed to load hotel");
      } finally {
        setFetching(false);
      }
    };

    fetchHotel();
  }, [id, isEditMode, form]);

  console.log(hotel.hotelId, "hotelhotel");

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [amenityRes, roomRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_TYPE"),
        ]);

        setAmenitiesList(amenityRes.data.data);
        setRoomsList(roomRes.data.data);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };

    fetchFeatures();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        openNotification("error", "Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        openNotification("error", "Please select an image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image function
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      console.log("formData", formData);
      formData.append('image', imageFile);

      const response = await uploadSingleMedia(formData);
      return response.data.data.url; // Adjust this based on your API response structure
    } catch (error) {
      console.error("Image upload failed:", error);
      openNotification("error", "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // const handleSubmit = async (values) => {
  //   setLoading(true);

  //   // Upload image first if selected
  //   let imageUrl = null;
  //   if (imageFile) {
  //     imageUrl = await uploadImage();
  //     if (!imageUrl) {
  //       setLoading(false);
  //       return; // Stop submission if image upload fails
  //     }
  //   }

  //   const payload = {
  //     name: values.name,
  //     city: values.city,
  //     address: values.address,
  //     email: values.email,
  //     cancellation_policy: values.cancellation_policy,
  //     // status: values.isActive,
  //     featureIds: [...values.amenities, ...values.rooms],
  //   };

  //   // Add imageUrl to payload if uploaded
  //   if (imageUrl) {
  //     payload.imageUrl = imageUrl;
  //   } else if (isEditMode && imagePreview !== DEFAULT_IMAGE) {
  //     // Keep existing image in edit mode if no new image selected
  //     payload.imageUrl = imagePreview;
  //   }

  //   console.log(payload, "payloadpayloadpayload");

  //   try {
  //     if (isEditMode) {
  //       await updateHotel(id, payload);
  //       openNotification("success", "Hotel updated successfully");
  //     } else {
  //       await createHotel(payload);
  //       openNotification("success", "Hotel created successfully");
  //     }

  //     setIsModalOpen(true);
  //   } catch (err) {
  //     openNotification("error", err?.response?.data?.message || "Internal Server Error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // let imageUrl = null;

      // // 1️⃣ Upload image only if new file selected
      // if (imageFile) {
      //   try {
      //     imageUrl = await uploadImage();
      //   } catch (error) {
      //     openNotification("error", "Image upload failed");
      //     setLoading(false);
      //     return;
      //   }
      // }

      // // 2️⃣ Build payload
      // const payload = {
      //   name: values.name,
      //   city: values.city,
      //   address: values.address,
      //   email: values.email,
      //   cancellation_policy: values.cancellation_policy,
      //   status: values.isActive,
      //   featureIds: [
      //     ...(values.amenities || []),
      //     ...(values.rooms || [])
      //   ],
      // };

      // // 3️⃣ Add image only if available
      // if (imageUrl) {
      //   payload.imageUrl = imageUrl;
      // } else if (isEditMode && imagePreview) {
      //   payload.imageUrl = imagePreview;
      // }

      // console.log(payload, "FINAL PAYLOAD");
      let imageUrl = null;

      if (imageFile) {
        console.log("FINAL PAYLOAD ", typeof imageFile);
        imageUrl = await uploadImage();
      }

      const payload = {
        name: values.name,
        city: values.city,
        address: values.address,
        email: values.email,
        cancellation_policy: values.cancellation_policy,
        status: values.isActive,
        featureIds: [
          ...(values.amenities || []),
          ...(values.rooms || [])
        ],
      };

      console.log("FINAL PAYLOAD 👉", imageUrl);
      if (imageUrl) {
        payload.imageUrl = imageUrl; // 👈 EXACT FIELD NAME from entity
      }

      console.log("FINAL PAYLOAD 👉", payload);

      // 4️⃣ Create or Update
      if (isEditMode) {
        await updateHotel(id, payload);
        openNotification("success", "Hotel updated successfully");
      } else {
        await createHotel(payload);
        openNotification("success", "Hotel created successfully");
      }

      setIsModalOpen(true);

    } catch (err) {
      console.log(err);
      openNotification(
        "error",
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Internal Server Error"
      );
    } finally {
      setLoading(false);
    }
  };
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
        onFinish={handleSubmit}
        className="min-h-screen w-full md:p-8 font-sans"
      >
        <div>
          <div
            className="flex items-center gap-4 cursor-pointer"
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
            {isEditMode ? "Edit Hotel" : "Add Hotel"}
          </h1>
          <p className="text-lg text-darkGray font-medium">
            {isEditMode
              ? "Edit hotel details and amenities"
              : "Add hotel details and amenities"}
          </p>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 ">
          <div className="px-6 py-4 mb-6 ">
            <h2 className="text-lg font-semibold text-black">
              Hotel Profile
            </h2>
            <hr />
          </div>
          <div className="p-6 px-36 pb-14">
            <div className="flex justify-between mb-10">
              <div className="flex items-center gap-20">
                {/* Image Upload Section */}
                <div className="relative w-[330px] h-[152px]">
                  {/* Image Preview */}
                  <img
                    src={imagePreview}
                    className="w-full h-full rounded-[16px] object-cover border"
                    alt="hotel"
                  />

                  {/* Overlay Label (Clickable Area) */}
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[16px] opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <span className="text-white text-sm font-medium">
                      {uploading ? "Uploading..." : "Change Image"}
                    </span>
                  </label>

                  {/* Input (Ab ye bilkul gayab ho jayega) */}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }} // Inline style browser default ko override karega
                    disabled={uploading}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue">
                    Upload Hotel Image
                  </h2>
                  <p className="text-lightSeconday">Make sure image is clear</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Max size: 5MB | Format: JPG, PNG, GIF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="py-2">
                  <span className="text-black font-semibold underline">
                    Hotel ID
                  </span>
                </div>
                <div
                  className={`w-24 text-center border py-3 rounded-md
    ${isDisabled
                      ? "bg-havengray text-extradark border-lightSeconday cursor-not-allowed opacity-70 pointer-events-none"
                      : "border-havengray text-black"
                    }
  `}
                >
                  <span className="select-none">
                    {isEditMode ? hotel.hotelId : lastId?.nextNumericId}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Hotel Name
                </label>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Hotel name is required" },
                  ]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                    placeholder="Enter hotel name"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  City
                </label>

                <Form.Item
                  name="city"
                  label=""
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                    <Option value="Karachi">Karachi</Option>
                    <Option value="Lahore">Lahore</Option>
                    <Option value="Islamabad">Islamabad</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Hotel Location
                </label>
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: "address is required" }]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                    placeholder="Enter address name"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Hotel Email
                </label>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true },
                    { type: "email", message: "Invalid email" },
                  ]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                    placeholder="Enter email name"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Cancellation Policy
                </label>
                <Form.Item
                  name="cancellation_policy"
                  rules={[
                    {
                      required: true,
                      message: "Cancellation policy is required",
                    },
                  ]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                    placeholder="Enter cancellation policy"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Status
                </label>
                <Form.Item name="isActive">
                  <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="maintenance">Maintenance</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <h3 className="font-semibold mb-4">Amenities Included</h3>
            <Form.Item
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

            <h3 className="font-semibold mb-4">Rooms Included</h3>
            <Form.Item
              name="rooms"
              className="w-full"
              rules={[
                {
                  required: true,
                  message: "Please select at least one option",
                },
              ]}
            >
              <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {roomsList.map((r) => {
                  const isChecked = selectedRooms.includes(r.id);

                  return (
                    <div key={r.id} className="w-full">
                      <Checkbox
                        value={r.id}
                        className="w-full flex items-center"
                      >
                        <span
                          className={`block w-full text-sm font-medium ${isChecked ? "text-blue" : "text-lightText"
                            }`}
                        >
                          {r.title}
                        </span>
                      </Checkbox>
                    </div>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
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
            type="submit"
            disabled={loading || uploading}
            className={`px-10 py-2 bg-blue text-white rounded-md ${(loading || uploading) ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {uploading ? "Uploading Image..." : loading ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
          </button>
        </div>
      </Form>
      {isModalOpen && (
        <>
          <SuccessModal
            open={true}
            onClose={() => navigate("/admin/hotels")}
            title={
              !isEditMode
                ? "Hotel Added Successfully!"
                : "Hotel Updated Successfully!"
            }
            description={
              !isEditMode
                ? "The hotel has been added successfully."
                : "The hotel has been updated successfully."
            }
            showButton
            buttonText="View Hotels"
            onButtonClick={() => navigate("/admin/hotels")}
          />
        </>
      )}
    </>
  );
};

export default HotelForm;