import leftangle from "../../../assets/icons/leftangle.png";
import BookingComp from "../../../components/bookingViewComp";
import { useEffect, useState } from "react";
import { getById , updateStats} from "../../../services/booking";
import { openNotification } from "../../../network/notification";
import { useParams, useNavigate } from "react-router-dom";

const BoookingView = () => {
    const [bookingData, setBookingData] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await getById(id);
                console.log(res.data, "data from API");
                setBookingData(res.data);
            } catch (err) {
                console.error("Failed to load booking details:", err);
                openNotification("error", "Failed to load booking details");
            }
        };

        if (id) fetchBookingDetails();
    }, [id]);


    // Agar data abhi load ho raha hai toh loader ya empty return karein
    if (!bookingData) return <div className="p-10 text-center">Loading...</div>;

    // --- API Data Mapping ---
    const ids = bookingData;
    console.log(ids, "idsids")
    // 1. Guest Information Mapping
    const info = [
        { label: "Name", value: bookingData.guestInfo?.name || "-" },
        { label: "Phone Number", value: bookingData.guestInfo?.phone || "-" },
        { label: "Email", value: bookingData.guestInfo?.email || "-" },
        { label: "ID Card Number", value: bookingData.guestInfo?.idCard || "-" },
    ];

    // 2. Stay Details Mapping
   const isApartment = bookingData?.stayDetails?.isApartment;

const Stay_Details = [
  {
    label: isApartment ? "Apartment" : "Room",
    value: bookingData.stayDetails?.roomName || "-",
  },
  {
    label: isApartment ? "Apartment Number" : "Room Number",
    value: bookingData.stayDetails?.roomNumber || "-",
  },
  
  {
    label: "Total Members",
    value: bookingData.stayDetails?.totalMembers || "-",
  },
  {
    label: "Hotel Name",
    value: bookingData.stayDetails?.hotelName || "-",
  },
  ...(isApartment
    ? [
        {
          label: "Apartment Type",
          value: bookingData?.bedType || "-",
        },
      ]
    : []),
  {
    label: "Check-in Date",
    value: bookingData.stayDetails?.checkIn || "-",
  },
  {
    label: "Check-out Date",
    value: bookingData.stayDetails?.checkOut || "-",
  },
  {
    label: "Total Nights",
    value: bookingData.stayDetails?.totalNights || "-",
  },
];


    // 3. Payment Summary Mapping
    // Note: NaN values ko handle karne ke liye check lagaya hai
    const formatCurrency = (val) => (isNaN(val) || val === "NaN" ? "0.00" : val);

    const Payment_Summary = [
        {
            label: "Room Charges",
            value: `$${formatCurrency(bookingData.paymentSummary?.roomCharges)}`,
            type: "default"
        },
        {
            label: "Taxes & Service Fees",
            value: `$${formatCurrency(bookingData.paymentSummary?.taxes)}`,
            type: "default"
        },
        {
            label: "Total Amount",
            value: `$${formatCurrency(bookingData.paymentSummary?.totalAmount)}`,
            type: "total"
        },
        {
            label: "Paid Amount",
            value: `$${formatCurrency(bookingData.paymentSummary?.paidAmount)}`,
            type: "paid"
        },
        {
            label: "Remaining Balance",
            value: `$${formatCurrency(bookingData.paymentSummary?.remainingBalance)}`,
            type: "default"
        },
    ];
    return (
        <>
            <BookingComp
                guestInfo={info}
                stayDetails={Stay_Details}
                paymentSummary={Payment_Summary}
                status={bookingData.status}
                bookingId={bookingData.bookingId}
                ids={id}
            />
        </>
    );
}

export default BoookingView;