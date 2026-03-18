import React, { useState, useEffect } from "react";
import { Form, Select, Spin, Input } from "antd";
import { getFeaturesByTypeApi, updateSettingsApi } from "../../../services/setting"; // API import karein
import { openNotification } from "../../../network/notification";
import X from "../../../assets/icons/x.svg";
import instagram from "../../../assets/icons/instagram.svg";
import facebook from "../../../assets/icons/facebook.svg";
import linkedin from "../../../assets/icons/linkedin.svg";

const SocialMedia = ({ onCurrenciesFetched, setGlobalSymbol }) => {
    const [currencies, setCurrencies] = useState([]);
    const [timezones, setTimezones] = useState([]);
    const [loading, setLoading] = useState(false);
    const form = Form.useFormInstance();

    //   useEffect(() => {
    //     const fetchOptions = async () => {
    //       try {
    //         const [currRes, tzRes] = await Promise.all([
    //           getFeaturesByTypeApi("CURRENCY"),
    //           getFeaturesByTypeApi("TIMEZONE"),
    //         ]);

    //         const currData = currRes.data.data.map(item => ({ label: item.title, value: item.id }));
    //         setCurrencies(currData);
    //         onCurrenciesFetched(currData); 
    //         setTimezones(tzRes.data.data.map(item => ({ label: item.title, value: item.id })));
    //       } catch (err) {
    //         console.error("Failed to fetch features:", err);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    //     fetchOptions();
    //   }, []);

    //   const handleCurrencyChange = async (val, option) => {
    //     const symbol = option?.label?.toUpperCase().includes("USD") ? "$" : "Rs.";

    //     form.setFieldsValue({ currentSymbol: symbol });

    //     if (setGlobalSymbol) {
    //     setGlobalSymbol(symbol);
    //     }

    //     try {
    //       const payload = { 
    //         currencyId: val,
    //       };

    //       await updateSettingsApi(payload);
    //       // openNotification("success", "Success", "Currency updated in database!");
    //     } catch (err) {
    //       openNotification("error", "Error", "Failed to sync with database");
    //     }
    //   };

    return (
        <div>
            <h3 className="text-lg font-semibold">Account info</h3>

            {loading ? (
                <div className="flex justify-center my-20"><Spin title="Loading Options..." /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto my-20">
                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">
                            Name
                        </label>
                        <Form.Item
                            name="currentPassword"
                            rules={[{ required: true, message: 'Please enter name' }]}
                        >
                            <Input
                                placeholder="Enter Name"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"

                            />
                        </Form.Item>
                    </div>

                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">
                            Email
                        </label>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please enter email' }]}
                        >
                            <Input
                                placeholder="Enter email"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">
                            Phone
                        </label>
                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input
                                placeholder="Enter phone number"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base text-lightSeconday font-medium">
                            <img src={linkedin} className="inline w-6 h-7 mx-1" /> 

                            LinkedIn
                        </label>
                        <Form.Item
                            name="linkedin"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input
                                placeholder="Enter linkedin profile url"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base flex text-lightSeconday font-medium">
                            <img src={instagram} alt="x" className="inline w-6 h-6 mx-1" />
                            Instagram

                        </label>
                        <Form.Item
                            name="instagram"
                            rules={[{ required: true, message: 'Please instagram Profile url' }]}
                        >
                            <Input
                                placeholder="Enter phone number"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <label className="text-base flex text-lightSeconday font-medium">
                        <img src={facebook} alt="x" className="inline w-6 h-6 mx-1" /> 
                            Facebook

                        </label>
                        <Form.Item
                            name="facebook"
                            rules={[{ required: true, message: 'Please enter facebook profile url' }]}
                        >
                            <Input
                                placeholder="Enter facebook profile url"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                    <div className="w-full ">
                        <label className="text-base flex text-lightSeconday font-medium">
                            <img src={X} alt="x" className="inline w-6 h-6 mx-1" /> 
                        </label>
                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Please enter X Profile url' }]}
                        >
                            <Input
                                placeholder="Enter X profile url"
                                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialMedia;