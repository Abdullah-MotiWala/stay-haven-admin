import React from 'react';
import { useState } from 'react';
import leftangle from '../../assets/icons/leftangle.png';
const RoomCloumns = (props) => {
   const {feature,amenity,facilities} = props;
   const [features, setFeatures] = useState({
            spacious: true,
            balcony: true,
            stay: true,
            workspace: false,
            water: false,
            lunch: false,
        });
        const handleCheckboxChange = (name) => {
            setFeatures(prev => ({ ...prev, [name]: !prev[name] }));
        };

    return (
        <>
            <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
                <img src={leftangle} alt="" />
                <button className='text-gray-600 flex'>Back</button>

            </div>
            <div className="max-full mx-auto mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
                <p className="text-sm text-gray-500 font-medium">Fill in the details below to add a new room to your hotel inventory.</p>
            </div>



            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <h2 className="text-[16px] font-bold text-gray-900">Room Features</h2>
                </div>

                <div className="p-10 md:p-[15%] pt-5 pb-5">
                    <h3 className="text-[22px] font-bold text-gray-900 mb-8">Select Room Features</h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                        {feature.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={features[item.id]}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-blue checked:border-blue transition-all cursor-pointer"
                                    />
                                    {/* Custom Checkmark Icon */}
                                    <svg
                                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[15px] font-sm transition-colors ${features[item.id] ? 'text-blue' : 'text-[#7C8DB5]'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <h2 className="text-[16px] font-bold text-gray-900">Ameneties</h2>
                </div>

                <div className="p-10 md:p-[15%] pt-5 pb-5">
                    <h3 className="text-[22px] font-bold text-gray-900 mb-8">Select Ameneties</h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-y-4 gap-x-12">
                        {amenity.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={features[item.id]}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-blue checked:border-blue transition-all cursor-pointer"
                                    />
                                    {/* Custom Checkmark Icon */}
                                    <svg
                                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[15px] font-sm transition-colors ${features[item.id] ? 'text-blue' : 'text-[#7C8DB5]'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
                {/* Header */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <h2 className="text-[16px] font-bold text-gray-900">Room Facilities</h2>
                </div>

                <div className="p-10 md:p-[10%] pt-5 pb-5">
                    <h3 className="text-[22px] font-bold text-gray-900 mb-8">Select Room Facilities</h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-y-6 gap-x-12">
                        {facilities.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={features[item.id]}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-blue checked:border-blue transition-all cursor-pointer"
                                    />
                                    {/* Custom Checkmark Icon */}
                                    <svg
                                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[15px] font-sm transition-colors ${features[item.id] ? 'text-blue' : 'text-[#7C8DB5]'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full max-w-[1200px] mx-auto mt-8 mb-10 px-4 md:px-0">
                <div className="flex justify-end items-center gap-4">

                    {/* White Button (Cancel/Back) */}
                    <button
                        type="button"
                        onClick={() => console.log("Cancel Clicked")}
                        className="px-10 py-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-[15px] 
                     hover:bg-[#0A5BE2] hover:text-white hover:border-gray-400 transition-all duration-200 shadow-sm active:scale-95"
                    >
                        Cancel
                    </button>

                    {/* Blue Button (Save/Update) */}
                    <button
                        type="submit"
                        onClick={() => console.log("Save Clicked")}
                        className="px-10 py-4 rounded-lg bg-blue  text-white font-bold text-[15px] 
                     hover:bg-white hover:text-[#0A5BE2]  shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                        Save Changes
                    </button>

                </div>
            </div>
        </>
    );
}
export default RoomCloumns;