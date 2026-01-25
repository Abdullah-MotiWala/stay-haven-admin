import { Form, Select } from "antd";

const GeneralSettings = () => {
  return (
    <div>
  
      <h3 className="text-lg font-semibold ">General Settings</h3>
  

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto my-20 ">
        <div className="w-full">
          <label className="text-base text-lightSeconday font-medium">
            Default Currency
          </label>

          <Form.Item preserve={true} name="currency" label="">
            <Select
              className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
              options={[
                { label: "US Dollar ($)", value: "USD" },
                { label: "PKR (₨)", value: "PKR" },
              ]}
            />
          </Form.Item>
        </div>
        <div className="w-full">
          <label className="text-base text-lightSeconday font-medium">
            Timezone
          </label>

          <Form.Item preserve={true} name="timezone" label="">
            <Select
              className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
              options={[
                {
                  label: "(GMT+5:00) Asia/Karachi",
                  value: "Asia/Karachi",
                },
              ]}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
