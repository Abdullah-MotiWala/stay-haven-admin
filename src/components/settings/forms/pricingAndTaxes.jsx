// sections/PricingAndTaxes.jsx
import { Form, Radio, Input } from "antd";

const PricingAndTaxes = () => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Pricing & Taxes</h3>

      {/* Tax */}
      <Form.Item label="Tax Type" name={["tax", "type"]}>
        <Radio.Group>
          <Radio value="none">No Tax</Radio>
          <Radio value="fixed">Fixed</Radio>
          <Radio value="percentage">Percentage</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.tax?.type !== curr?.tax?.type
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(["tax", "type"]) === "fixed" && (
            <Form.Item label="Fixed Tax" name={["tax", "amount"]}>
              <Input prefix="$" />
            </Form.Item>
          )
        }
      </Form.Item>

      {/* Service Charges */}
      <Form.Item label="Service Charges" name={["service", "type"]}>
        <Radio.Group>
          <Radio value="none">No Charges</Radio>
          <Radio value="fixed">Fixed</Radio>
          <Radio value="percentage">Percentage</Radio>
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

export default PricingAndTaxes;
