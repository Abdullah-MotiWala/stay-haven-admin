import leftangle from "../../assets/icons/leftangle.png"
import edit from "../../assets/icons/editIcon.png"
import BookingContainer from "../bookingCoantainer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {updateStats} from "../../services/booking";
import { useEffect } from "react"
import { openNotification } from "../../network/notification";  
const BookingComp = (props) => {
    const navigate = useNavigate();
    const { guestInfo, stayDetails, paymentSummary, status, bookingId, ids } = props;
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // --- Status Update Logic ---
    const handleStatusUpdate = async (newStatus) => {
        setLoading(true);
        try {
            // ids yahan parent se aa rahi hai jo booking ki mongoDB id hai
            const res = await updateStats(ids, { status: newStatus });

            if (res.status === 200 || res.status === 201) {
                openNotification("success", `Booking status updated to ${newStatus}`);
                // Status update hone ke baad page refresh ya navigate kar sakte hain
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            openNotification("error", "Failed to update booking status");
        } finally {
            setLoading(false);
        }
    };
    // const info = [
    //     { label: "Name", value: "Muhammad Akbar Ali" },
    //     { label: "Phone Number", value: "+92 331 5637647" },
    //     { label: "Email", value: "makbarali92@gmail.com" },
    //     { label: "ID Card Number", value: "34603-6256253-8" },
    // ];
    // const Stay_Details = [
    //     { label: "Room", value: "Standard Room" },
    //     { label: "Room Number", value: "105" },
    //     { label: "Total Members", value: "2 Adults" },
    //     { label: "Hotel Name", value: "Ocean View Resort" },
    //     { label: "Check-in Date", value: "Jan 02, 2026" },
    //     { label: "Check-out Date", value: "Jan 05, 2026" },
    //     { label: "Total Nights", value: "03" },
    // ];
    // const Payment_Summary = [
    //     { label: "Room Charges ($350 x 3)", value: "$1,050.00", type: "default" },
    //     { label: "Taxes & Service Fees", value: "$195.00", type: "default" },
    //     { label: "Total Amount", value: "$1,245.00", type: "total" },
    //     { label: "Paid Amount", value: "$1,245.00", type: "paid" },
    //     { label: "Remaining Balance", value: "$0.00", type: "default" },
    // ];
    return (<>

        <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
            <img src={leftangle} alt="" />
            <button className='text-gray-600 flex' onClick={() => navigate("/admin/booking")}>Back</button>

        </div>

        <div className="flex justify-between items-center mb-3 px-4">
            <div className="flex gap-4">
                <p className="font-semibold text-24 ">Booking Details <span>- {bookingId}</span></p>
                <div className="bg-green-400 w-23 h-full rounded-lg">
                    <p className="text-[#107326] bg-green-400 p-1.5 px-3 rounded-full font-medium">{status}</p>
                </div>
            </div>
            <button className="border border-2 p-2 w-90 items-center flex gap-2 font-medium rounded-full bg-slate-100">
                <span><img src={edit} alt="" onClick={() => navigate(`/admin/booking/edit/${ids}`)} /></span>Edit
            </button>
        </div>

        <div className="min-h-screen  p-4 md:p-8 flex flex-col gap-6">
            <div className="bg-white border border-gray-100 rounded-24 p-6 md:p-8 shadow-sm w-full">
                <h3 className="text-gray-900 font-semibold text-18 mb-6 border-b-2 pb-2 border-darkgrayline">Guest Information</h3>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3">
                    {guestInfo.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1 ">
                            <span className="text-lightSeconday text-sm font-normal">{item.label}</span>
                            <span className="text-dark text-base font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-24 p-6 md:p-8 shadow-sm w-full">
                <h3 className="text-gray-900 font-semibold text-18 mb-6 border-b-2 pb-2 border-darkgrayline">Stay Detail</h3>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3">
                    {stayDetails.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1 ">
                            <span className="text-lightSeconday text-sm font-normal">{item.label}</span>
                            <span className="text-dark text-base font-medium">{item.value}</span>
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
                                {paymentSummary.map((item, i) => (
                                    <div key={i}>
                                        {/* Divider before Total Amount */}
                                        {item.type === "total" && <div className="border-t border-gray-100 my-4 pt-4" />}

                                        <div className="flex justify-between items-center py-1">
                                            <span className={`text-15 ${item.type === 'total' ? 'font-bold text-xl text-dark' : 'font-medium text-dark'}`}>
                                                {item.label}
                                            </span>
                                            <span className={`text-15 font-bold ${item.type === 'total' ? 'text-[#0061F2]' :
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
                            onClick={() => handleStatusUpdate("Checked-In")}
                            className=" border-2 border-darkgrayline bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
                        >
                            Check in
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => handleStatusUpdate("Checked-out")}
                            className="border-2 border-darkgrayline bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
                        >
                            {loading ? "Adding..." : isEditMode ? "Check out" : "Added"}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusUpdate("Cancelled")}
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