import leftangle from "../../assets/icons/leftangle.png"
import { ChevronDown, Info } from 'lucide-react';
import selection from "../../assets/icons/selection.png"
import { useParams } from "react-router-dom";
import { useState } from "react";
import calenderIcon from "../../assets/icons/calendarIcon.png"
const BookingAddComp = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
                <img src={leftangle} alt="" />
                <button className='text-gray-600 flex'>Back</button>
            </div>


            <h3 className="font-semibold pb-2 px-3"> Add New Booking</h3>

            <div className="bg-white rounded-2xl shadow-md min-h-screen p-4 md:p-8 w-full">
                {/* Main Grid: 3 columns on desktop */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT SIDE: Inputs (Occupies 2/3 of space) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Section 1: Guest Information */}
                        <div className=" bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">
                                Guest Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                {/* Full Name */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Guest Full Name</label>
                                    <input type="text" required placeholder="Enter full Name" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0 " />
                                </div>
                                {/* Phone */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Phone Number</label>
                                    <input type="text" required placeholder="Enter Number" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0" />
                                </div>
                                {/* Email */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Email (Optional)</label>
                                    <input type="email" required placeholder="Enter email" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0" />
                                </div>
                                {/* CNIC */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">CNIC</label>
                                    <input type="text" required placeholder="enter CNIC" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Room Selection */}
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-lg mb-6 pb-2 border-b border-gray-100">
                                Room Selection
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                {/* Hotel Select */}
                                <div className="flex flex-col ">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Hotel Name</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer m-0">
                                            <option>Ocean View Resort</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                {/* Room Type Select */}
                                <div className="flex flex-col ">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Select Room</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer m-0">
                                            <option>Deluxe / Standard</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                {/* Room Number Select */}
                                <div className="flex flex-col ">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Room Number</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer m-0">
                                            <option>Room No 105</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                {/* Guests Select */}
                                <div className="flex flex-col ">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Number of Guests</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer m-0">
                                            <option>02 Adults</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">
                                Stay Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                {/* Full Name */}
                               <div className="flex flex-col w-full">
  <label className="text-lightSeconday text-13 font-bold ml-1 mb-1">
    Checked in Date
  </label>

  <div className="relative group">
    <input
      type="date"
      required
      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0 appearance-none
      /* 1. Default icon ko bilkul hide karne ke liye */
      [&::-webkit-calendar-picker-indicator]:opacity-0 
      [&::-webkit-calendar-picker-indicator]:absolute 
      [&::-webkit-calendar-picker-indicator]:inset-0 
      [&::-webkit-calendar-picker-indicator]:cursor-pointer 
      [&::-webkit-calendar-picker-indicator]:z-10"
    />
    
    {/* 2. Aapka apna Custom Icon */}
    <img
      src={calenderIcon}
      alt="calendar"
      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-0"
    />
  </div>
</div>
                                {/* Phone */}
                                <div className="flex flex-col w-full">
  <label className="text-lightSeconday text-13 font-bold ml-1 mb-1">
    Checked out Date
  </label>

  <div className="relative group">
    <input
      type="date"
      required
      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0 appearance-none
      /* 1. Default icon ko bilkul hide karne ke liye */
      [&::-webkit-calendar-picker-indicator]:opacity-0 
      [&::-webkit-calendar-picker-indicator]:absolute 
      [&::-webkit-calendar-picker-indicator]:inset-0 
      [&::-webkit-calendar-picker-indicator]:cursor-pointer 
      [&::-webkit-calendar-picker-indicator]:z-10"
    />
    
    {/* 2. Aapka apna Custom Icon */}
    <img
      src={calenderIcon}
      alt="calendar"
      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-0"
    />
  </div>
</div>
                                {/* Email */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Total Night</label>
                                    <input type="email" required placeholder="Enter Nights" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0" />
                                </div>

                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">
                                Pricing & Payment
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                {/* Full Name */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Price per Night</label>
                                    <input type="text" required placeholder="Enter Price" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0 " />
                                </div>
                                {/* Phone */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Taxes & Fee</label>
                                    <input type="text" required placeholder="Enter Taxes & Fee" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0" />
                                </div>
                                {/* Email */}
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Discount</label>
                                    <input type="email" required placeholder="Enter Discount" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all m-0" />
                                </div>
                                {/* CNIC */}
                                <div className="flex flex-col ">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Payment Method</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer m-0">
                                            <option>Bank</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Section 3: Booking Status */}
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm mt-6">
                            <h3 className="text-dark  ont-semibold text-lg mb-6 pb-1 border-b-2 border-gray-100">
                                Booking Status
                            </h3>

                            <div className="flex flex-wrap items-center gap-12 py-2">
                                <span className="text-dark font-semibold text-15">Set Booking Status</span>

                                <div className="flex items-center gap-8">
                                    {/* Checked In Option */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="bookingStatus"
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all"
                                                defaultChecked
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-blue rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className="text-dark font-medium text-15 group-hover:text-blue transition-colors">
                                            Checked in
                                        </span>
                                    </label>

                                    {/* Reserved Option */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="bookingStatus"
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all"
                                            />
                                            <div className="absolute w-2.5 h-2.5 bg-blue rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className="text-dark font-medium text-15 group-hover:text-blue transition-colors">
                                            Reserved
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Booking Summary Container */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#EDFDF2] border-2 border-[#107326] rounded-[24px] p-6 sticky top-8 ">
                            <h3 className="text-[#107326] font-semibold  text-lg mb-5 border-b-2 border-darkgrayline pb-2">Booking Summary</h3>

                            <div className="space-y-5">
                                {/* Room Selected Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[#718096] text-13 font-semibold mb-0 tracking-wider">Room Selected</p>
                                        <p className="text-dark font-bold text-base">Double Bed Room #101</p>
                                    </div>
                                    <span className="pt-2.5  rounded-xl shadow-sm text-lg"><img src={selection} alt="" /></span>
                                </div>

                                {/* Stay Duration */}
                                <div className="flex justify-between   item-center">
                                    <div className="flex flex-col justify-between text-14">
                                        <span className="text-[#718096] font-medium">Stay Duration</span>
                                        <span className="text-dark font-bold">02 Jan 2026 - 05 Jan 2026</span>
                                    </div>
                                    <p className="text-right text-dark font-bold mt-2 text-sm">2 Nights</p>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="border-t-2 border-darkgrayline pt-4 space-y-3 text-14">
                                    <p className="text-lightSeconday font-bold text-sm">Pricing Breakdown</p>
                                    <div className="flex justify-between font-medium  text-dark">
                                        <span>Bases Price 3 night ($150 x 3)</span>
                                        <span className="font-bold text-dark">$450.00</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-dark">
                                        <span>Taxes & Service Fees</span>
                                        <span className="font-bold text-dark">$25.00</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-dark">
                                        <span>Discount</span>
                                        <span className="font-bold text-red">-$25.00</span>
                                    </div>
                                </div>

                                {/* Totals Section */}
                                <div className="border-t-2 border-darkgrayline pt-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-dark font-semibold text-sm">Total Payable</span>
                                        <span className="text-xl font-bold text-blue">$450.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-dark font-medium">Amount Paid</span>
                                        <div className=" border border-lightSeconday rounded-lg px-3 py-1.5 font-bold text-dark text-sm ">
                                            $450.00
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-dark font-medium">Remaining Balance</span>
                                        <span className="font-bold text-dark">$0.00</span>
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="mt-6 flex gap-3 p-3">
                                    <Info size={20} className="text-[#48BB78] shrink-0" />
                                    <p className="text-[11px] text-[#718096] leading-relaxed">
                                        Room availability is checked automatically upon selection. Price estimates include regional stay taxes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
                >
                    Back
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-2 bg-blue text-white rounded-md"
                >
                    {loading ? "Adding..." : isEditMode ? "Save" : "Save Bookig"}
                </button>
            </div>
        </>
    )
}
export default BookingAddComp;