import leftangle from "../../assets/icons/leftangle.png";
import { ChevronDown, Info, Eye } from "lucide-react";
import selection from "../../assets/icons/selection.png";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import tablecalender from "../../assets/icons/calendarIcon.png";
import { createBooking, getById, updateBooking } from "../../services/booking";
import { getAllRooms } from "../../services/rooms";
import { openNotification } from "../../network/notification";
import { Select } from "antd";
import SuccessModal from "../../components/shared/successModal";
import { getAllApartment } from "../../services/apartment";
import phone from "../../assets/icons/phone.png";
import inbox from "../../assets/icons/inbox.png";

const { Option } = Select;

const inputCls = "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-dark text-sm font-medium outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300 h-[46px]";
const labelCls = "text-[#6C7293] text-xs font-semibold mb-1 block";
const sectionCls = "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm";

const SelectWrap = ({ children, className = "" }) => (
  <div className={`w-full border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`} style={{ height: 46 }}>
    {children}
  </div>
);

const RadioBtn = ({ name, value, label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative flex items-center justify-center">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
        className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-blue transition-all" />
      <div className="absolute w-2 h-2 rounded-full bg-blue scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
    </div>
    <span className="text-dark text-sm font-medium">{label}</span>
  </label>
);

const BOOKING_STATUSES = [
  { value: "Booked", label: "Booked" },
  { value: "Checked-In", label: "Check In" },
  { value: "Checked-Out", label: "Check Out" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancel" },
];

const BookingAddComp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromTab = location.state?.fromTab;
  const backUrl = fromTab === "Apartment Bookings" ? "/admin/bookings?tab=apartment" : "/admin/bookings?tab=room";
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [apartment, setApartment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [pendingCheckInDoc, setPendingCheckInDoc] = useState({ documentType: "CNIC", documentNumber: "" });

  const [formData, setFormData] = useState({
    bookingType: "Room",
    guestName: "", phone: "", email: "", cnic: "",
    documentType: "CNIC", documentNumber: "",
    hotelId: "", hotelName: "",
    roomId: "", apartmentId: "",
    roomType: "", roomNumber: "",
    apartmentName: "", apartmentNumber: "",
    numGuests: "01 Adult",
    checkIn: "", checkOut: "", duration: 0,
    pricePerNight: 0, taxes: 10, discount: 0,
    paymentMethod: "Cash", status: "Booked",
    isApartment: false, infants: 0,
  });

  const [hostData, setHostData] = useState({
    name: "Ali Raza Hussain", role: "Superhost",
    profileImg: "https://via.placeholder.com/150",
    phone: "+92 331 672 5657579", email: "aliraza03@gmail.com",
  });

  useEffect(() => {
    if (!isEditMode) return;
    const fetchBookingById = async () => {
      try {
        const res = await getById(id);
        const booking = res?.data?.data || res?.data;
        if (!booking) return;

        const isApt = booking.isApartment || booking.bookingType === "apartment";

        const rawDuration = booking.stayDetails?.totalNights || booking.duration || 0;
        const duration = typeof rawDuration === "string"
          ? parseInt(rawDuration.replace(/\D/g, ""), 10) || 0
          : Number(rawDuration) || 0;

        const hotelName = isApt
          ? (booking.apartment?.apartmentName || booking.apartmentName || "")
          : (booking.hotel?.name || booking.hotelName || booking.stayDetails?.hotelName || "");

        const roomNumber = isApt
          ? (booking.apartment?.apartmentNumber || booking.stayDetails?.roomNumber || "")
          : (booking.room?.roomNumber || booking.stayDetails?.roomNumber || booking.roomNumber || "");

        const roomType = isApt
          ? (booking.apartment?.apartmentName || "")
          : (booking.room?.roomType || booking.roomType || "");

        const pricePerNight = Number(booking.paymentSummary?.pricePerNight || booking.pricePerNight || 0);
        const taxes = Number(booking.paymentSummary?.taxes || booking.taxes || 0);
        const discount = Number(booking.paymentSummary?.discount || booking.discount || 0);

        const adults = booking.stayDetails?.adults || booking.adults || 1;
        const numGuests = `${String(adults).padStart(2, "0")} Adult${adults > 1 ? "s" : ""}`;

        if (isApt && booking.apartment) {
          const apt = booking.apartment;
          const hostUser = apt.host;
          const hostInfo = apt.hostInfo;
          setHostData({
            name: hostUser?.name || hostInfo?.name || "No Host Assigned",
            role: "Superhost",
            profileImg: hostUser?.profileImage || hostInfo?.image || "https://via.placeholder.com/150",
            phone: hostUser?.phone || hostInfo?.phone || "N/A",
            email: hostUser?.email || hostInfo?.email || "N/A",
          });
        }

        setFormData((prev) => ({
          ...prev,
          bookingType: isApt ? "Apartment" : "Room",
          guestName: booking.guestInfo?.name || booking.guestName || "",
          phone: booking.guestInfo?.phone || booking.guestPhone || booking.phone || "",
          email: booking.guestInfo?.email || booking.guestEmail || booking.email || "",
          cnic: booking.guestInfo?.idCard || booking.cnic || "",
          documentType: booking.guestInfo?.documentType || booking.documentType || "CNIC",
          documentNumber: booking.guestInfo?.documentNumber || booking.documentNumber || "",
          hotelId: booking.hotel?.id || booking.hotelId || "",
          hotelName,
          roomId: booking.room?.id || booking.roomId || "",
          apartmentId: booking.apartment?.id || booking.apartmentId || "",
          roomType,
          roomNumber,
          apartmentName: isApt ? hotelName : "",
          apartmentNumber: isApt ? roomNumber : "",
          numGuests,
          infants: booking.stayDetails?.infants || booking.infants || 0,
          checkIn: booking.stayDetails?.checkIn || booking.checkIn || "",
          checkOut: booking.stayDetails?.checkOut || booking.checkOut || "",
          duration,
          pricePerNight,
          taxes,
          discount,
          paymentMethod: booking.paymentMethod || "Cash",
          status: booking.status || "Booked",
        }));
      } catch (err) {
        console.error(err);
        openNotification("error", "Failed to fetch booking");
      }
    };
    fetchBookingById();
  }, [id, isEditMode]);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await getAllRooms(); setRooms(Array.isArray(res.data) ? res.data : res.data?.data || []); }
      catch { openNotification("error", "Failed to load rooms"); }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await getAllApartment(); setApartment(Array.isArray(res.data) ? res.data : res.data?.data || []); }
      catch { openNotification("error", "Failed to load apartments"); }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isApartment = formData.bookingType === "Apartment";
    if (name === "bookingType") {
      setFormData((prev) => ({ ...prev, bookingType: value, hotelName: "", hotelId: "", roomId: "", apartmentId: "", roomType: "", roomNumber: "", apartmentName: "", apartmentNumber: "", pricePerNight: 0 }));
      return;
    }
    if (name === "status" && value === "Checked-In") {
      setPendingCheckInDoc({ documentType: formData.documentType || "CNIC", documentNumber: formData.documentNumber || "" });
      setShowCheckInModal(true);
      return;
    }
    if (name === "hotelName") {
      const src = isApartment ? apartment : rooms;
      const obj = src.find((item) => isApartment ? item.apartmentName === value : item.hotel?.name === value);
      if (obj) setHostData({ name: obj.host?.name || "No Host Assigned", role: "Superhost", profileImg: obj.host?.image || "https://via.placeholder.com/150", phone: obj.host?.phone || "N/A", email: obj.host?.email || "N/A" });
      setFormData((prev) => ({ ...prev, hotelName: !isApartment ? value : "", hotelId: obj?.hotelId || obj?.hotel?._id || obj?.hotel?.id || "", roomType: obj?.type || obj?.roomType?.title || "", pricePerNight: obj?.price || obj?.pricePerNight || 0, apartmentId: obj?.id || "", roomNumber: obj?.apartmentNumber || "", apartmentName: isApartment ? value : "" }));
      return;
    }
    if (name === "roomNumber") {
      const src = isApartment ? apartment : rooms;
      const obj = src.find((item) => isApartment ? item.apartmentNumber === value : item.roomNumber === value);
      setFormData((prev) => ({ ...prev, roomNumber: value, roomId: !isApartment ? obj?.id || "" : "", apartmentId: isApartment ? obj?.id || "" : "", pricePerNight: obj?.price || obj?.pricePerNight || 0 }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckInModalConfirm = () => {
    if (!pendingCheckInDoc.documentNumber.trim()) {
      openNotification("error", "Please enter document number");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      status: "Checked-In",
      documentType: pendingCheckInDoc.documentType,
      documentNumber: pendingCheckInDoc.documentNumber,
    }));
    setShowCheckInModal(false);
    setPendingCheckInDoc({ documentType: "CNIC", documentNumber: "" });
  };

  const getHotelOptions = () => {
    if (formData.bookingType === "Apartment") return [...new Set(apartment.map((a) => a.apartmentName).filter(Boolean))];
    return [...new Set(Array.isArray(rooms) ? rooms.map((r) => r.hotel?.name).filter(Boolean) : [])];
  };
  const getTypeOptions = () => {
    if (formData.bookingType === "Apartment") return [...new Set(apartment.map((a) => a.roomType?.title || "").filter(Boolean))];
    return [...new Set(rooms.map((r) => r.roomType?.title || r.roomType).filter(Boolean))];
  };
  const getNumberOptions = () => {
    if (formData.bookingType === "Apartment") return apartment.filter((a) => !formData.apartmentName || a.apartmentName === formData.apartmentName).map((a) => a.apartmentNumber);
    return rooms.filter((r) => !formData.roomType || r.roomType?.title === formData.roomType).map((r) => r.roomNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalPayload = { ...formData, isApartment: formData.bookingType === "Apartment" };
      const res = isEditMode ? await updateBooking(id, finalPayload) : await createBooking(finalPayload);
      if (res.status === 200 || res.status === 201) {
        openNotification("success", isEditMode ? "Booking updated!" : "Booking created!");
        setIsModalOpen(true);
      }
    } catch { openNotification("error", "Error saving booking"); }
    finally { setLoading(false); }
  };

  const isApt = formData.bookingType === "Apartment";
  const basePriceTotal = (Number(formData.duration) || 0) * (Number(formData.pricePerNight) || 0);
  const taxes = Number(formData.taxes) || 0;
  const discount = Number(formData.discount) || 0;
  const totalPayable = basePriceTotal + taxes - discount;
  const summaryName = isApt ? (formData.apartmentName || formData.hotelName || "Not Selected") : (formData.hotelName || "Not Selected");
  const summaryNumber = isApt ? formData.apartmentNumber : formData.roomNumber;

  return (
    <>
      <form onSubmit={handleSubmit}>

        {/* ── Header: Back + Title + View button (edit mode only) ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate(backUrl)} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
              <img src={leftangle} alt="back" className="w-3.5 h-3.5" /> Back
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <h3 className="font-bold text-gray-900 text-xl">
              {isEditMode ? "Edit Booking" : "Add New Booking"}
            </h3>
          </div>

          {/* View button — sirf edit mode mein dikhega */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => navigate(`/admin/booking/view/${id}`, { state: { fromTab } })}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
            >
              <Eye size={15} />
              View Booking
            </button>
          )}
        </div>

        {/* Booking Type */}
        <div className={`${sectionCls} mb-4`}>
          <div className="flex flex-wrap items-center gap-8">
            <span className="text-dark font-semibold text-sm">Select Booking Type</span>
            <div className="flex items-center gap-6">
              <RadioBtn name="bookingType" value="Room" label="Room Booking" checked={formData.bookingType === "Room"} onChange={(e) => handleChange({ target: { name: "bookingType", value: "Room" } })} />
              <RadioBtn name="bookingType" value="Apartment" label="Apartment Booking" checked={formData.bookingType === "Apartment"} onChange={(e) => handleChange({ target: { name: "bookingType", value: "Apartment" } })} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4">

            {/* Guest Information */}
            <div className={sectionCls}>
              <h3 className="font-bold text-gray-900 text-base mb-4">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Guest Full Name</label><input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required placeholder="Muhammad Ali Akbar" className={inputCls} /></div>
                <div><label className={labelCls}>Phone Number</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0331-6326593" className={inputCls} /></div>
                <div><label className={labelCls}>Email (Optional)</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="mail@example.com" className={inputCls} /></div>
                {/* <div><label className={labelCls}>CNIC</label><input type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="34502-23454565-9" className={inputCls} /></div> */}
                <div>
                  <label className={labelCls}>Document Type</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless" placeholder="Select Document Type"
                      value={formData.documentType}
                      onChange={(val) => handleChange({ target: { name: "documentType", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />}>
                      <Option value="CNIC">CNIC</Option>
                      <Option value="Passport">Passport</Option>
                    </Select>
                  </SelectWrap>
                </div>
                <div><label className={labelCls}>Document Number</label><input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder={formData.documentType === "CNIC" ? "42101-1234567-1" : "Enter document number"} className={inputCls} /></div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Max Infants</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless" placeholder="Select max infants"
                      value={formData.infants !== undefined ? formData.infants : undefined}
                      onChange={(val) => handleChange({ target: { name: "infants", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />}>
                      {[0, 1, 2, 3, 4, 5, 6].map(v => <Option key={v} value={v}>{v} Infant{v !== 1 ? "s" : ""}</Option>)}
                    </Select>
                  </SelectWrap>
                </div>
              </div>
            </div>

            {/* Room / Apartment Selection */}
            <div className={sectionCls}>
              <h3 className="font-bold text-gray-900 text-base mb-4">{isApt ? "Apartment Selection" : "Room Selection"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{isApt ? "Apartment Name" : "Hotel Name"}</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless"
                      placeholder={isApt ? "Select Apartment" : "Select Hotel"}
                      value={(isApt ? formData.apartmentName : formData.hotelName) || undefined}
                      onChange={(val) => handleChange({ target: { name: "hotelName", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />} showSearch>
                      {getHotelOptions().map((name, i) => <Option key={i} value={name}>{name}</Option>)}
                    </Select>
                  </SelectWrap>
                </div>
                <div>
                  <label className={labelCls}>{isApt ? "Apartment Type" : "Select Room Type"}</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless" placeholder="Select Type"
                      value={formData.roomType || undefined}
                      onChange={(val) => handleChange({ target: { name: "roomType", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />} showSearch>
                      {getTypeOptions().map((type, i) => <Option key={i} value={type}>{type === "false" ? "Standard" : type}</Option>)}
                    </Select>
                  </SelectWrap>
                </div>
                <div>
                  <label className={labelCls}>{isApt ? "Apartment Number" : "Room Number"}</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless"
                      placeholder={isApt ? "Select Apartment No." : "Select Room No."}
                      value={(isApt ? formData.apartmentNumber : formData.roomNumber) || undefined}
                      onChange={(val) => handleChange({ target: { name: "roomNumber", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />} showSearch>
                      {getNumberOptions().map((num, i) => <Option key={i} value={num}>{num}</Option>)}
                    </Select>
                  </SelectWrap>
                </div>
                <div>
                  <label className={labelCls}>Number of Guests</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless" placeholder="Select Guests"
                      value={formData.numGuests || undefined}
                      onChange={(val) => handleChange({ target: { name: "numGuests", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />} showSearch>
                      <Option value="01 Adult">01 Adult</Option>
                      <Option value="02 Adults">02 Adults</Option>
                      <Option value="03 Adults">03 Adults</Option>
                    </Select>
                  </SelectWrap>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className={sectionCls}>
              <h3 className="font-bold text-gray-900 text-base mb-4">Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Checked in Date</label>
                  <div className="relative"><img src={tablecalender} alt="cal" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10" /><input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className={inputCls} /></div>
                </div>
                <div>
                  <label className={labelCls}>Checked out Date</label>
                  <div className="relative"><img src={tablecalender} alt="cal" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10" /><input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Total Nights</label><input type="number" name="duration" value={formData.duration} onChange={handleChange} required placeholder="1" className={inputCls} /></div>
              </div>
            </div>

            {/* Pricing & Payment */}
            <div className={sectionCls}>
              <h3 className="font-bold text-gray-900 text-base mb-4">Pricing & Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Price per Night</label><input type="number" readOnly name="pricePerNight" value={formData.pricePerNight} placeholder="Auto-filled" className={`${inputCls} bg-gray-50 cursor-not-allowed`} /></div>
                <div><label className={labelCls}>Taxes & Fee</label><input type="number" name="taxes" value={formData.taxes} onChange={handleChange} className={inputCls} /></div>
                <div><label className={labelCls}>Discount</label><input type="number" name="discount" value={formData.discount} onChange={handleChange} className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Payment Method</label>
                  <SelectWrap>
                    <Select className="w-full h-full" variant="borderless" placeholder="Select Payment Method"
                      value={formData.paymentMethod || undefined}
                      onChange={(val) => handleChange({ target: { name: "paymentMethod", value: val } })}
                      suffixIcon={<ChevronDown size={16} className="text-gray-400" />}>
                      <Option value="Card">Credit Card</Option>
                      <Option value="Bank">Bank</Option>
                      <Option value="Cash">Cash</Option>
                    </Select>
                  </SelectWrap>
                </div>
              </div>
            </div>

            {/* ── Booking Status — all 5 ── */}
            <div className={sectionCls}>
              <h3 className="font-bold text-gray-900 text-base mb-4">Booking Status</h3>
              <div className="flex flex-col gap-3">
                <span className="text-dark font-semibold text-sm">Set Booking Status</span>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {BOOKING_STATUSES.map((s) => (
                    <RadioBtn key={s.value} name="status" value={s.value} label={s.label}
                      checked={formData.status === s.value} onChange={handleChange} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#EDFDF2] border border-[#107326] rounded-2xl p-5">
              <h3 className="text-[#107326] font-bold text-base mb-4 pb-3 border-b border-[#107326]/20">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold mb-0.5">{isApt ? "Apartment Selected" : "Room Selected"}</p>
                    <p className="text-dark font-bold text-sm">{summaryName} {summaryNumber && <span className="text-gray-500 font-normal">#{summaryNumber}</span>}</p>
                  </div>
                  <img src={selection} alt="" className="mt-1 w-5 h-5" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold mb-0.5">Stay Duration</p>
                    <p className="text-dark text-sm font-medium">{formData.checkIn || "Start Date"} – {formData.checkOut || "End Date"}</p>
                  </div>
                  <span className="text-dark font-bold text-sm">{formData.duration || 0} Nights</span>
                </div>
                <div className="border-t border-[#107326]/20 pt-3 space-y-2">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Pricing Breakdown</p>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Base Price {formData.duration}n (${Number(formData.pricePerNight).toFixed(2)} × {formData.duration})</span><span className="font-bold text-dark">${basePriceTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Taxes & Service Fees</span><span className="font-bold text-dark">${taxes.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Discount</span><span className="font-bold text-red">-${discount.toFixed(2)}</span></div>
                </div>
                <div className="border-t border-[#107326]/20 pt-3 space-y-2.5">
                  <div className="flex justify-between items-center"><span className="font-bold text-dark text-sm">Total Payable</span><span className="text-xl font-bold text-blue">${totalPayable.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-600 text-sm">Amount Paid</span><span className="font-bold text-dark text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white">${totalPayable.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-600 text-sm">Remaining Balance</span><span className="font-bold text-dark text-sm">$0.00</span></div>
                </div>
                <div className="flex gap-2 text-xs text-gray-400 pt-1">
                  <Info size={14} className="text-[#48BB78] shrink-0 mt-0.5" />
                  <p>{isApt ? "Apartment" : "Room"} availability is checked automatically upon selection. Price estimates include regional stay taxes.</p>
                </div>
              </div>
            </div>

            {isApt && (
              <div className={sectionCls}>
                <h3 className="text-mainPrimary font-bold text-base mb-4">Host Details</h3>
                <div className="flex items-center gap-4">
                  <img src={hostData.profileImg} alt={hostData.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }} />
                  <div>
                    <p className="font-bold text-dark text-sm">{hostData.name}</p>
                    <p className="text-gray-400 text-xs mb-3">{hostData.role}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1.5"><img src={phone} alt="phone" className="w-4 h-4" />{hostData.phone}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-700"><img src={inbox} alt="email" className="w-4 h-4" />{hostData.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(backUrl)}
            className="px-8 py-2.5 min-w-[140px] border border-gray-200 bg-white text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 min-w-[140px] border border-transparent bg-mainPrimary text-white rounded-lg text-sm font-semibold hover:bg-mainPrimaryHover transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save Booking"}
          </button>
        </div> */}
<div className="flex justify-end gap-3 mt-6">
  <button
    type="button"
    onClick={() => navigate(backUrl)}
    className="w-[140px] py-2.5 border border-gray-200 bg-white text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
  >
    Back
  </button>
  <button
    type="submit"
    disabled={loading}
    className="w-[140px] h-11 mt-[10px] border border-transparent bg-mainPrimary text-white rounded-lg text-sm font-semibold hover:bg-mainPrimaryHover transition-all disabled:opacity-50"
  >
    {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save Booking"}
  </button>
</div>
      </form>

      {isModalOpen && (
        <SuccessModal open onClose={() => navigate(backUrl)}
          title={isEditMode ? "Booking Updated Successfully!" : "Booking Saved Successfully!"}
          description="The booking has been saved successfully."
          showButton buttonText="View Bookings" onButtonClick={() => navigate(backUrl)} />
      )}

      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Guest Verification</h3>
            <p className="text-sm text-gray-500 mb-6">Enter guest document details to complete check-in.</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Document Type</label>
                <SelectWrap>
                  <Select className="w-full h-full" variant="borderless"
                    value={pendingCheckInDoc.documentType}
                    onChange={(val) => setPendingCheckInDoc((p) => ({ ...p, documentType: val }))}
                    options={[
                      { label: "CNIC", value: "CNIC" },
                      { label: "Passport", value: "Passport" },
                      { label: "Driving License", value: "Driving License" },
                    ]}
                  />
                </SelectWrap>
              </div>
              <div>
                <label className={labelCls}>Document Number</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder={pendingCheckInDoc.documentType === "CNIC" ? "e.g. 42101-1234567-1" : "Enter number"}
                  value={pendingCheckInDoc.documentNumber}
                  onChange={(e) => setPendingCheckInDoc((p) => ({ ...p, documentNumber: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckInModalConfirm()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowCheckInModal(false); setPendingCheckInDoc({ documentType: "CNIC", documentNumber: "" }); }}
                className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckInModalConfirm}
                disabled={!pendingCheckInDoc.documentNumber.trim()}
                className="px-6 py-2 bg-blue text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingAddComp;