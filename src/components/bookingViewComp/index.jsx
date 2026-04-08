import leftangle from "../../assets/icons/leftangle.png"
import edit from "../../assets/icons/editIcon.png"
import BookingContainer from "../bookingCoantainer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateStats } from "../../services/booking";
import { useEffect } from "react"
import { openNotification } from "../../network/notification";

const BookingComp = (props) => {
    const navigate = useNavigate();
    const { guestInfo, stayDetails, paymentSummary, status, bookingId, ids } = props;
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // ✅ Status normalize karo
    const normalizedStatus = status?.toLowerCase();

    const isCheckedIn  = normalizedStatus === "checked-in"  || normalizedStatus === "checkin";
    const isCancelled  = normalizedStatus === "cancelled"   || normalizedStatus === "canceled";
    const isCompleted  = normalizedStatus === "completed"   || normalizedStatus === "complete" || normalizedStatus === "Checked-Out";

    // ✅ Button disable rules:
    // Check In  → disable jab: already checked-in, cancelled, ya completed
    // Check Out → disable jab: cancelled ya completed (sirf checked-in par active)
    // Cancel    → disable jab: already checked-in, cancelled, ya completed
    const checkInDisabled  = loading || isCheckedIn || isCancelled || isCompleted;
    const checkOutDisabled = loading || isCancelled || isCompleted;
    const cancelDisabled   = loading || isCheckedIn || isCancelled || isCompleted;

    const handleStatusUpdate = async (newStatus) => {
        setLoading(true);
        try {
            const res = await updateStats(ids, { status: newStatus });
            if (res.status === 200 || res.status === 201) {
                openNotification("success", `Booking status updated to ${newStatus}`);
                navigate("/admin/bookings");
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            openNotification("error", "Failed to update booking status");
        } finally {
            setLoading(false);
        }
    };

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case "checked-in":
            case "checkin":
                return "bg-lightYellow text-dark";
            case "completed":
            case "complete":
            case "checked-out":
            case "checked-Out":
                return "bg-shadeGreen text-darkGreen";
            case "reserved":
                return "bg-statusBlue text-darkBlue";
            case "cancelled":
            case "canceled":
                return "bg-lightRed text-red";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // ✅ Disabled button shared style
    const disabledClass = "opacity-40 cursor-not-allowed pointer-events-none";

    return (<>
        <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
            <img src={leftangle} alt="" />
            <button className='text-gray-600 flex' onClick={() => navigate("/admin/bookings")}>Back</button>
        </div>

        <div className="flex justify-between items-center mb-3 px-4">
            <div className="flex gap-4">
                <p className="font-semibold text-24">Booking Details <span>- {bookingId}</span></p>
                <div className="w-23 h-full rounded-lg">
                    <p className={`p-1.5 px-3 rounded-full font-semibold capitalize ${getStatusClasses(status)}`}>
                        {status}
                    </p>
                </div>
            </div>
            <button
                className="border border-2 p-2 px-3 w-90 items-center flex gap-2 font-medium rounded-full bg-slate-100 hover:bg-lightGray transform transition-all duration-300"
                onClick={() => navigate(`/admin/booking/edit/${ids}`)}
            >
                <span><img src={edit} alt="" /></span>Edit
            </button>
        </div>

        <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6">
            {/* Guest Information */}
            <div className="bg-white border border-gray-100 rounded-24 p-6 md:p-8 shadow-sm w-full">
                <h3 className="text-gray-900 font-semibold text-18 mb-3">Guest Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3 border-t-1 border-darkgrayline pt-4">
                    {guestInfo.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <span className="text-lightSeconday text-sm font-normal">{item.label}</span>
                            <span className="text-dark text-base font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stay Details */}
            <div className="bg-white border border-gray-100 rounded-24 p-6 md:p-8 shadow-sm w-full">
                <h3 className="text-gray-900 font-semibold text-18 mb-3 border-b-2 pb-2 border-darkgrayline">Stay Detail</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3 border-t-1 border-darkgrayline pt-4">
                    {stayDetails.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <span className="text-lightSeconday text-sm font-normal">{item.label}</span>
                            <span className="text-dark text-base font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-0 mx-auto space-y-4 w-full">
                <BookingContainer title="Payment Summary" titleBorder>
                    <div className="flex justify-center w-full overflow-x-auto">
                        <div className="w-full max-w-lg">
                            {paymentSummary.map((item, i) => (
                                <div key={i}>
                                    {item.type === "total" && (
                                        <div className="border-t-1 border-gray-200 my-2" />
                                    )}
                                    <div className="flex justify-between items-center py-3">
                                        <span className={`text-15 ${item.type === 'total' ? 'font-bold text-xl text-dark' : 'font-medium text-dark'}`}>
                                            {item.label}
                                        </span>
                                        <span className={`text-15 font-bold ${
                                            item.type === 'total' ? 'text-[#0061F2]' :
                                            item.type === 'paid' ? 'text-[#05CD99]' :
                                            'text-dark'
                                        }`}>
                                            {item.value}
                                        </span>
                                    </div>
                                    {i < paymentSummary.length - 1 && item.type !== "total" && (
                                        <div className="border-t border-gray-100" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </BookingContainer>

                <div className="flex justify-end gap-4 mt-4">
                    {/* ✅ Check In Button */}
                    <button
                        type="button"
                        disabled={checkInDisabled}
                        onClick={() => handleStatusUpdate("Checked-In")}
                        className={`border-1 border-darkgrayline bg-myWhite px-10 text-lightSeconday rounded-md py-4 font-medium transition-all
                            ${checkInDisabled ? disabledClass : "hover:bg-gray-50"}`}
                    >
                        Check In
                    </button>

                    {/* ✅ Check Out Button — sirf Checked-In status par active */}
                    <button
                        type="button"
                        disabled={checkOutDisabled}
                        onClick={() => handleStatusUpdate("Checked-Out")}
                        className={`border-1 border-darkgrayline bg-myWhite px-10 text-lightSeconday rounded-md py-4 font-medium transition-all
                            ${checkOutDisabled ? disabledClass : "hover:bg-gray-50"}`}
                    >
                        {loading ? "Updating..." : "Check Out"}
                    </button>

                    {/* ✅ Cancel Booking Button */}
                    <button
                        type="button"
                        disabled={cancelDisabled}
                        onClick={() => handleStatusUpdate("Cancelled")}
                        className={`border-2 bg-[#FFDCDE] px-10 text-red rounded-md py-4 font-medium transition-all
                            ${cancelDisabled ? disabledClass : "hover:bg-red hover:text-white"}`}
                    >
                        Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    </>);
};

export default BookingComp;