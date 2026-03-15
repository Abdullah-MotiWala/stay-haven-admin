import React from "react";
import { Form, Radio, InputNumber } from "antd";

const cardClass = `
  bg-white 
  rounded-3xl 
  px-8 py-6
  border border-gray-100
  shadow-[0_8px_30px_rgba(0,0,0,0.08)]
`;

const PricingAndTaxes = ({ symbol }) => {
  
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Pricing & Taxes</h3>
      <div className="max-w-6xl mx-auto my-20 space-y-12">
        
        {/* Tax Details Card */}
        <div className={cardClass}>
          <h4 className="text-blue font-semibold">Tax Details</h4>
          <hr className="mb-6" />

          <Form.Item label="Select Tax Type" name="taxType" className="mb-6">
            <div className="flex  items-center">
            <Radio.Group className="flex flex-wrap items-center gap-8">
              <Radio value="No Tax">No Tax</Radio>
              <Radio value="Fixed">Fixed</Radio>
              <Radio value="Percentage">Percentage</Radio>
            </Radio.Group>
            </div>
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const type = getFieldValue("taxType");
              
              return type && type !== "No Tax" ? (
                <Form.Item label={`${type} Tax Value`} name="taxValue">
                  <InputNumber 
                    prefix={type === "Fixed" ? symbol : ""}
                    suffix={type === "Percentage" ? "%" : ""}
                    className="w-full max-w-sm h-12 flex items-center rounded-md" 
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </div>

        {/* Service Charges Card */}
        <div className={cardClass}>
          <h4 className="text-blue font-semibold mb-2">Service Charges</h4>
          <hr className="mb-6" />
          
          <Form.Item label="Select Service Charges Type" name="serviceChargeType" className="mb-6">
            <Radio.Group className="flex flex-wrap gap-8">
              <Radio value="No charges">No charges</Radio>
              <Radio value="Fixed">Fixed</Radio>
              <Radio value="Percentage">Percentage</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const type = getFieldValue("serviceChargeType");

              return type && type !== "No charges" ? (
                <Form.Item label={`${type} Service Charge`} name="serviceChargeValue">
                  <InputNumber 
                    prefix={type === "Fixed" ? symbol : ""} 
                    suffix={type === "Percentage" ? "%" : ""}
                    className="w-full max-w-sm h-12 flex items-center rounded-md" 
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PricingAndTaxes;