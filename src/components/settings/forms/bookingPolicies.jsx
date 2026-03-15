import React, { useState, useEffect } from "react";
import { Form, TimePicker, Input, Divider, Spin  , Checkbox} from "antd";
import dayjs from "dayjs";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";
import { getFeaturesByTypeApi, createFeatureApi, deleteFeatureApi } from "../../../services/setting";
import { openNotification } from "../../../network/notification";

const BookingPolicies = () => {
  const [rulesPolicies, setRulesPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rulePolicyInput, setRulePolicyInput] = useState("");

  const fetchRulesPolicies = async () => {
    try {
      const res = await getFeaturesByTypeApi("POLICY");
      setRulesPolicies(res?.data?.data || res.data || []);
      console.log(res?.data?.data || res.data, "rulesPolicies===");
    } catch (err) {
      console.error("Failed to load rules & policies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRulesPolicies();
  }, []);

  const handleAdd = async (title) => {
    if (!title.trim()) return;
    try {
      await createFeatureApi({ title, type: "POLICY" });
      setRulePolicyInput("");
      await fetchRulesPolicies();
      openNotification("success", "Rule/Policy added", `${title} added successfully`);
    } catch (err) {
      openNotification("error", "Error", "Failed to add rule/policy");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeatureApi(id);
      await fetchRulesPolicies();
      openNotification("success", "Rule/Policy removed", "Item removed successfully");
    } catch (err) {
      openNotification("error", "Error", "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold ">Booking Policies</h3>

      <div className="max-w-6xl mx-auto my-20 space-y-12">
        {/* Check-in / Check-out Section */}
        <div className=" bg-white rounded-3xl px-6 py-2 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-semibold text-blue">Check-in / Check-out Times</h3>
          <hr />
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
            <hr />
            <Form.Item name="refundPolicy">
              <Input.TextArea
                rows={4}
                placeholder="Explain how refunds are processed..."
                className="rounded-xl border-lightSeconday p-4"
              />
            </Form.Item>
          </div>
        </div>

        <Divider />

        {/* Rules & Policies Section */}
        <section>
          <h3 className="text-lg font-semibold mb-8">Add Room Rules & Policies</h3>
          {loading ? (
            <Spin className="flex justify-center my-10" />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
                <Form.Item name="selectedFeatures">
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10 ">
                      {rulesPolicies.map((item) => (
                        <div key={item.id} className="flex justify-between max-w-96">
                          <p value={item.id} className="text-base text-lightSeconday px-2">
                            {item.title}
                          </p>
                          <img
                            src={deleteIcon}
                            onClick={() => handleDelete(item.id)}
                            className="bg-lightRed rounded-lg px-2 w-10 h-10   cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>

              <div className="mt-14">
                <h3 className="text-lg text-extradark font-semibold">Add Custom Rules & Policies</h3>
                <p className="text-lightText text-base font-normal">Add any additional rules or policies not listed above</p>
                <Input
                  className="w-full sm:w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                  placeholder="Enter Custom rule/policy"
                  value={rulePolicyInput}
                  onChange={(e) => setRulePolicyInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleAdd(rulePolicyInput)}
                  className=" mt-2 px-8 h-12 ml-6 text-lg py-2 bg-blue text-white rounded-md"
                >
                  Add in the above list
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default BookingPolicies;