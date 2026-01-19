import React from 'react';
import { useState } from 'react';
const FormInput = ({ label, type = "text", options, placeholder, value, onChange }) => {
  const baseClasses = " placeholder-dark w-full m-0 px-4 py-3 rounded-sm border border-blue-100 text-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all appearance-none cursor-pointer";
    const [activeType, setActiveType] = useState("All Rooms");
    const [formData, setFormData] = useState({
      roomName: '', roomNumber: '', hotel: '', roomType: '',
      bedType: '', roomSize: '', adults: '', children: '',
      description: '', price: '', status: ''
    });

    const [mainImage, setMainImage] = useState([{ name: 'Room image.JPG', date: '22/07/2023 10:30 AM' }]);
    const [gallery, setGallery] = useState([{ name: 'Room1.JPG', date: '22/07/2023 10:30 AM' }]);

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const roomTypes = ["All Rooms", "Single Bed Room", "Double Bed Room", "Three Bed Room", "Luxury Suites"];

    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs font-semibold text-gray-500 pb-0  uppercase tracking-wider">
          {label}
        </label>

        <div className="relative">
          {type === "select" ? (
            <>
              <select className={baseClasses} value={value} onChange={onChange}>
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </>
          ) : type === "textarea" ? (
            <textarea
              rows="4"
              className={`${baseClasses} resize-none`}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          ) : (
            <input
              type={type}
              className={baseClasses}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    );
  };

  export default FormInput;

