import { Form, TimePicker, Input } from "antd";

const BookingPolicies = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Booking Policies</h3>

      <div className="max-w-6xl mx-auto my-20 space-y-12">
        <div
          className="
    bg-white 
    rounded-3xl 
    px-6 py-2 
    border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          <h3 className="text-lg font-semibold text-blue">
            Check-in / Check-out Times
          </h3>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item label="Check-in Time" name={["policy", "checkIn"]}>
              <TimePicker className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium"  />
            </Form.Item>

            <Form.Item label="Check-out Time" name={["policy", "checkOut"]}>
              <TimePicker className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" />
            </Form.Item>
          </div>
        </div>

        <div className="max-w-6xl mx-auto my-20 space-y-24">
          <div
            className="
    bg-white 
    rounded-3xl 
    px-6 py-2
    border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-lg font-semibold text-blue">
              Cancellation Policy
            </h3>
            <hr />
            <Form.Item
              label="Cancellation Policy"
              name={["policy", "cancellation"]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>
        </div>

        <div className="max-w-6xl mx-auto my-20 space-y-24">
          <div
            className="
    bg-white 
    rounded-3xl 
    px-6 py-3 
    border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-lg font-semibold text-blue">Refund Policy</h3>
            <hr />
            <Form.Item label="Refund Policy" name={["policy", "refund"]}>
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPolicies;
