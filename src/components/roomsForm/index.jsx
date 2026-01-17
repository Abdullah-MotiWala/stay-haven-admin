// import React, { useState } from 'react';
// import FormInput from '../../container/dashboard/room-from';
// import { CloudUpload, FileText, Eye, Trash2 } from 'lucide-react';
// import leftangle from "../../assets/icons/leftangle.png"
// const RoomDetailsForm = () => {
//   const [formData, setFormData] = useState({
//     roomName: '', roomNumber: '', hotel: '', roomType: '',
//     bedType: '', roomSize: '', adults: '', children: '',
//     description: '', price: '', status: ''
//   });
// const [mainImage, setMainImage] = useState(null);
//   const [gallery, setGallery] = useState([]);

//   // Handle Main Image
//   const handleMainImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setMainImage({
//         name: file.name,
//         size: (file.size / 1024).toFixed(2) + " KB",
//         date: new Date().toLocaleString(),
//       });
//     }
//   };

//   // Handle Gallery Images
//   const handleGalleryChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newFiles = files.map(file => ({
//       name: file.name,
//       date: new Date().toLocaleString(),
//     }));
//     setGallery([...gallery, ...newFiles]);
//   };

//   const removeGalleryImage = (index) => {
//     setGallery(gallery.filter((_, i) => i !== index));
//   };
//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };


//   return (
//     <>
//     <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
//       <img src={leftangle} alt="" />
//         <button className='text-gray-600 flex'>Back</button>
    
//         </div>
//          <div className="max-full mx-auto mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
//         <p className="text-sm text-gray-500 font-medium">Fill in the details below to add a new room to your hotel inventory.</p>
//       </div>
//     <div className="min-h-screen  p-2 md:p-8 flex justify-center items-start">
//       <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
//         {/* Header Section */}
//         <div className="px-8 py-6 border-b border-gray-100 bg-white">
//           <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
//         </div>

//         <form className="p-[10%] pt-[2%] space-y-2" onSubmit={(e) => e.preventDefault()}>
          
//           {/* Section 1: Room Details Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
//             <FormInput 
//               label="Room Name" type="select" 
//               options={['Deluxe', 'Standard', 'Luxury Suites']}
//               placeholder="Select Room Name"
//             />
//             <FormInput label="Room Number" placeholder="105" />
            
//             <FormInput label="Select Hotel" placeholder="Grand Plaza Hotel" />
//             <FormInput 
//               label="Room Type" type="select"
//               options={['Single Bed Room', 'Double Bed Room']}
//               placeholder="Single Bed Room"
//             />
            
//             <FormInput 
//               label="Bed Type" type="select"
//               options={['Single Bed', 'Queen Bed', 'King Bed']}
//               placeholder="Single Bed / Queen Bed / King Bed"
//             />
//             <FormInput 
//               label="Room Size" type="select"
//               options={['25 m²', '35 m²', '50 m²']}
//               placeholder="e.g. 25 m²"
//             />
            
//             <FormInput 
//               label="Guest Adults" type="select"
//               options={['1 Guest', '2 Guests', '3 Guests']}
//               placeholder="2 Guests"
//             />
//             <FormInput 
//               label="Childrens" type="select"
//               options={['0 Childrens', '1 Childrens', '2 Childrens']}
//               placeholder="2 Childrens"
//             />
//           </div>

//           {/* Description - Full Width */}
//           <div className="w-full">
//             <FormInput 
//               label="Room Description" type="textarea"
//               placeholder="A comfortable and well-furnished room..."
//             />
//           </div>

//           <hr className="border-gray-100" />

//           {/* Pricing & Status Section */}
//           <div>
//             <h3 className="text-lg font-bold text-gray-800 mb-6 ">
//               Pricing & Status
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
//               <FormInput label="Price Per Night" placeholder="$100" />
//               <FormInput 
//                 label="Room Status" type="select"
//                 options={['Available', 'Occupied', 'Maintenance']}
//                 placeholder="Available / Occupied / Maintenace"
//               />
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>



//    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 font-sans overflow-hidden">
//       <div className="px-6 py-3 border-b border-gray-100">
//         <h2 className="text-[18px] mb-0 font-bold text-gray-900">Room Images</h2>
//       </div>

//       <div className="p-[8%] pt-2">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
//           {/* LEFT: Main Image Section */}
//           <div className="flex flex-col gap-4">
//             <label className="text-[15px] font-bold text-gray-900">Upload Room (Main) image</label>
//             <div className="relative group w-full h-[140px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
//               <div className="bg-white p-1 rounded-full shadow-sm mb-3">
//                 <CloudUpload className="w-6 h-6 text-gray-700" />
//               </div>
//               <p className="text-sm text-gray-700 font-medium text-center px-4">
//                 Drop your image here or <span className="text-blue-600 underline">Browse</span>
//               </p>
//               <p className="text-[11px] text-gray-400 mt-1">Only JPG/PNG Files under 2 MB</p>
//               <input type="file" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
//             </div>

//             {/* Main Image File Info Card */}
//             {mainImage && (
//               <div className=" max-h-full h-[30%] flex items-center justify-between p-10  pt-2 pb-2 rounded-lg ">
//                 <div className="flex items-center gap-3  overflow-hidden">
//                   <div className="bg-[#DBEAFE] p-2 rounded-lg shrink-0">
//                     <FileText className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div className="truncate">
//                     <p className="text-[13px] font-bold text-gray-800 truncate mb-0">{mainImage.name}</p>
//                     <p className="text-[11px] text-gray-400 mb-0">{mainImage.date}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 shrink-0 ml-2">
//                   <button className="p-1.5 bg-[#DBEAFE] text-blue-600 rounded-md hover:bg-blue-200 transition-colors"><Eye size={16} /></button>
//                   <button onClick={() => setMainImage(null)} className="p-1.5 bg-[#FEE2E2] text-red-500 rounded-md hover:bg-red-200 transition-colors"><Trash2 size={16} /></button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* RIGHT: Gallery Section */}
//           <div className="flex flex-col gap-4">
//             <label className="text-[15px] font-bold text-gray-900">Gallery (Optional)</label>
//             <div className="relative group w-full h-[140px] border-2 border-dashed border-[#3B82F6] rounded-[15px] bg-[#EFF6FF] hover:bg-[#EBF3FF] transition-all cursor-pointer flex flex-col items-center justify-center">
//               <div className="bg-white p-1 rounded-full shadow-sm mb-3">
//                 <CloudUpload className="w-8 h-8 text-gray-700" />
//               </div>
//               <p className="text-sm text-gray-700 font-medium text-center px-4">Upload multiple image</p>
//               <p className="text-[11px] text-gray-400 mt-1">Only JPG/PNG Files under 2 MB</p>
//               <input type="file" multiple onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
//             </div>

//             {/* Gallery File List (Scrollable if many files) */}
//             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
//               {gallery.map((file, index) => (
//                 <div key={index} className="flex items-center justify-between p-3 bg-[#F3F8FF] rounded-lg border border-blue-50">
//                   <div className="flex items-center gap-3 overflow-hidden">
//                     <div className="bg-[#DBEAFE] p-2 rounded-lg shrink-0">
//                       <FileText className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div className="truncate">
//                       <p className="text-[13px] font-bold text-gray-800 truncate">{file.name}</p>
//                       <p className="text-[11px] text-gray-400">{file.date}</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 shrink-0 ml-2">
//                     <button className="p-1.5 bg-[#DBEAFE] text-blue-600 rounded-md hover:bg-blue-200 transition-colors"><Eye size={16} /></button>
//                     <button onClick={() => removeGalleryImage(index)} className="p-1.5 bg-[#FEE2E2] text-red-500 rounded-md hover:bg-red-200 transition-colors"><Trash2 size={16} /></button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>

//        <div className="w-full max-w-[1200px] mx-auto mt-8 mb-10 px-4 md:px-0">
//                 <div className="flex justify-end items-center gap-4">

//                     {/* White Button (Cancel/Back) */}
//                     <button
//                         type="button"
//                         onClick={() => console.log("Cancel Clicked")}
//                         className="px-14 py-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-[15px] 
//                      hover:bg-[#0A5BE2] hover:text-white hover:border-gray-400 transition-all duration-200 shadow-sm active:scale-95"
//                     >
//                         Cancel
//                     </button>

//                     {/* Blue Button (Save/Update) */}
//                     <button
//                         type="submit"
//                         onClick={() => console.log("Save Clicked")}
//                         className="px-14 py-4 rounded-lg bg-blue  text-white font-bold text-[15px] 
//                      hover:bg-white hover:text-[#0A5BE2]  shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
//                     >
//                         Next
//                     </button>

//                 </div>
//             </div>
//     </>
//   );
// };

// export default RoomDetailsForm;



import React from 'react'

const RoomDetailsForm = () => {
  return (
    <div>
      <h1>hello world</h1>
    </div>
  )
}

export default RoomDetailsForm
