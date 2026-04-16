import React, { useState } from 'react';
import FormInput from '../../container/rooms/room-from';
import { CloudUpload, FileText, Eye, Trash2 } from 'lucide-react';
import leftangle from "../../assets/icons/leftangle.png"
import { Form, Input, Select, Checkbox } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRoom,
  updateRoom,
} from "../../services/rooms";
import { DEFAULT_IMAGE } from "../../shared/constant";
import arrowImg from "../../assets/icons/arrow.png";
import { getAllFeature } from "../../services/features";
import { openNotification } from "../../network/notification";
import SuccessModal from "../../components/shared/successModal";
import cloudimg from "../../assets/icons/cloud-upload.png";
import eye from "../../assets/icons/eye.png"
const RoomDetailsForm = () => {
  const [formData, setFormData] = useState({
    roomName: '', roomNumber: '', hotel: '', roomType: '',
    bedType: '', roomSize: '', adults: '', children: '',
    description: '', price: '', status: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  // Handle Main Image
  // Handle Main Image - FIXED
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }


    setMainImage({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      date: new Date().toLocaleString(),
      file: file // Actual file bhi save karo
    });

    // Reset input for multiple selection
    e.target.value = null;
  };

  // Handle Gallery Images - FIXED  
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }


    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      date: new Date().toLocaleDateString(),
      file: file
    }));

    setGallery(prev => [...prev, ...newFiles]);

    // Reset input
    e.target.value = null;
  };


  const removeGalleryImage = (index) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);

  const selectedRooms = Form.useWatch("rooms", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];

  const { Option } = Select;

  useEffect(() => {
    if (!isEditMode) return;

    const fetchRooms = async () => {
      setFetching(true);
      try {
        const res = await updateRoom(id);
        const rooms = res.data;
        form.setFieldsValue({
          name: rooms.name,
          roomNumber: rooms.room_number,
          hotel: rooms.rooms,
          room_type: rooms.room_type,
          bed_type: rooms.bed_type,
          size: rooms.siza ? "25 m2" : "50 m2",
          guest: rooms.guest,
          childrens: rooms.childrens,
          description: rooms.description,
          status: rooms.status ? "maintenace" : "avalabe"


        });
      } catch (err) {
        openNotification(err, "Failed to load hotel");
      } finally {
        setFetching(false);
      }
    };

    fetchRooms();
  }, [id, isEditMode, form]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [amenityRes, roomRes] = await Promise.all([
          getAllFeature("AMENITY"),
          getAllFeature("ROOM_TYPE"),
        ]);

        setAmenitiesList(amenityRes.data);
        setRoomsList(roomRes.data);
      } catch {
        openNotification("error", "Failed to load features");
      }
    };

    fetchFeatures();
  }, []);

  const handleSubmit = async (values) => {

    const payload = {
      name: values.name,
      roomNumber: values.room_number,
      select_hotel: values.select_hotel,
      type: values.room_type,
      bed_type: values.bed_type,
      size: values.siza,
      guest: values.guest,
      childrens: values.childrens,
      description: values.description,
      status: values.status,
      price: values.price,
      status: values.status
    };

    try {
      if (isEditMode) {
        await updateRoom(id, payload);
        openNotification("success", "Hotel updated successfully");
      } else {
        await createRoom(payload);
        openNotification("success", "Hotel created successfully");
      }

      setIsModalOpen(true);
    } catch (err) {
      openNotification("error", "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-20 text-center text-blue font-semibold">
        Loading Rooms details...
      </div>
    );
  }



  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="min-h-screen w-full md:p-8 font-sans "
      >
        <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
          <img src={leftangle} alt="" />
          <button className='text-gray-600 flex'>Back</button>

        </div>
        <div className="max-full mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
          <p className="text-sm text-gray-500 font-medium">Fill in the details below to add a new room to your hotel inventory.</p>
        </div>


        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 ">
          <div className="px-6 py-4 mb-6 ">
            <h2 className="text-lg font-semibold text-black  ">
              Room Details
            </h2>
            <hr />
          </div>
          <div className="p-6 px-36 pb-14">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Room Name
                </label>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Room name is required" },
                  ]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-dark rounded-md font-medium"
                    placeholder="Enter room name"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Room Number
                </label>

                <Form.Item
                  name="room_number"
                  label=""
                  rules={[{ required: true, message: "Room Number is required" }]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-dark rounded-md font-medium"
                    placeholder="Enter room number"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Select Hotel
                </label>
                <Form.Item
                  name="select_hotel"
                  rules={[{ required: true, message: "hotel is required" }]}
                >
                  <Input
                    className="w-full h-12 p-2 border border-dark rounded-md font-medium"
                    placeholder="Enter hotel name"
                  />
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Room Type
                </label>
                <Form.Item
                  name="room_type"
                  rules={[
                    { required: true },
                    { message: "Room type required" },
                  ]}
                >
                  <Select className="w-full h-12 p-2 border border-dark rounded-md font-medium">
                    <Option value="true">Single Bed Room</Option>
                    <Option value="false">Double Bed Room</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Bed Type
                </label>
                <Form.Item
                  name="bed_type"
                  rules={[
                    {
                      required: true,
                      message: "Bed type is required",
                    },
                  ]}

                >
                  <Select className="w-full h-12 p-2 border border-dark rounded-md font-medium">
                    <Option value="single_bed">Single Bed</Option>
                    <Option value="queen_bed">Queen Bed</Option>
                    <Option value="king_bed">King Bed</Option>

                  </Select>
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Room Size
                </label>
                <Form.Item name="size">
                  <Select className="w-full h-12 p-2 border border-dark rounded-md font-medium">
                    <Option value="true">25 m2</Option>
                    <Option value="false">50 m2</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Guest Adults
                </label>
                <Form.Item
                  name="guest"
                  rules={[
                    { required: true },
                    { message: "Room type required" },
                  ]}
                >
                  <Select className="w-full h-12 p-2 border border-dark rounded-md font-medium">
                    <Option value="two_gest">2 Gests</Option>
                    <Option value="four_gest">4 Gests</Option>
                  </Select>
                </Form.Item>
              </div>



              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Childrens
                </label>
                <Form.Item
                  name="childrens"
                  rules={[
                    { required: true },
                    { message: "Room type required" },
                  ]}
                >
                  <Select className="w-full h-12 p-2 border border-dark rounded-md font-medium">
                    <Option value="two_gest">2 Childrens</Option>
                    <Option value="four_gest">4 Childrens </Option>
                  </Select>
                </Form.Item>
              </div>




            </div>
            <div className="w-full">
              

              <label className="text-base text-lightSeconday font-medium">
                Room Description
              </label>
              <Form.Item
                name="description"
                rules={[
                  { required: true },
                  { message: "Room type required" },
                ]}
              >
                <Input
                  className="w-full h-12 p-10 border border-dark rounded-md font-medium"
                  placeholder="Enter room description"
                />
              </Form.Item>
              <div>
                <h3 className='font-semibold mb-4'>Pricing & Status</h3>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>

                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">
                      Price Per Night
                    </label>
                    <Form.Item
                      name="price"
                      rules={[
                        { required: true },
                        { message: "Room price required" },
                      ]}
                    >
                      <Input
                        className="w-full h-12 p-2 border border-dark rounded-md font-medium"
                        placeholder="Enter room description"
                        type='number'
                      />
                    </Form.Item>
                  </div>


                  <div className="w-full">
                    <label className="text-base text-lightSeconday font-medium">
                      Room Status
                    </label>
                    <Form.Item
                      name="status"
                      rules={[
                        { required: true },
                        { message: "Room type required" },
                      ]}
                    ><Select className="w-full h-12 p-2 border border-dark rounded-md font-medium">
                        <Option value="availble">Available</Option>
                        <Option value="maintenance">Maintenace</Option>
                        <Option value="occupied">Occupied</Option>

                      </Select>

                    </Form.Item>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>



        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 font-sans overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100">
            <h2 className="text-[18px] mb-0 font-semibold text-gray-900">Room Images</h2>
          </div>

          <div className="p-[8%] pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* LEFT: Main Image Section - FIXED */}
              <div className="flex flex-col gap-4">
                <label className="text-[15px] font-semibold text-gray-900">Upload Room (Main) image</label>

                <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">

                  <div className="flex justify-center mt-4">
                    <img src={cloudimg} alt="" className="w-6 h-6 text-gray-700" />
                    <p className="text-sm text-gray-700 font-medium text-center px-4">
                      Drop your image here or <span className="text-blue underline">Browse</span>
                    </p>
                  </div>

                  <p className="text-[11px] text-gray-400">Only JPG/PNG Files under 2 MB</p>

                  {/* ✅ FIXED: Input as DIRECT CHILD */}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleMainImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* ✅ File Info - Working */}
                {mainImage && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#DBEAFE] p-2 rounded-lg shrink-0">
                        <FileText className="w-6 h-6 text-blue" />
                      </div>
                      <div className="truncate">
                        <p className="text-[13px] font-semibold text-gray-800 truncate mb-0">{mainImage.name}</p>
                        <p className="text-[11px] text-gray-400 mb-0">{mainImage.size} | {mainImage.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="p-1.5 bg-[#DBEAFE] text-blue rounded-md hover:bg-blue-200 transition-colors">
                        <img src={eye} alt="" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMainImage(null)}
                        className="p-1.5 bg-[#FEE2E2] text-red-500 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Gallery Section - FIXED */}
              <div className="flex flex-col gap-4">
                <label className="text-[15px] font-semibold text-gray-900">Gallery (Optional)</label>

                <div className="relative group w-full h-[100px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">

                  <div className="flex justify-center mt-4">
                    <img src={cloudimg} alt="" className="w-6 h-6 text-gray-700" />
                    <p className="text-sm text-gray-700 font-medium text-center px-4">
                      Upload multiple images
                    </p>
                  </div>

                  <p className="text-[11px] text-gray-400">Only JPG/PNG Files under 2 MB</p>

                  {/* ✅ FIXED: Input as DIRECT CHILD + multiple attribute */}
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleGalleryChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* ✅ Gallery List */}
                {gallery.length > 0 && (
                  <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border">
                    {gallery.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#DBEAFE] p-2 rounded-lg shrink-0">
                            <FileText className="w-6 h-6 text-blue" />
                          </div>
                          <div className="truncate">
                            <p className="text-[13px] font-medium text-gray-800 truncate mb-0">{file.name}</p>
                            <p className="text-[11px] text-gray-400">{file.size} | {file.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button className="p-1.5 bg-[#DBEAFE] text-blue rounded-md hover:bg-blue-200 transition-colors">
                            <img src={eye} alt="" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeGalleryImage(index)}
                            className="p-1.5 bg-[#FEE2E2] text-red-500 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
            type="submit"
            disabled={loading}
            className="px-10 py-2 bg-blue text-white rounded-md"
          >
            {loading ? "loading..." : isEditMode ? "Next" : "Next"}
          </button>
        </div>
      </Form>

      {/* {isModalOpen && (
          <>
            <SuccessModal
              open={isModalOpen}
              // onClose={() => setIsModalOpen(false)}
              onClose={() => navigate("admin/rooms")}
              showButton
              buttonText="View Hotels"
              onButtonClick={() => navigate("/admin/hotels")}
            />
          </>
        )} */}
    </>
  );
};

export default RoomDetailsForm;

