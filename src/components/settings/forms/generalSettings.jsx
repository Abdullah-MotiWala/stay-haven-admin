import React, { useState, useEffect } from "react";
import { Form, Select, Spin } from "antd";
import { getFeaturesByTypeApi, updateSettingsApi } from "../../../services/setting"; // API import karein
import { openNotification } from "../../../network/notification";

const GeneralSettings = ({ onCurrenciesFetched, setGlobalSymbol }) => {
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);
  const form = Form.useFormInstance();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [currRes, tzRes] = await Promise.all([
          getFeaturesByTypeApi("CURRENCY"),
          getFeaturesByTypeApi("TIMEZONE"),
        ]);

        const currData = currRes.data.data.map(item => ({ label: item.title, value: item.id }));
        setCurrencies(currData);
        onCurrenciesFetched(currData); 
        setTimezones(tzRes.data.data.map(item => ({ label: item.title, value: item.id })));
      } catch (err) {
        console.error("Failed to fetch features:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleCurrencyChange = async (val, option) => {
    const symbol = option?.label?.toUpperCase().includes("USD") ? "$" : "Rs.";
    
    form.setFieldsValue({ currentSymbol: symbol });

    if (setGlobalSymbol) {
    setGlobalSymbol(symbol);
    }

    try {
      const payload = { 
        currencyId: val,
      };
      
      await updateSettingsApi(payload);
      // openNotification("success", "Success", "Currency updated in database!");
    } catch (err) {
      openNotification("error", "Error", "Failed to sync with database");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">General Settings</h3>

      {loading ? (
        <div className="flex justify-center my-20"><Spin title="Loading Options..." /></div>
      ) : (
        <div className="bg-white rounded-3xl px-6 py-6 border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-6xl mx-auto my-6">
          <h3 className="text-lg font-semibold text-blue mb-4">Default Settings</h3>
          <hr className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">Default Currency</label>
              <Form.Item name="currencyId" rules={[{ required: true, message: 'Please select currency' }]}>
                <Select placeholder="Select Currency" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" options={currencies} showSearch optionFilterProp="label" onChange={handleCurrencyChange} />
              </Form.Item>
            </div>
            <div className="w-full">
              <label className="text-base text-lightSeconday font-medium">Timezone</label>
              <Form.Item name="timezoneId" rules={[{ required: true, message: 'Please select timezone' }]}>
                <Select placeholder="Select Timezone" className="w-full h-12 p-2 border-2 border-lightSeconday rounded-md font-medium" options={timezones} showSearch optionFilterProp="label" />
              </Form.Item>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;