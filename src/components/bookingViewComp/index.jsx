import leftangle from "../../assets/icons/leftangle.png";
import edit from "../../assets/icons/editIcon.png";
import BookingContainer from "../bookingCoantainer";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateStats } from "../../services/booking";
import { openNotification } from "../../network/notification";
import { Select, Input } from "antd";

const CANCEL_REASONS = [
    "Change of plans",
    "Found a better option",
    "Price too high",
    "Personal emergency",
    "Duplicate booking",
    "Other",
];

const BookingComp = ({ guestInfo, stayDetails, paymentSummary, status: initialStatus, bookingId, ids, onStatusChange }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromTab = location.state?.fromTab;
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(initialStatus);
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [docType, setDocType] = useState("CNIC");
    const [docNumber, setDocNumber] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const s = currentStatus?.toLowerCase()?.trim();
    const isCheckedIn = s === "checked-in" || s === "checkin";
    const isCancelled = s === "cancelled" || s === "canceled";
    const isCompleted = s === "completed" || s === "complete" || s === "checked-out" || s === "checkedout";

    const checkInDisabled = loading || isCheckedIn || isCancelled || isCompleted;
    const checkOutDisabled = loading || !isCheckedIn;
    const cancelDisabled = loading || isCheckedIn || isCancelled || isCompleted;
    const dis = "opacity-40 cursor-not-allowed pointer-events-none";

    const handleStatusUpdate = async (newStatus, extra = {}) => {
        setLoading(true);
        try {
            const res = await updateStats(ids, { status: newStatus, ...extra });
            if (res.status === 200 || res.status === 201) {
                openNotification("success", `Status updated to ${newStatus}`);
                setCurrentStatus(newStatus);
                onStatusChange && onStatusChange(newStatus);
            } else {
                openNotification("error", "Failed to update status");
            }
        } catch {
            openNotification("error", "Failed to update booking status");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckInConfirm = async () => {
        if (!docNumber.trim()) { openNotification("error", "Please enter document number"); return; }
        setShowCheckInModal(false);
        await handleStatusUpdate("Checked-In", { documentType: docType, documentNumber: docNumber.trim() });
        setDocNumber("");
    };

    const handleCancelConfirm = async () => {
        if (!cancelReason) { openNotification("error", "Please select a reason"); return; }
        setShowCancelModal(false);
        await handleStatusUpdate("Cancelled", { cancellationReason: cancelReason });
        setCancelReason("");
    };

    const statusCls = (s) => {
        switch (s?.toLowerCase()?.trim()) {
            case "checked-in":
            case "checkin": return "bg-lightYellow text-dark";
            case "completed":
            case "complete":
            case "checked-out":
            case "checkedout": return "bg-shadeGreen text-darkGreen";
            case "booked":
            case "reserved": return "bg-statusBlue text-darkBlue";
            case "cancelled":
            case "canceled": return "bg-lightRed text-red";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <>
            {/* Back */}
            <div className="flex items-center gap-4 border-b border-gray-300 mb-2 pb-4">
                <button className="text-gray-600 flex items-center gap-4" onClick={() => navigate(-1)}>
                    <img src={leftangle} alt="" />
                    Back
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-3 px-4">
                <div className="flex gap-4 items-center">
                    <p className="font-semibold text-24">Booking Details <span>- {bookingId}</span></p>
                    <span className={`p-1.5 px-3 rounded-full font-semibold capitalize text-sm ${statusCls(currentStatus)}`}>
                        {currentStatus}
                    </span>
                </div>
                <button
                    disabled={isCancelled || isCompleted}
                    className="border-2 p-2 px-3 flex items-center gap-2 font-medium rounded-full bg-slate-100 hover:bg-lightGray transition-all"
                    onClick={() => navigate(`/admin/booking/edit/${ids}`, { state: { fromTab } })}
                >
                    <img src={edit} alt="" /> Edit
                </button>
            </div>

            <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6">
                {/* Guest Info */}
                <div className="bg-white border border-gray-100 rounded-24 p-6 md:p-8 shadow-sm">
                    <h3 className="text-gray-900 font-semibold text-18 mb-3">Guest Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3 border-t border-darkgrayline pt-4">
                        {guestInfo.map((item, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-lightSeconday text-sm font-normal">{item.label}</span>
                                <span className="text-dark text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stay Details */}
                <div className="bg-white border border-gray-100 rounded-24 p-6 md:p-8 shadow-sm">
                    <h3 className="text-gray-900 font-semibold text-18 mb-3 border-b-2 pb-2 border-darkgrayline">Stay Detail</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-20 gap-y-6 gap-x-3 pt-4">
                        {stayDetails.map((item, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-lightSeconday text-sm font-normal">{item.label}</span>
                                <span className="text-dark text-base font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment + Buttons */}
                <div className="space-y-4 w-full">
                    <BookingContainer title="Payment Summary">
                        <div className="flex justify-center w-full overflow-x-auto">
                            <div className="w-full max-w-lg">
                                {paymentSummary.map((item, i) => (
                                    <div key={i}>
                                        {item.type === "total" && <div className="border-t border-gray-200 my-2" />}
                                        <div className="flex justify-between items-center py-3">
                                            <span className={`text-15 ${item.type === "total" ? "font-bold text-xl text-dark" : "font-medium text-dark"}`}>
                                                {item.label}
                                            </span>
                                            <span className={`text-15 font-bold ${item.type === "total" ? "text-[#0061F2]" :
                                                item.type === "paid" ? "text-[#05CD99]" : "text-dark"
                                                }`}>
                                                {item.value}
                                            </span>
                                        </div>
                                        {i < paymentSummary.length - 1 && item.type !== "total" && <div className="border-t border-gray-100" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BookingContainer>

                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" disabled={checkInDisabled}
                            onClick={() => setShowCheckInModal(true)}
                            className={`border border-darkgrayline bg-myWhite px-10 text-lightSeconday rounded-md py-4 font-medium transition-all ${checkInDisabled ? dis : "hover:bg-gray-50"}`}>
                            Check In
                        </button>
                        <button type="button" disabled={checkOutDisabled}
                            onClick={() => handleStatusUpdate("Checked-Out")}
                            className={`border border-darkgrayline bg-myWhite px-10 text-lightSeconday rounded-md py-4 font-medium transition-all ${checkOutDisabled ? dis : "hover:bg-gray-50"}`}>
                            {loading ? "Updating..." : "Check Out"}
                        </button>
                        <button type="button" disabled={cancelDisabled}
                            onClick={() => setShowCancelModal(true)}
                            className={`border-2 bg-[#FFDCDE] px-10 text-red rounded-md py-4 font-medium transition-all ${cancelDisabled ? dis : "hover:bg-red hover:text-white"}`}>
                            Cancel Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* Check-In Modal */}
            {showCheckInModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Guest Verification</h3>
                        <p className="text-sm text-gray-500 mb-6">Enter guest document details to complete check-in.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Document Type</label>
                                <Select value={docType} onChange={setDocType} className="w-full h-11"
                                    options={[
                                        { label: "CNIC", value: "CNIC" },
                                        { label: "Passport", value: "Passport" },
                                    ]}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Document Number</label>
                                <Input
                                    placeholder={docType === "CNIC" ? "e.g. 42101-1234567-1" : "Enter number"}
                                    value={docNumber}
                                    onChange={(e) => setDocNumber(e.target.value)}
                                    className="h-11"
                                    onPressEnter={handleCheckInConfirm}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowCheckInModal(false); setDocNumber(""); }}
                                className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleCheckInConfirm} disabled={loading || !docNumber.trim()}
                                className="px-6 py-2 bg-blue text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                                {loading ? "Processing..." : "Confirm Check-In"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Booking</h3>
                        <p className="text-sm text-gray-500 mb-6">Please select a reason for cancellation.</p>
                        <div className="space-y-3 mb-6">
                            {CANCEL_REASONS.map((reason) => (
                                <label key={reason} className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex items-center justify-center">
                                        <input type="radio" name="cancelReason" value={reason}
                                            checked={cancelReason === reason}
                                            onChange={() => setCancelReason(reason)}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red transition-all"
                                        />
                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-red scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{reason}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowCancelModal(false); setCancelReason(""); }}
                                className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                                Back
                            </button>
                            <button onClick={handleCancelConfirm} disabled={loading}
                                className="px-6 py-2 bg-red text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                                {loading ? "Cancelling..." : "Confirm Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingComp;
