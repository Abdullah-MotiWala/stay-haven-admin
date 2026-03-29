import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createUser,
    getUserById,
    updateUser,
} from "../../../services/user";
import arrowImg from "../../../assets/icons/arrow.png";
import { openNotification } from "../../../network/notification";
import SuccessModal from "../../../components/shared/successModal";
import { Form, Input, Select } from "antd";

const HostForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { Option } = Select;

    useEffect(() => {
        if (!isEditMode) return;

        const fetchHost = async () => {
            setFetching(true);
            try {
                const res = await getUserById(id);
                const host = res.data?.data || res.data;
                form.setFieldsValue({
                    name: host.name,
                    email: host.email,
                    phoneNumber: host.phoneNumber,
                    status: host.status || "active",
                });
            } catch (err) {
                console.error("Failed to load host", err);
                openNotification("error", "Failed to load host details");
            } finally {
                setFetching(false);
            }
        };

        fetchHost();
    }, [id, isEditMode, form]);

    const handleSubmit = async (values) => {
        setLoading(true);

        const payload = {
            ...values,
            userType: "host",
        };

        try {
            if (isEditMode) {
                await updateUser(id, payload);
                openNotification("success", "Host updated successfully");
            } else {
                await createUser(payload);
                openNotification("success", "Host created successfully");
            }
            setIsModalOpen(true);
        } catch (err) {
            console.error("Internal Server Error", err);
            openNotification("error", err.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-20 text-center text-blue font-semibold">
                Loading host details...
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
                initialValues={{ status: "active" }}
            >
                <div>
                    <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <div>
                            <img src={arrowImg} alt="arrow" />
                        </div>
                        <p className="text-darkGray underline font-medium text-lg mt-3">
                            Back
                        </p>
                    </div>
                    <hr className="-mt-4" />
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? "Edit Host" : "Add Host"}
                    </h1>
                    <p className="text-lg text-darkGray font-medium">
                        {isEditMode
                            ? "Edit host profile details"
                            : "Create a new host account"}
                    </p>
                </div>

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 ">
                    <div className="px-6 py-4 mb-6 ">
                        <h2 className="text-lg font-semibold text-black  ">
                            Host Profile
                        </h2>
                        <hr />
                    </div>
                    <div className="p-6 px-36 pb-14">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="w-full">
                                <label className="text-base text-lightSeconday font-medium">
                                    Full Name
                                </label>
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: "Name is required" }]}
                                >
                                    <Input
                                        className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                                        placeholder="Enter full name"
                                    />
                                </Form.Item>
                            </div>

                            <div className="w-full">
                                <label className="text-base text-lightSeconday font-medium">
                                    Email Address
                                </label>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: "Email is required" },
                                        { type: "email", message: "Invalid email" },
                                    ]}
                                >
                                    <Input
                                        className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                                        placeholder="Enter email address"
                                    />
                                </Form.Item>
                            </div>

                            {!isEditMode && (
                                <div className="w-full">
                                    <label className="text-base text-lightSeconday font-medium">
                                        Password
                                    </label>
                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: "Password is required" }]}
                                    >
                                        <Input.Password
                                            className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                                            placeholder="Enter password"
                                        />
                                    </Form.Item>
                                </div>
                            )}

                            <div className="w-full">
                                <label className="text-base text-lightSeconday font-medium">
                                    Phone Number
                                </label>
                                <Form.Item
                                    name="phoneNumber"
                                >
                                    <Input
                                        className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"
                                        placeholder="Enter phone number"
                                    />
                                </Form.Item>
                            </div>

                            <div className="w-full">
                                <label className="text-base text-lightSeconday font-medium">
                                    Status
                                </label>
                                <Form.Item name="status">
                                    <Select className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium shadow-none">
                                        <Option value="active">Active</Option>
                                        <Option value="inactive">Inactive</Option>
                                    </Select>
                                </Form.Item>
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
                        Cancel
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
                <SuccessModal
                    open={true}
                    onClose={() => navigate("/admin/hosts")}
                    title={
                        !isEditMode
                            ? "Host Added Successfully!"
                            : "Host Updated Successfully!"
                    }
                    description={
                        !isEditMode
                            ? "The host has been created successfully."
                            : "The host profile has been updated successfully."
                    }
                    showButton
                    buttonText="View Hosts"
                    onButtonClick={() => navigate("/admin/hosts")}
                />
            )}
        </>
    );
};

export default HostForm;
