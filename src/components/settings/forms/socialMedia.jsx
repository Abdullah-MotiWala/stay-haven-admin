import React from "react";
import { Form, Input } from "antd";
// import X from "../../../assets/icons/x.svg";
// import instagram from "../../../assets/icons/instagram.svg";
// import facebook from "../../../assets/icons/facebook.svg";
// import linkedin from "../../../assets/icons/linkedin.svg";
import SocialLinks from "./socialLinks";

const SocialMedia = ({ onCurrenciesFetched, setGlobalSymbol }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold">Account info</h3>

            <div className="bg-white rounded-3xl px-6 py-6 max-w-6xl mx-auto my-6">
                <h3 className="text-lg font-semibold text-blue mb-4">Account Details</h3>
                <hr className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">Name</label>
                        <Form.Item name="currentPassword" rules={[{ required: true, message: "Please enter name" }]}>
                            <Input placeholder="Enter Name" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>

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

                    {/* LinkedIn, Instagram, Facebook, Twitter — commented out */}
                    {/* <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">
                            <img src={linkedin} className="inline w-6 h-7 mx-1" /> LinkedIn
                        </label>
                        <Form.Item name="linkedin">
                            <Input placeholder="Enter linkedin profile url" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base flex text-lightSeconday font-medium">
                            <img src={instagram} alt="instagram" className="inline w-6 h-6 mx-1" /> Instagram
                        </label>
                        <Form.Item name="instagram">
                            <Input placeholder="Enter Instagram profile url" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base flex text-lightSeconday font-medium">
                            <img src={facebook} alt="facebook" className="inline w-6 h-6 mx-1" /> Facebook
                        </label>
                        <Form.Item name="facebook">
                            <Input placeholder="Enter facebook profile url" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base flex text-lightSeconday font-medium">
                            <img src={X} alt="x" className="inline w-6 h-6 mx-1" /> X (Twitter)
                        </label>
                        <Form.Item name="twitter">
                            <Input placeholder="Enter X profile url" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" />
                        </Form.Item>
                    </div> */}
                </div>
            </div>

            {/* Social Links CRUD */}
            <div className="bg-white rounded-3xl px-6 py-6 max-w-6xl mx-auto my-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <SocialLinks />
            </div>
        </div>
    );
};

export default SocialMedia;
