import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelNamesList } from "../../../services/hotel";
import { Trash2 } from "lucide-react";
import arrowImg from "../../../assets/icons/arrow.png";
import { getAllFeature } from "../../../services/features";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select, Checkbox } from "antd";
import cloudimg from "../../../assets/icons/cloud-upload.png";
import { createRoom, getById, updateRoom } from "../../../services/rooms";
import { uploadMultipleMedia, uploadSingleMedia } from "../../../services/uploads";

const STEPS_FIELDS = [
    ["roomNumber", "hotel", "bedType", "roomSize", "guests", "childrens", "pricePerNight", "status", "description"],
    ["features", "amenities", "facility", "policy"],
];

const AddHostel = () => {
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
    const [roomTypesList, setRoomTypesList] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const selectedFeatures = Form.useWatch("features", form) || [];
    const selectedFacility = Form.useWatch("facility", form) || [];
    const selectedAmenities = Form.useWatch("amenities", form) || [];
    const selectedPolicy = Form.useWatch("policy", form) || [];

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await getHotelNamesList();
                setHotelsList(res?.data?.data || res.data || []);
            } catch {
                openNotification("error", "Failed to load hotels");
            }
        };
        fetchHotels();
    }, []);

    const handleHotelChange = (val) => {
        form.setFieldValue("roomTypeId", undefined);
        if (!val) { setRoomTypesList([]); return; }
        const hotel = hotelsList.find((h) => h.id === val);
        const types = (hotel?.features || []).filter((f) => f.type === "ROOM_TYPE");
        setRoomTypesList(types);
    };

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const [amenityRes, featuresRes, facilityRes, policyRes] = await Promise.all([
                    getAllFeature("AMENITY"),
                    getAllFeature("ROOM_FEATURE"),
                    getAllFeature("ROOM_FACILITY"),
                    getAllFeature("POLICY"),
                ]);
                setAmenitiesList(amenityRes.data.data || []);
                setFeaturesList(featuresRes.data.data || []);
                setFacilityList(facilityRes.data.data || []);
                setPolicyList(policyRes.data.data || []);
            } catch {
                openNotification("error", "Failed to load features");
            }
        };
        fetchFeatures();
    }, []);

    useEffect(() => {
        if (!isEditMode) return;
        const fetchHostel = async () => {
            setFetching(true);
            try {
                const res = await getById(id);
                const room = res.data?.data || res.data;
                const features = room.features?.filter((f) => f.type === "ROOM_FEATURE").map((f) => f.id) || [];
                const amenities = room.features?.filter((f) => f.type === "AMENITY").map((f) => f.id) || [];
                const facility = room.features?.filter((f) => f.type === "ROOM_FACILITY").map((f) => f.id) || [];
                const policy = room.features?.filter((f) => f.type === "POLICY").map((f) => f.id) || [];

                form.setFieldsValue({
                    hostelName: room.roomName || "",
                    roomNumber: room.roomNumber || "",
                    bedType: room.bedType || "",
                    roomSize: room.roomSize || "",
                    guests: String(room.maxAdults || 1),
                    childrens: String(room.maxChildren || 0),
                    pricePerNight: room.pricePerNight || 0,
                    status: room.status || "available",
                    description: room.description || "",
                    hotel: room.hotel?.id,
                    features, amenities, facility, policy,
                    maxinfants: String(room.maxInfants || 0),
                });
                if (room.mainImage) setMainImagePreview(room.mainImage);
                if (room.galleryImages?.length) setGalleryPreviews(room.galleryImages);

                // Set room types from hotel's features
                if (room.hotel?.id) {
                    const hotelsRes = await getHotelNamesList();
                    const hotels = hotelsRes?.data?.data || hotelsRes?.data || [];
                    setHotelsList(hotels);
                    const hotel = hotels.find((h) => h.id === room.hotel.id);
                    const types = (hotel?.features || []).filter((f) => f.type === "ROOM_TYPE");
                    setRoomTypesList(types);
                    // Set roomTypeId AFTER types are loaded
                    form.setFieldValue("roomTypeId", room.roomTypeId || undefined);
                }
            } catch {
                openNotification("error", "Failed to load hostel");
            } finally {
                setFetching(false);
            }
        };
        fetchHostel();
    }, [id, isEditMode, form]);

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1 * 1024 * 1024) { openNotification("error", "Image must be under 1 MB"); return; }
        setMainImage(file);
        setMainImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (gallery.length + files.length > 5) { openNotification("error", "Max 5 images allowed"); return; }
        setGallery((prev) => [...prev, ...files]);
        setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    };

    const onNext = async () => {
        try {
            await form.validateFields(STEPS_FIELDS[currentStep]);
            setCurrentStep((prev) => prev + 1);
        } catch {}
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let mainImageUrl = null;
            let galleryUrls = [];

            if (mainImage) {
                const fd = new FormData();
                fd.append("image", mainImage);
                const r = await uploadSingleMedia(fd);
                mainImageUrl = r?.data?.data?.url;
            }
            if (gallery.length > 0) {
                const fd = new FormData();
                gallery.forEach((f) => fd.append("images", f));
                const r = await uploadMultipleMedia(fd);
                galleryUrls = r?.data?.data?.map((i) => i.url) || [];
            }

            const payload = {
                roomName: values.hostelName,
                roomNumber: values.roomNumber,
                hotelId: values.hotel,
                roomTypeId: values.roomTypeId,
                bedType: values.bedType,
                roomSize: values.roomSize,
                maxAdults: Number(values.guests),
                maxChildren: Number(values.childrens),
                maxInfants: Number(values.maxinfants || 0),
                description: values.description,
                pricePerNight: Number(values.pricePerNight),
                status: values.status,
                isHostel: true,  // key difference
                featureIds: [...new Set([
                    ...(values.features || []),
                    ...(values.amenities || []),
                    ...(values.facility || []),
                    ...(values.policy || []),
                ])],
                ...(mainImageUrl && { mainImage: mainImageUrl }),
                ...(galleryUrls.length > 0 && { galleryImages: galleryUrls }),
            };

            const res = isEditMode ? await updateRoom(id, payload) : await createRoom(payload);
            if (![200, 201].includes(res?.status)) throw new Error("API failed");
            openNotification("success", isEditMode ? "Hostel updated" : "Hostel created");
            setIsModalOpen(true);
        } catch (err) {
            openNotification("error", err?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center text-blue font-semibold">Loading hostel details...</div>;

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                initialValues={{ bedType: "single bed", roomSize: "e.g. 25 m²", guests: "1", childrens: "0", status: "available", features: [], amenities: [], facility: [], policy: [] }}
                onFinish={handleSubmit}
                className="min-h-screen w-full md:p-8 font-sans"
            >
                {/* Step 1 */}
                <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                    <div className="flex items-center gap-4 cursor-pointer mb-4" onClick={() => navigate(-1)}>
                        <img src={arrowImg} alt="back" />
                        <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
                    </div>
                    <hr className="-mt-4 mb-6" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Hostel" : "Add New Hostel"}</h1>
                        <p className="text-lg text-darkGray font-medium">Fill in the details below to {isEditMode ? "edit" : "add"} a hostel.</p>
                    </div>

                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mb-6">
                        <div className="px-6 py-4 mb-2">
                            <h2 className="text-lg font-semibold text-black">Hostel Details</h2>
                            <hr />
                        </div>
                        <div className="p-6 px-16 md:px-36 pb-14">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Hostel Name</label>
                                    <Form.Item name="hostelName" rules={[{ required: true, message: "Hostel name is required" }]}>
                                        <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter hostel name" />
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Bed / Room Number</label>
                                    <Form.Item name="roomNumber" rules={[{ required: true, message: "Required" }]}>
                                        <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="e.g. Bed 1, Room A" />
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Select Hotel</label>
                                    <Form.Item name="hotel">
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Hotel" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} onChange={handleHotelChange}>
                                            {hotelsList.map((h) => <Option key={h.id} value={h.id}>{h.name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Hostel Type</label>
                                    <Form.Item name="roomTypeId" rules={[{ required: true, message: "Hostel Type is required" }]}>
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Hostel Type" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                            {roomTypesList.map((t) => <Option key={t.id} value={t.id}>{t.title}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Bed Type</label>
                                    <Form.Item name="bedType" rules={[{ required: true, message: "Required" }]}>
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Bed Type" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                            {[["single bed", "Single Bed"], ["queen bed", "Queen Bed"], ["king bed", "King Bed"], ["bunk bed", "Bunk Bed"], ["dormitory", "Dormitory"]].map(([v, l]) => <Option key={v} value={v}>{l}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Room Size</label>
                                    <Form.Item name="roomSize" rules={[{ required: true, message: "Required" }]}>
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Room Size" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                            {["e.g. 25 m²", "e.g. 30 m²", "e.g. 35 m²", "e.g. 50 m²"].map((v) => <Option key={v} value={v}>{v}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Max Guests</label>
                                    <Form.Item name="guests" rules={[{ required: true, message: "Required" }]}>
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Max Guests" showSearch  optionFilterProp="children">
                                            {["1","2","3","4","5","6","8","10","12","20"].map((v) => <Option key={v} value={v}>{v} Guests</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Children</label>
                                    <Form.Item name="childrens" rules={[{ required: true, message: "Required" }]}>
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Children" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                            {["0","1","2","3","4","5"].map((v) => <Option key={v} value={v}>{v}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                               
                            </div>

                            <div className="mb-6">
                                <label className="text-base text-lightSeconday font-medium">Description</label>
                                <Form.Item name="description" rules={[{ required: true, message: "Required" }]}>
                                    <Input.TextArea rows={3} className="p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter hostel description" />
                                </Form.Item>
                            </div>

                            <h4 className="font-semibold mb-4">Pricing & Status</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Price Per Night</label>
                                    <Form.Item name="pricePerNight" rules={[{ required: true, message: "Required" }]}>
                                        <Input className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Enter price" />
                                    </Form.Item>
                                </div>
                                <div>
                                    <label className="text-base text-lightSeconday font-medium">Status</label>
                                    <Form.Item name="status" rules={[{ required: true, message: "Required" }]}>
                                        <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" placeholder="Select Status" showSearch filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                            {[["available","Available"],["active","Active"],["occupied","Occupied"],["maintenance","Maintenance"],["inactive","Inactive"]].map(([v,l]) => <Option key={v} value={v}>{l}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mb-6">
                        <div className="px-6 py-3 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Hostel Images</h2>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Main Image</label>
                                    {!mainImagePreview ? (
                                        <div className="relative w-full h-[100px] border-2 border-dashed border-blue rounded-[15px] bg-[#EFF6FF] flex flex-col items-center justify-center cursor-pointer">
                                            <img src={cloudimg} className="w-6 h-6 mb-1" />
                                            <p className="text-sm text-gray-600">Drop or <span className="text-blue underline">Browse</span></p>
                                            <p className="text-xs text-gray-400">JPG/PNG under 1 MB</p>
                                            <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img src={mainImagePreview} className="w-full h-[180px] object-cover rounded-[15px] border" />
                                            <button type="button" onClick={() => { setMainImage(null); setMainImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Gallery (max 5)</label>
                                    {galleryPreviews.length < 5 && (
                                        <div className="relative w-full h-[100px] border-2 border-dashed border-blue rounded-[15px] bg-[#EFF6FF] flex flex-col items-center justify-center cursor-pointer">
                                            <img src={cloudimg} className="w-6 h-6 mb-1" />
                                            <p className="text-sm text-gray-600">Upload multiple</p>
                                            <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    )}
                                    {galleryPreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {galleryPreviews.map((p, i) => (
                                                <div key={i} className="relative">
                                                    <img src={p} className="w-full h-[80px] object-cover rounded-[10px] border" />
                                                    <button type="button" onClick={() => { setGallery((g) => g.filter((_, j) => j !== i)); setGalleryPreviews((g) => g.filter((_, j) => j !== i)); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
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
                        <button type="button" onClick={() => navigate(-1)} className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium">Cancel</button>
                        <button type="button" onClick={onNext} className="px-10 py-2 bg-blue text-white rounded-md">Next</button>
                    </div>
                </div>

                {/* Step 2 - Features */}
                <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                    <div className="flex items-center gap-4 cursor-pointer mb-4" onClick={() => setCurrentStep(0)}>
                        <img src={arrowImg} alt="back" />
                        <p className="text-darkGray underline font-medium text-lg mt-3">Back</p>
                    </div>
                    <hr className="-mt-4 mb-6" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Hostel" : "Add New Hostel"}</h1>
                        <p className="text-lg text-darkGray font-medium">Select features & amenities</p>
                    </div>

                    {[
                        { title: "Room Features", name: "features", list: featuresList, selected: selectedFeatures },
                        { title: "Amenities", name: "amenities", list: amenitiesList, selected: selectedAmenities },
                        { title: "Policy", name: "policy", list: policyList, selected: selectedPolicy },
                        { title: "Room Facilities", name: "facility", list: facilityList, selected: selectedFacility },
                    ].map(({ title, name, list, selected }) => (
                        <div key={name} className="bg-white rounded-2xl shadow-sm border border-lightSeconday mb-4">
                            <div className="px-6 py-4">
                                <h2 className="text-lg font-semibold text-black">{title}</h2>
                                <hr />
                            </div>
                            <div className="p-6 px-16 md:px-36 pb-10">
                                <Form.Item preserve name={name}>
                                    <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                        {list.map((a) => (
                                            <Checkbox key={a.id} value={a.id}>
                                                <span className={`text-sm font-medium ${selected.includes(a.id) ? "text-blue" : "text-lightText"}`}>{a.title}</span>
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setCurrentStep(0)} className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium">Back</button>
                        <button type="button" onClick={() => form.submit()} disabled={loading} className="px-10 py-2 bg-blue text-white rounded-md">
                            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Hostel"}
                        </button>
                    </div>
                </div>
            </Form>

            {isModalOpen && (
                <SuccessModal
                    open={true}
                    onClose={() => navigate("/admin/hostels")}
                    title={isEditMode ? "Hostel Updated!" : "Hostel Added!"}
                    description={isEditMode ? "Hostel updated successfully." : "Hostel created successfully."}
                    showButton
                    buttonText="View Hostels"
                    onButtonClick={() => navigate("/admin/hostels")}
                />
            )}
        </>
    );
};

export default AddHostel;
