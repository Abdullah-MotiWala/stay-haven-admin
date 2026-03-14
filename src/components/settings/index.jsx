import React, { useState, useEffect } from "react";
import { Form, Spin } from "antd";
import dayjs from "dayjs"; 
import { TABS } from "../../shared/constant";
import { useNavigate } from "react-router-dom";
import { openNotification } from "../../network/notification";

import { getSettingsApi, updateSettingsApi } from "../../services/setting/index"; 

import GeneralSettings from "./forms/generalSettings";
import Amenities from "./forms/amenities";
import BookingFeatures from "./forms/bookingFeatures";
import BookingPolicies from "./forms/bookingPolicies";
import PricingAndTaxes from "./forms/pricingAndTaxes";
import RoomRules from "./forms/roomRules";

const Setting = () => {
  const [activeType, setActiveType] = useState("General Settings");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currentSymbol, setCurrentSymbol] = useState("Rs.");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getSettingsApi();
        if (res?.data) {
          const data = res.data.data;

          const initialSymbol = data.currency?.title?.toUpperCase().includes("USD") ? "$" : "Rs.";
          
          form.setFieldsValue({
            ...data,
            currencyId: data.currency?.id, 
            timezoneId: data.timezone?.id, 
            currentSymbol: initialSymbol,
            selectedFeatures: data.selectedFeatures?.map(f => f.id) ,
            checkInTime: data.checkInTime ? dayjs(data.checkInTime, ["h:mm A", "HH:mm:ss", "HH:mm"]) : null,
            checkOutTime: data.checkOutTime ? dayjs(data.checkOutTime, ["h:mm A", "HH:mm:ss", "HH:mm"]) : null,
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setFetching(false);
      }
    };
    loadSettings();
  }, [form]);

  const renderSection = () => {
    switch (activeType) {
      case "General Settings": return <GeneralSettings onCurrenciesFetched={setCurrencyOptions} setGlobalSymbol={setCurrentSymbol}/>;
      case "Amenities": return <Amenities />;
      case "Booking Features": return <BookingFeatures />;
      case "Booking Policies": return <BookingPolicies />;
      case "Room Rules": return <RoomRules />;
      case "Pricing & Taxes": return <PricingAndTaxes symbol={currentSymbol}   />;
      default: return null;
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        currencyId: values.currencyId,
        timezoneId: values.timezoneId,
        featureIds: values.selectedFeatures,
        checkInTime: values.checkInTime?.format("h:mm A"),
        checkOutTime: values.checkOutTime?.format("h:mm A"),
      };

      const res = await updateSettingsApi(payload);
      if (res.data.success) {
        openNotification("success", "Saved Changes", "Settings updated successfully!");
      }
    } catch (err) {
      openNotification("error", "Error", err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-10"><Spin size="large" /></div>;

  return (
    <div>
      {/* Tab Navigation */}
      <div className="p-0 my-4 gap-1 flex flex-wrap rounded-lg ">
        {TABS.map((type, index) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            className={` px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-0 m-0 ${
              activeType === type ? "bg-blue text-white" : "bg-white text-extradark hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Global Form */}
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        preserve={true} 
      >
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {renderSection()}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-">
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
            className={`px-10 py-2 bg-blue text-white rounded-md ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Setting;