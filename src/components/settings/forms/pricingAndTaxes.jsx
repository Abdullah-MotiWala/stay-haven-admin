// sections/PricingAndTaxes.jsx
import { Form, Radio, Input } from "antd";

const cardClass = `
  bg-white 
  rounded-3xl 
  px-6 py-2
  border border-gray-100
  shadow-[0_8px_30px_rgba(0,0,0,0.08)]
`;

const PricingAndTaxes = () => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Pricing & Taxes</h3>

      <div className="max-w-6xl mx-auto my-20 space-y-12">
        <div className={cardClass}>
          <h4 className="text-blue font-semibold ">Tax Details</h4>
          <hr className="mb-6" />

          <Form.Item label="" name={["tax", "type"]} className="mb-6">
            <div className="flex  items-center">
              <p className="">Select Tax Type</p>
            <Radio.Group className="flex items-center gap-8">
              <Radio value="none">No Tax</Radio>
              <Radio value="fixed">Fixed</Radio>
              <Radio value="percentage">Percentage</Radio>
            </Radio.Group>
            </div>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev?.tax?.type !== curr?.tax?.type}
          >
            {({ getFieldValue }) =>
              getFieldValue(["tax", "type"]) === "fixed" && (
                <Form.Item label="Fixed Tax" name={["tax", "amount"]}>
                  <Input prefix="$" className="max-w-sm" />
                </Form.Item>
              )
            }
          </Form.Item>
        </div>

        <div className={cardClass}>
          <h4 className="text-blue font-semibold mb-2">Service charges</h4>
          <hr className="mb-6" />

          <Form.Item
            label="Select Service charges Type"
            name={["service", "type"]}
            className="mb-6"
          >
            <Radio.Group className="flex gap-8">
              <Radio value="none">No charges</Radio>
              <Radio value="fixed">Fixed</Radio>
              <Radio value="percentage">Percentage</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.service?.type !== curr?.service?.type
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(["service", "type"]) === "fixed" && (
                <Form.Item label="Fixed Charges" name={["service", "amount"]}>
                  <Input prefix="$" className="max-w-sm" />
                </Form.Item>
              )
            }
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PricingAndTaxes;
