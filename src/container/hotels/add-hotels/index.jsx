import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHotel,
  getHotelById,
  updateHotel,
} from "../../../services/hotel";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select, Checkbox } from "antd";
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

  const selectedRooms = Form.useWatch("rooms", form) || [];
  const selectedAmenities = Form.useWatch("amenities", form) || [];

  const { Option } = Select;

  useEffect(() => {
    if (!isEditMode) return;

    const fetchHotel = async () => {
      setFetching(true);
      try {
        const res = await getHotelById(id);
        const hotel = res.data;

        form.setFieldsValue({
          name: hotel.name,
          city: hotel.city,
          address: hotel.address,
          email: hotel.email,
          cancellation_policy: hotel.cancellation_policy,
          status: hotel.status ,
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
    setLoading(true);

    const payload = {
      name: values.name,
      city: values.city,
      address: values.address,
      email: values.email,
      cancellation_policy: values.cancellation_policy,
      status: values.isActive,
      featureIds: [...values.amenities, ...values.rooms],
    };

    console.log(payload, "payloadpayloadpayload");
    try {
      if (isEditMode) {
        await updateHotel(id, payload);
        openNotification("success", "Hotel updated successfully");
      } else {
        await createHotel(payload);
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
            <h2 className="text-lg font-semibold text-black  ">
              Hotel Profile
            </h2>
            <hr />
          </div>
          <div className="p-6 px-36 pb-14">
            <div className="flex   justify-between mb-10">
              <div className="flex items-center gap-20 ">
                <img
                  src={DEFAULT_IMAGE}
                  className="w-[330px] h-[152px] rounded-[16px] object-cover border"
                  alt="hotel"
                />
                <div>
                  <h2 className="text-xl font-semibold text-blue">
                    Upload Hotel Image
                  </h2>
                  <p className="text-lightSeconday">Make sure image is clear</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="py-2">
                  <span className="text-black font-semibold underline">
                    Hotel ID
                  </span>
                </div>
                <div className="w-24 text-center border py-2 border-havengray   rounded-md ">
                  <span className="py-2">301</span>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="w-full">
                <label className="text-base text-lightSeconday font-medium">
                  Hotel Name
                </label>
                {/* <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                  placeholder="Enter hotel name"
                /> */}
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
                {/* <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                  placeholder="Enter location"
                /> */}
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
                {/* <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                  placeholder="Enter email"
                /> */}
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
                {/* <input
                  type="text"
                  name="cancellation_policy"
                  value={formData.cancellation_policy}
                  onChange={handleInputChange}
                  className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                  placeholder="Enter policy"
                /> */}
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

            {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               {amenitiesList.map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(item.id)}
                    onChange={() => toggleAmenity(item.id)}
                    className="w-5 h-5 rounded border-lightGray text-blue checked:accent-blue"
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.amenities.includes(item.id)
                        ? "text-blue"
                        : "text-lightText"
                    }`}
                  >
                    {item.title}
                  </span>
                </label>
              ))} 
            </div>*/}

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
                          className={`block w-full text-sm font-medium ${
                            isChecked ? "text-blue" : "text-lightText"
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
            disabled={loading}
            className="px-10 py-2 bg-blue text-white rounded-md"
          >
            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
          </button>
        </div>
      </Form>
      {isModalOpen && (
        <>
          <SuccessModal
            open={true}
            // onClose={() => setIsModalOpen(false)}
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
