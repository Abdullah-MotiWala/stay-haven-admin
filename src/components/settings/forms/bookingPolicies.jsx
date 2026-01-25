import { Form, TimePicker, Input } from "antd";

const BookingPolicies = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Booking Policies</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Check-in Time" name={["policy", "checkIn"]}>
          <TimePicker className="w-full" />
        </Form.Item>

        <Form.Item label="Check-out Time" name={["policy", "checkOut"]}>
          <TimePicker className="w-full" />
        </Form.Item>
      </div>

      <Form.Item
        label="Cancellation Policy"
        name={["policy", "cancellation"]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Refund Policy" name={["policy", "refund"]}>
        <Input.TextArea rows={4} />
      </Form.Item>
    </div>
  );
};

export default BookingPolicies;
