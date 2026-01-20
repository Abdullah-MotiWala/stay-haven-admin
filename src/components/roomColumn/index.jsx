import React from 'react';
import { useState, useEffect } from 'react';
import leftangle from '../../assets/icons/leftangle.png';
import { useNavigate, useParams } from "react-router-dom"
import { Form, Input, Select, Checkbox } from "antd";
import {
    createRoom,
    updateRoom
} from "../../services/rooms";
import FormInput from '../../container/rooms/room-from';
import { CloudUpload, FileText, Eye, Trash2 } from 'lucide-react';
import { DEFAULT_IMAGE } from "../../shared/constant";
import arrowImg from "../../assets/icons/arrow.png";
import { getAllFeature } from "../../services/features";
import { openNotification } from "../../network/notification";
import SuccessModal from "../../components/shared/successModal";
import cloudimg from "../../assets/icons/cloud-upload.png";
import eye from "../../assets/icons/eye.png";
const RoomCloumns = (props) => {
    //  const {feature,amenity,facilities} = props;
    const [features, setFeatures] = useState({
        spacious: true,
        balcony: true,
        stay: true,
        workspace: false,
        water: false,
        lunch: false,
    });
    const [formData, setFormData] = useState({
        roomName: '', roomNumber: '', hotel: '', roomType: '',
        bedType: '', roomSize: '', adults: '', children: '',
        description: '', price: '', status: ''
    });
    const handleCheckboxChange = (name) => {
        setFeatures(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const [mainImage, setMainImage] = useState(null);
    const [gallery, setGallery] = useState([]);

    // Handle Main Image
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage({
                name: file.name,
                size: (file.size / 1024).toFixed(2) + " KB",
                date: new Date().toLocaleString(),
            });
        }
    };

    // Handle Gallery Images
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            name: file.name,
            date: new Date().toLocaleString(),
        }));
        setGallery([...gallery, ...newFiles]);
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
                console.log("Rooms response", rooms)
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


                    // guest: hotel.amenities?.map((a) => a.id) || [],
                    // rooms: hotel.roomsIncluded?.map((r) => r.id) || [],
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
        // setLoading(true);

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
            // featureIds: [...values.amenities, ...values.rooms],
        };

        console.log(payload, "payloadpayloadpayload");
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

    const feature = [
        { id: 'spacious', label: 'Spacious layout', name: "spacious" },
        { id: 'balcony', label: 'Private balcony', name: 'balcony', },
        { id: 'stay', label: 'Comfortable stay', name: 'stay' },
        { id: 'workspace', label: 'Dedicated workspace', name: 'workspace' },
        { id: 'water', label: 'Cold/Warm water', name: 'water' },
        { id: 'lunch', label: 'Lunch/Dinner', name: 'lunch' },
    ];

    const amenity = [
        { id: 'Free Wifi', name: 'Free Wifi', label: 'Free Wifi' },
        { id: 'Pool', name: 'Pool', label: 'Pool' },
        { id: 'Parking', name: 'Parking', label: 'Parking' },
        { id: 'Breakfast', name: 'Breakfast', label: 'Breakfast' },
        { id: 'Cold/Warm water', name: 'Cold/Warm water', label: 'Cold/Warm water' },
        { id: 'Lunch/Dinner', name: 'Lunch/Dinner', label: 'Lunch/Dinner' },
    ];

    const facilities = [
        { id: 'Hot & Cold Water', name: 'Hot & Cold Water', label: 'Hot & Cold Water' },
        { id: 'Clean Linen & Towels', name: 'Clean Linen & Towels', label: 'Clean Linen & Towels' },
        { id: 'Luxury Toilet', name: 'Luxury Toilet', label: 'Luxury Toilet' },
        { id: 'Hair Dryer', name: 'Hair Dryer', label: 'Hair Dryer' },
        { id: 'Shower Area', name: 'Shower Area', label: 'Shower Area' },
        { id: 'Proper Ventilation', name: 'Proper Ventilation', label: 'Proper Ventilation' },
        { id: 'Mirror & Vanity Area', name: 'Mirror & Vanity Area', label: 'Mirror & Vanity Area' },
        { id: 'Bedside Switches', name: 'Bedside Switches', label: 'Bedside Switches' },
    ];
    return (
        <>
            <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
                <img src={leftangle} alt="" />
                <button className='text-gray-600 flex'>Back</button>

            </div>
            <div className="max-full mx-auto mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Add New Room</h1>
                <div className="flex justify-between">
                    <p className="text-sm text-[#545454] font-medium align-middle">Fill in the details below to add a new room to your hotel inventory. </p>
                    <p className='flex justify-end font-medium text-[14px] text-dark'>Step 2/2</p>
                </div>
            </div>



            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <h2 className="text-[18px] font-semibold text-gray-900">Room Features</h2>
                </div>

                <div className="p-10 md:p-[15%] pt-5 pb-5">
                    <h3 className="text-[22px] font-semibold text-gray-900 mb-8">Select Room Features</h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                        {feature.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        name={item.name}
                                        type="checkbox"
                                        checked={features[item.id]}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-blue checked:border-blue transition-all cursor-pointer"
                                    />
                                    {/* Custom Checkmark Icon */}
                                    <svg
                                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[15px] font-medium transition-colors ${features[item.id] ? 'text-blue' : 'text-[#7C8DB5]'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <h2 className="text-[18px] font-semibold text-gray-900">Ameneties</h2>
                </div>

                <div className="p-10 md:p-[15%] pt-5 pb-5">
                    <h3 className="text-[22px] font-semibold text-gray-900 mb-8">Select Ameneties</h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-y-4 gap-x-12">
                        {amenity.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        name={item.name}
                                        type="checkbox"
                                        checked={features[item.id]}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-blue checked:border-blue transition-all cursor-pointer"
                                    />
                                    {/* Custom Checkmark Icon */}
                                    <svg
                                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[15px] font-medium transition-colors ${features[item.id] ? 'text-blue' : 'text-[#7C8DB5]'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <h2 className="text-[18px] font-semibold text-gray-900">Room Facilities</h2>
                </div>

                <div className="p-10 md:p-[10%] pt-5 pb-5">
                    <h3 className="text-[22px] font-semibold text-gray-900 mb-8">Select Room Facilities</h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-y-6 gap-x-12">
                        {facilities.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        name={item.name}
                                        type="checkbox"
                                        checked={features[item.id]}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-blue checked:border-blue transition-all cursor-pointer"
                                    />
                                    {/* Custom Checkmark Icon */}
                                    <svg
                                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[15px] font-medium transition-colors ${features[item.id] ? 'text-blue' : 'text-[#7C8DB5]'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
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
                    {loading ? "Adding..." : isEditMode ? "Add Room" : "Added"}
                </button>
            </div>
        </>
    );
}
export default RoomCloumns;