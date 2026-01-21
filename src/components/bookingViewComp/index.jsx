import leftangle from "../../assets/icons/leftangle.png"
import edit from "../../assets/icons/editIcon.png"
import BookingContainer from "../bookingCoantainer";
import { useParams } from "react-router-dom";
import { useState } from "react";
const BookingComp = () => {
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const info = [
        { label: "Name", value: "Muhammad Akbar Ali" },
        { label: "Phone Number", value: "+92 331 5637647" },
        { label: "Email", value: "makbarali92@gmail.com" },
        { label: "ID Card Number", value: "34603-6256253-8" },
    ];
    const Stay_Details = [
        { label: "Room", value: "Standard Room" },
        { label: "Room Number", value: "105" },
        { label: "Total Members", value: "2 Adults" },
        { label: "Hotel Name", value: "Ocean View Resort" },
        { label: "Check-in Date", value: "Jan 02, 2026" },
        { label: "Check-out Date", value: "Jan 05, 2026" },
        { label: "Total Nights", value: "03" },
    ];
    const Payment_Summary = [
        { label: "Room Charges ($350 x 3)", value: "$1,050.00", type: "default" },
        { label: "Taxes & Service Fees", value: "$195.00", type: "default" },
        { label: "Total Amount", value: "$1,245.00", type: "total" },
        { label: "Paid Amount", value: "$1,245.00", type: "paid" },
        { label: "Remaining Balance", value: "$0.00", type: "default" },
    ];
    return (<>

        <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
            <img src={leftangle} alt="" />
            <button className='text-gray-600 flex'>Back</button>

        </div>

        <div className="flex justify-between items-center mb-3 px-4">
            <div className="flex gap-4">
                <p className="font-semibold text-[24px] ">Booking Details <span>- #321-02</span></p>
                <div className="bg-green-400 w-23 h-full rounded-lg">
                    <p className="text-[#107326] bg-green-400 p-1.5 px-3 rounded-full font-medium">Available</p>
                </div>
            </div>
            <button className="border border-2 p-2 w-[90px] items-center flex gap-2 font-medium rounded-full bg-slate-100">
                <span><img src={edit} alt="" /></span>Edit
            </button>
        </div>

        <div className="min-h-screen  p-4 md:p-8 flex flex-col gap-6">
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm w-full">
                <h3 className="text-gray-900 font-semibold text-[18px] mb-6 border-b-2 pb-2 border-[#DFDFDF]">Guest Information</h3>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3">
                    {info.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1 ">
                            <span className="text-[#8E99B7] text-sm font-normal">{item.label}</span>
                            <span className="text-[#212121] text-base font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm w-full">
                <h3 className="text-gray-900 font-semibold text-[18px] mb-6 border-b-2 pb-2 border-[#DFDFDF]">Stay Detail</h3>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3">
                    {Stay_Details.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1 ">
                            <span className="text-[#8E99B7] text-sm font-normal">{item.label}</span>
                            <span className="text-[#212121] text-base font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>


            <div className="min-h-screen">
                <div className="min-h-screen mb-0 mx-auto space-y-4">

                    {/* Payment Summary Section (Center Aligned Layout) */}
                    <BookingContainer title="Payment Summary">
                        <div className="flex justify-center w-full overflow-x-auto">
                            <div className="w-full max-w-lg space-y-4">
                                {Payment_Summary.map((item, i) => (
                                    <div key={i}>
                                        {/* Divider before Total Amount */}
                                        {item.type === "total" && <div className="border-t border-gray-100 my-4 pt-4" />}

                                        <div className="flex justify-between items-center py-1">
                                            <span className={`text-[15px] ${item.type === 'total' ? 'font-bold text-xl text-dark' : 'font-medium text-dark'}`}>
                                                {item.label}
                                            </span>
                                            <span className={`text-[15px] font-bold ${item.type === 'total' ? 'text-[#0061F2]' :
                                                item.type === 'paid' ? 'text-[#05CD99]' : 'text-dark]'
                                                }`}>
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BookingContainer>
<div className="flex justify-end gap-4 mt-4 ">
            <button
                type="button"

                className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
            >
                Check in
            </button>

            <button
                type="submit"
                disabled={loading}
                className="border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
            >
                {loading ? "Adding..." : isEditMode ? "Check out" : "Added"}
            </button>
             <button
                type="button"

                className=" border-2  bg-[#FFDCDE] px-10 text-red rounded-md py-2 font-medium hover:bg-red hover:text-white transition-all"
            >
                Cancle Booking
            </button>
        </div>
                </div>
                
            </div>
            
        </div>
        
    </>)
}
export default BookingComp;