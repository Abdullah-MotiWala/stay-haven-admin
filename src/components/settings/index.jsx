import React, { useState } from "react";
import { Form, Button } from "antd";
import { TABS } from "../../shared/constant";

import GeneralSettings from "./forms/generalSettings";
import Amenities from "./forms/amenities";
import BookingFeatures from "./forms/bookingFeatures";
import BookingPolicies from "./forms/bookingPolicies";
import PricingAndTaxes from "./forms/pricingAndTaxes";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const [activeType, setActiveType] = useState("General Settings");
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const renderSection = () => {
    switch (activeType) {
      case "General Settings":
        return <GeneralSettings />;
      case "Amenities":
        return <Amenities />;
      case "Booking Features":
        return <BookingFeatures />;
      case "Booking Policies":
        return <BookingPolicies />;
      case "Pricing & Taxes":
        return <PricingAndTaxes />;
      default:
        return null;
    }
  };

  const onFinish = (values) => {
    console.log("ALL SETTINGS DATA ", values);
  };

  return (
    <div>
      <div className="p-0 my-4 gap-1 inline-flex   overflow-hidden rounded-lg">
        {TABS.map((type, index) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`
              px-4 py-2 text-sm font-medium whitespace-nowrap
              transition-colors duration-200 rounded-0 m-0 
              
              ${
                activeType === type
                  ? "bg-blue text-white"
                  : "bg-white text-extradark hover:bg-gray-50"
              }
              ${index === 0 ? "" : ""}
              ${index === TABS.length - 1 ? "" : ""}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {renderSection()}
        </div>

        {/* <div className="flex justify-end gap-3 mt-8">
          <Button>Back</Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div> */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
          >
            Back
          </button>

          <button
            htmlType="submit"
            // onClick={onNext}
            // disabled={loading}
            className="px-10 py-2 bg-blue text-white rounded-md"
          >
            {/* {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Room"} */}
            {/* Next */}
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Setting;
