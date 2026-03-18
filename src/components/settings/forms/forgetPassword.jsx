import React, { useState, useEffect } from "react";
import { Form, Select, Spin , Input} from "antd";
import { getFeaturesByTypeApi, updateSettingsApi } from "../../../services/setting"; // API import karein
import { openNotification } from "../../../network/notification";

const ForgetPassword = ({ onCurrenciesFetched, setGlobalSymbol }) => {
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(false);
  const form = Form.useFormInstance();

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const [currRes, tzRes] = await Promise.all([
//           getFeaturesByTypeApi("CURRENCY"),
//           getFeaturesByTypeApi("TIMEZONE"),
//         ]);

//         const currData = currRes.data.data.map(item => ({ label: item.title, value: item.id }));
//         setCurrencies(currData);
//         onCurrenciesFetched(currData); 
//         setTimezones(tzRes.data.data.map(item => ({ label: item.title, value: item.id })));
//       } catch (err) {
//         console.error("Failed to fetch features:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOptions();
//   }, []);

//   const handleCurrencyChange = async (val, option) => {
//     const symbol = option?.label?.toUpperCase().includes("USD") ? "$" : "Rs.";
    
//     form.setFieldsValue({ currentSymbol: symbol });

//     if (setGlobalSymbol) {
//     setGlobalSymbol(symbol);
//     }

//     try {
//       const payload = { 
//         currencyId: val,
//       };
      
//       await updateSettingsApi(payload);
//       // openNotification("success", "Success", "Currency updated in database!");
//     } catch (err) {
//       openNotification("error", "Error", "Failed to sync with database");
//     }
//   };

  return (
    <div>
      <h3 className="text-lg font-semibold">Forget Password</h3>

      {loading ? (
        <div className="flex justify-center my-20"><Spin title="Loading Options..." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto my-20">
          <div className="w-full">
            <label className="text-base text-lightSeconday font-medium">
              Current Password
            </label>
            <Form.Item 
              name="currentPassword" 
              rules={[{ required: true, message: 'Please enter current Password' }]}
            >
              <Input.Password
                placeholder="Enter current password"
                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                showSearch
                optionFilterProp="label"
                 
              />
            </Form.Item>
          </div>

          <div className="w-full">
            <label className="text-base text-lightSeconday font-medium">
              New Password
            </label>
            <Form.Item 
              name="newPassword"
              rules={[{ required: true, message: 'Please enter new Password' }]}
            >
              <Input.Password
                placeholder="Encter new password"
                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </div>
          <div className="w-full">
            <label className="text-base text-lightSeconday font-medium">
              Conform Password
            </label>
            <Form.Item 
              name="confirmPassword"
              rules={[{ required: true, message: 'Please enter conform Password' }]}
            >
              <Input.Password
                placeholder="Select Confirm password"
                className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;