import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Select, Spin } from "antd";
import { CameraOutlined, UserOutlined, MailOutlined, PhoneOutlined, SafetyOutlined } from "@ant-design/icons";
import { getProfile, updateProfile } from "../../services/profile";
import { uploadSingleMedia } from "../../services/uploads";
import { openNotification } from "../../network/notification";
import Breadcrumb from "../../components/Breadcrumb";

const { Option } = Select;

const AdminProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [userData, setUserData] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getProfile();
                const user = res?.data?.data || res?.data;
                if (user) {
                    setUserData(user);
                    form.setFieldsValue({
                        name: user.name || "",
                        email: user.email || "",
                        phoneNumber: user.phoneNumber || "",
                    });
                    if (user.profileImage) setProfileImage(user.profileImage);
                }
            } catch (err) {
                console.error("Profile load failed:", err);
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [form]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { openNotification("error", "Only image files allowed"); return; }
        if (file.size / 1024 / 1024 > 2) { openNotification("error", "Image must be under 2MB"); return; }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let uploadedImageUrl = null;
            if (imageFile) {
                const fd = new FormData();
                fd.append("image", imageFile);
                const uploadRes = await uploadSingleMedia(fd);
                uploadedImageUrl = uploadRes?.data?.data?.url;
            }
            await updateProfile({
                name: values.name,
                phoneNumber: values.phoneNumber,
                ...(uploadedImageUrl && { profileImage: uploadedImageUrl }),
            });
            openNotification("success", "Profile updated successfully");
        } catch (err) {
            openNotification("error", err?.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" />
        </div>
    );

    const initial = (userData?.name || "A")[0].toUpperCase();

    return (
        <>
            <Breadcrumb title="Profile" />

            <div className="max-w-4xl mx-auto mt-6 space-y-6">

                {/* Top Card - Avatar + Name */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue text-white text-3xl font-bold">
                                        {initial}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue border-2 border-white flex items-center justify-center shadow">
                                <CameraOutlined style={{ color: "#fff", fontSize: 13 }} />
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-gray-900">{userData?.name || "Admin"}</h2>
                            <p className="text-gray-500 text-sm mt-1">{userData?.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                userData?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}>
                                {userData?.userType || "admin"} · {userData?.status || "active"}
                            </span>
                        </div>

                        <div className="sm:ml-auto text-center sm:text-right">
                            <p className="text-xs text-gray-400">Member since</p>
                            <p className="text-sm font-semibold text-gray-700">
                                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                        Edit Profile
                    </h3>

                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Full Name</label>
                                <Form.Item name="name" rules={[{ required: true, message: "Name is required" }]} className="mb-0">
                                    <Input
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        className="h-12 rounded-xl"
                                        placeholder="Enter full name"
                                    />
                                </Form.Item>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Email Address</label>
                                <Form.Item name="email" className="mb-0">
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        className="h-12 rounded-xl bg-gray-50"
                                        placeholder="Email"
                                        disabled
                                    />
                                </Form.Item>
                                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Phone Number</label>
                                <Form.Item name="phoneNumber" className="mb-0">
                                    <Input
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        className="h-12 rounded-xl"
                                        placeholder="Enter phone number"
                                    />
                                </Form.Item>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Role</label>
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center px-3 gap-2">
                                    <SafetyOutlined className="text-gray-400" />
                                    <span className="text-gray-500 capitalize">{userData?.userType || "admin"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => form.resetFields()}
                                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 bg-blue text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </Form>
                </div>

            </div>
        </>
    );
};

export default AdminProfile;
