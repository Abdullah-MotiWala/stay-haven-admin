import React, { useState } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
   const isEditMode = Boolean();
  const [activeTab, setActiveTab] = useState('General Settings');

  const tabs = [
    'General Settings', 'Amenities', 'Booking Features', 
    'Booking Policies', 'Pricing & Taxes'
  ];

  return (
<>
    <div className="p-8  min-h-screen font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-6">
        <span className="opacity-60">Dashboard</span>
        <span className="opacity-60">/</span>
        <span>Settings</span>
      </div>

      {/* Tabs Navigation */}
      <div className="p-0 ml-3 gap-[2px] inline-flex   overflow-hidden rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-2 text-sm font-medium whitespace-nowrap
                        transition-colors duration-200 rounded-0 m-0  ${
              activeTab === tab 
              ? "bg-blue text-white" 
              : "bg-white text-extradark hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Card - Extra Rounded [32px] */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F1F5F9] overflow-hidden">
        {/* Card Header - Subtle Gray Background */}
        <div className="px-10 py-6 border-b border-[#F8FAFC] bg-[#FBFCFE]">
          <h3 className="text-[18px] font-bold text-[#1F2937]">{activeTab}</h3>
        </div>

        {/* Card Body - Wide Spacing */}
        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            
            {/* Toggle Item 1 */}
            <div className="flex items-center justify-between p-6 rounded-[24px] border border-[#F1F5F9] bg-white hover:border-blue-100 transition-colors">
              <div>
                <h4 className="font-bold text-[#1F2937] text-[15px]">Show hotel on website</h4>
                <p className="text-[12px] text-[#7C8DB5] mt-1 font-medium">Show all the hotels list on website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6.5 bg-[#E2E8F0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
              </label>
            </div>

            {/* Toggle Item 2 */}
            <div className="flex items-center justify-between p-6 rounded-[24px] border border-[#F1F5F9] bg-white hover:border-blue-100 transition-colors">
              <div>
                <h4 className="font-bold text-[#1F2937] text-[15px]">Allow online booking</h4>
                <p className="text-[12px] text-[#7C8DB5] mt-1 font-medium">Allow users to make online booking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6.5 bg-[#E2E8F0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
              </label>
            </div>

            {/* Select Input 1 */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-extrabold text-[#1E40AF] uppercase tracking-widest ml-1">Default Currency</label>
              <div className="relative group">
                <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] py-4 px-5 text-[14px] font-bold text-[#1F2937] appearance-none focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 outline-none transition-all cursor-pointer">
                  <option>US Dollars $ - (USD)</option>
                  <option>PKR - Rupee</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7C8DB5] group-focus-within:text-[#2563EB]" size={20} />
              </div>
            </div>

            {/* Select Input 2 */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-extrabold text-[#1E40AF] uppercase tracking-widest ml-1">Timezone</label>
              <div className="relative group">
                <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] py-4 px-5 text-[14px] font-bold text-[#1F2937] appearance-none focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100/20 outline-none transition-all cursor-pointer">
                  <option>(GMT+5:00) Asia/Karachi (Pakistan Time)</option>
                  <option>(GMT+0:00) UTC</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7C8DB5]" size={20} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Buttons Area */}
      <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
          >
            Back
          </button>

          <button
            type="submit"
            // disabled={loading}
            className="px-10 py-2 bg-blue text-white rounded-md"
          >
            {null ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
          </button>
        </div>
    </div>
    </>
  );
};

export default SettingsPage;