import React from "react";
import { Form, TimePicker, Input } from "antd";
import dayjs from "dayjs"; 

const BookingPolicies = () => {
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold ">Booking Policies</h3>

      <div className="max-w-6xl mx-auto my-20 space-y-12">
        {/* Check-in / Check-out Section */}
        <div className=" bg-white rounded-3xl px-6 py-2 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue">Check-in / Check-out Times</h3>
          <hr/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Form.Item 
              label={<span className="font-semibold text-extradark">Check-in Time</span>} 
              name="checkInTime"
              getValueProps={(value) => ({
                value: value ? dayjs(value, "h:mm A") : undefined,
              })}
            >
              <TimePicker 
                format="h:mm A" 
                use12Hours 
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" 
              />
            </Form.Item>

            <Form.Item 
              label={<span className="font-semibold text-extradark">Check-out Time</span>} 
              name="checkOutTime"
              getValueProps={(value) => ({
                value: value ? dayjs(value, "h:mm A") : undefined,
              })}
            >
              <TimePicker 
                format="h:mm A" 
                use12Hours 
                className="w-full h-12 p-2 border border-lightSeconday rounded-md font-medium" 
              />
            </Form.Item>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="max-w-6xl mx-auto my-20 space-y-24">
        <div className="bg-white rounded-3xl px-6 py-2 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue">Cancellation Policy</h3>
          <Form.Item name="cancellationPolicy">
            <Input.TextArea 
              rows={4} 
              placeholder="Explain your cancellation rules..." 
              className="rounded-xl border-lightSeconday p-4"
            />
          </Form.Item>
        </div>
        </div>

        {/* Refund Policy */}
        <div className="max-w-6xl mx-auto my-20 space-y-24">
        <div className="bg-white rounded-3xl px-6 py-2 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue">Refund Policy</h3>
          <hr/>
          <Form.Item name="refundPolicy">
            <Input.TextArea 
              rows={4} 
              placeholder="Explain how refunds are processed..." 
              className="rounded-xl border-lightSeconday p-4"
            />
          </Form.Item>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPolicies;