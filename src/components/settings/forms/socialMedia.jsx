import React from "react";
import { Form, Input } from "antd";
import SocialLinks from "./socialLinks";

const SocialMedia = ({ onCurrenciesFetched, setGlobalSymbol }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold">Account info</h3>

            <div className="bg-white rounded-3xl px-6 py-6 max-w-6xl mx-auto my-6">
                <h3 className="text-lg font-semibold text-blue mb-4">Account Details</h3>
                <hr className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">Email</label>
                        <Form.Item name="email" rules={[{ required: true, message: "Please enter email" }]}>
                            <Input placeholder="Enter email" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>

                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">Phone</label>
                        <Form.Item name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
                            <Input placeholder="Enter phone number" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">Address</label>
                        <Form.Item name="address" rules={[{ required: true, message: "Please enter address number" }]}>
                            <Input placeholder="Enter address number" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl px-6 py-6 max-w-6xl mx-auto my-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <SocialLinks />
            </div>
        </div>
    );
};

export default SocialMedia;
