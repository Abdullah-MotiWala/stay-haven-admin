import React from 'react';
import FormInput from '../../container/dashboard/room-from'; // Logic Import
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

// --- Sub-Components ---
const FormInp = ({ label, type = "text", options = [], placeholder, value, onChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-tight ml-1">{label}</label>
    <div className="relative">
      {type === "select" ? (
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 bg-white text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
          <option value="">{placeholder}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={placeholder} />
      ) : (
        <input type={type} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={placeholder} />
      )}
      {type === "select" && <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>}
    </div>
  </div>
);

const UploadBox = ({ title, files, isMultiple }) => (
  <div className="w-full">
    <h3 className="text-sm font-bold text-gray-800 mb-3">{title}</h3>
    <div className="border-2 border-dashed border-blue-400 rounded-2xl bg-blue-50/40 p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all">
      <HiOutlineCloudUpload className="w-10 h-10 text-gray-600 mb-2" />
      <p className="text-sm text-gray-700 font-medium">
        {isMultiple ? "Upload multiple image" : "Drop your image here or"} <span className="text-blue-600 underline">Browse</span>
      </p>
      <p className="text-[11px] text-gray-400 mt-1">Only JPG/PNG Files under 2 MB</p>
    </div>
    <div className="mt-4 space-y-3">
      {files.map((file, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><HiOutlineDocumentText size={20} /></div>
            <div>
              <p className="text-xs font-bold text-gray-700">{file.name}</p>
              <p className="text-[10px] text-gray-400">{file.date}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><HiOutlineEye size={16} /></button>
            <button className="p-1.5 bg-red-50 text-red-400 rounded-md"><HiOutlineTrash size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);


// // --- Main Page ---
// const RoomForm = (props) => {
//   const { activeType, setActiveType, roomTypes, mainImage, gallery } = props;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-gray-900">
      
//       {/* 1. Header Navigation Buttons */}
//       <div className="inline-flex flex-wrap bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
//         {roomTypes.map((type, index) => (
//           <button
//             key={type}
//             onClick={() => setActiveType(type)}
//             className={`px-6 py-3 text-sm font-semibold border-r last:border-0 transition-all
//               ${activeType === type ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 hover:bg-gray-50 border-gray-100"}
//               ${index === 0 ? "rounded-l-xl" : ""} ${index === roomTypes.length - 1 ? "rounded-r-xl" : ""}
//             `}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       {/* 2. Main Form Container */}
//       <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-8 py-5 border-b border-gray-100"><h2 className="text-lg font-bold">Room Details</h2></div>
        
//         <div className="p-8 md:p-12 space-y-10">
//           {/* Inputs Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
//             <FormInput label="Room Name" type="select" options={['Deluxe', 'Standard']} placeholder="Deluxe / Standard / Luxury Suites" />
//             <FormInput label="Room Number" placeholder="105" />
//             <FormInput label="Select Hotel" placeholder="Grand Plaza Hotel" />
//             <FormInput label="Room Type" type="select" options={['Single Bed Room']} placeholder="Single Bed Room" />
//             <FormInput label="Bed Type" type="select" placeholder="Single Bed / Queen Bed / King Bed" />
//             <FormInput label="Room Size" type="select" placeholder="e.g. 25 m²" />
//             <FormInput label="Guest Adults" type="select" placeholder="2 Guests" />
//             <FormInput label="Childrens" type="select" placeholder="2 Childrens" />
//           </div>

//           <FormInput label="Room Description" type="textarea" placeholder="A comfortable and well-furnished room designed for a relaxing stay..." />

//           {/* Pricing Section */}
//           <div className="pt-4">
//             <h3 className="text-lg font-bold mb-6">Pricing & Status</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
//               <FormInput label="Price Per Night" placeholder="$100" />
//               <FormInput label="Room Status" type="select" placeholder="Available / Occupied / Maintenace" />
//             </div>
//           </div>

//           {/* Room Images Section */}
//           <div className="pt-6 border-t border-gray-100">
//             <h2 className="text-lg font-bold mb-8">Room Images</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//               <UploadBox title="Upload Room (Main) image" files={mainImage} isMultiple={false} />
//               <UploadBox title="Gallery (Optional)" files={gallery} isMultiple={true} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default FormInp;