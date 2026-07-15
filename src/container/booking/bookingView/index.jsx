import BookingComp from "../../../components/bookingViewComp";
import { useEffect, useState } from "react";
import { getById } from "../../../services/booking";
import { openNotification } from "../../../network/notification";
import { useParams } from "react-router-dom";

const BookingView = () => {
    const [bookingData, setBookingData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await getById(id);
                setBookingData(res.data?.data || res.data);
            } catch {
                openNotification("error", "Failed to load booking details");
            }
        })();
    }, [id]);

    if (!bookingData) return <div className="p-10 text-center font-medium text-gray-500">Loading...</div>;

    const b = bookingData;

    // ── Guest Info ────────────────────────────────────────────────
    const guestInfo = [
        { label: "Name",            value: b.guestName  || b.guestInfo?.name  || "-" },
        { label: "Phone Number",    value: b.guestPhone || b.guestInfo?.phone || "-" },
        { label: "Email",           value: b.guestEmail || b.guestInfo?.email || "-" },
        { label: "ID Card",         value: b.guestInfo?.idCard || b.guestIdCard || "-" },
        { label: "Document Type",   value: b.guestInfo?.documentType  || b.documentType  || "-" },
        { label: "Document Number", value: b.guestInfo?.documentNumber || b.documentNumber || "-" },
    ];

    // ── Stay Details ──────────────────────────────────────────────
    const isApartment = b.isApartment || b.bookingType === "apartment";
    const isHostel = b.isHostel === true;

    // Label helper
    const entityLabel = isApartment ? "Apartment" : isHostel ? "Hostel" : "Room";
    const numberLabel = isApartment ? "Apartment Number" : isHostel ? "Hostel Number" : "Room Number";
    const hotelLabel = isApartment ? "Hotel Name" : isHostel ? "Hostel Name" : "Hotel Name";
    const typeLabel = isApartment ? "Apartment Type" : isHostel ? "Hostel Type" : "Room Type";

    const adults = b.adults || b.stayDetails?.adults || 0;
    const children = b.children || b.stayDetails?.children || 0;
    const infants = b.infants || b.stayDetails?.infants || 0;
    const totalMembers = adults + children + infants;
    const membersStr = totalMembers > 0
        ? `${totalMembers} (${adults} Adults${children > 0 ? `, ${children} Children` : ""}${infants > 0 ? `, ${infants} Infants` : ""})`
        : "-";

    const stayDetails = [
        {
            label: entityLabel,
            value: b.room?.roomName || b.stayDetails?.roomName || b.entityName || "-",
        },
        {
            label: numberLabel,
            value: b.roomNumber || b.room?.roomNumber || b.stayDetails?.roomNumber || "-",
        },
        { label: hotelLabel, value: b.hotelName || b.hotel?.name || b.stayDetails?.hotelName || "-" },
        { label: typeLabel, value: b.roomType || b.room?.roomType || "-" },
        { label: "Total Members", value: membersStr },
        { label: "Check-in Date", value: b.checkIn || b.stayDetails?.checkIn || "-" },
        { label: "Check-out Date", value: b.checkOut || b.stayDetails?.checkOut || "-" },
        { label: "Duration", value: b.duration || b.stayDetails?.totalNights || "-" },
    ];

    // ── Payment Summary ───────────────────────────────────────────
    const fmt = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? "0.00" : n.toFixed(2);
    };

    const roomCharges = b.paymentSummary?.pricePerNight
        ?? (parseFloat(b.pricePerNight || 0) * parseFloat(b.duration || 1));

    const paymentSummary = [
        { label: "Room Charges", value: `PKR ${fmt(roomCharges)}`, type: "default" },
        { label: "Taxes & Service Fees", value: `PKR ${fmt(b.paymentSummary?.taxes ?? b.taxes)}`, type: "default" },
        { label: "Discount", value: `PKR ${fmt(b.paymentSummary?.discount ?? b.discount ?? 0)}`, type: "default" },
        { label: "Total Amount", value: `PKR ${fmt(b.paymentSummary?.totalAmount ?? b.totalPrice)}`, type: "total" },
        { label: "Paid Amount", value: `PKR ${fmt(b.paymentSummary?.paidAmount ?? b.paidAmount)}`, type: "paid" },
        { label: "Remaining Balance", value: `PKR ${fmt(b.paymentSummary?.remainingBalance ?? b.remainingBalance)}`, type: "default" },
    ];

    return (
        <BookingComp
            guestInfo={guestInfo}
            stayDetails={stayDetails}
            paymentSummary={paymentSummary}
            status={b.status}
            bookingId={b.bookingId}
            ids={id}
        />
    );
};

export default BookingView;
