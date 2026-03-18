import leftangle from "../../assets/icons/leftangle.png";
import { ChevronDown, Info } from "lucide-react";
import selection from "../../assets/icons/selection.png";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import calenderIcon from "../../assets/icons/calendarIcon.png";
import { createBooking, getById, updateBooking } from "../../services/booking";
import { getAllRooms } from "../../services/rooms";
import { openNotification } from "../../network/notification";
import { updateStats } from "../../services/booking";
import tablecalender from "../../assets/icons/calendarIcon.png";
import { Select } from "antd";
import SuccessModal from "../../components/shared/successModal";
import { Phone, Mail } from "lucide-react";
import inbox from "../../assets/icons/inbox.png";
import { getAllApartment } from "../../services/apartment";
import phone from "../../assets/icons/phone.png";

const BookingAddComp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [ids, setids] = useState();
  const { Option } = Select;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apartment, setApartment] = useState([]);

  // Calculations

  const [formData, setFormData] = useState({
    bookingType: "Room",
    guestName: "",
    phone: "",
    email: "",
    cnic: "",

    hotelId: "",
    hotelName: "",

    roomId: "",
    apartmentId: "",

    roomType: "",
    roomNumber: "",

    apartmentName: "",
    apartmentNumber: "",

    numGuests: "01 Adult",
    checkIn: "",
    checkOut: "",
    duration: 0,
    pricePerNight: 0,
    taxes: 10, // Hardcoded Tax
    discount: 5, // Hardcoded Discount
    paymentMethod: "Bank",
    status: "Checked-In",
    isApartment: false,
    infants: 0,
  });

  const [hostData, setHostData] = useState({
    name: "Ali Raza Hussain",
    role: "Superhost",
    profileImg: "https://via.placeholder.com/150", // Aapki image ka path
    phone: "+92 331 672 5657579",
    email: "aliraza03@gmail.com",
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchBookingById = async () => {
      try {
        const res = await getById(id);
        const booking = res?.data?.data || res?.data;

        console.log(booking, "Fetched Booking");

        if (booking) {
          setFormData((prev) => ({
            ...prev,

            bookingType: booking.isApartment ? "Apartment" : "Room",

            guestName: booking.guestInfo?.name || "",
            phone: booking.phone || booking.guestInfo?.phone || "",
            email: booking.email || booking.guestInfo?.email || "",
            cnic: booking.cnic || "",

            hotelName: booking.hotelName || booking.stayDetails?.hotelName || "",
            hotelId: booking.hotelId || "",

            roomId: booking.roomId || "",
            apartmentId: booking.apartmentId || "",

            roomType: booking.roomType || "",
            roomNumber: booking.roomNumber || booking.stayDetails?.roomNumber || "",

            apartmentName: booking.apartmentName || "",
            apartmentNumber: booking.apartmentNumber || "",

            numGuests: booking.numGuests || booking.stayDetails?.adults || "01 Adult",
            infants: booking.infants || booking.stayDetails?.infants || 0,

            checkIn: booking.checkIn || booking.stayDetails?.checkIn || "",
            checkOut: booking.checkOut || booking.stayDetails?.checkOut || "",
            duration: booking.duration || booking.stayDetails?.totalNights || 0,

            pricePerNight: booking.pricePerNight || booking.paymentSummary?.pricePerNight || 0,

            taxes: booking.taxes || booking.paymentSummary?.taxes || 10,
            discount: booking.discount || booking.paymentSummary?.discount || 5,

            paymentMethod: booking.paymentMethod || "Bank",
            status: booking.status || "Checked-In",
          }));
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        openNotification("error", "Failed to fetch booking");
      }
    };

    fetchBookingById();
  }, [id, isEditMode]);

  const handleRoomSelect = (roomId) => {
    // Farz karein 'rooms' aapki wo list hai jo API se aayi hai
    const selectedObj =
      rooms.find((item) => item.id === roomId) ||
      apartment.find((item) => item.id === roomId);

    setFormData((prev) => ({
      ...prev,
      roomType: roomId, // ya jo bhi key aap save kar rahe hain
      pricePerNight: selectedObj ? selectedObj.price : 0,
    }));
  };
  // const handleStatusUpdate = async (newStatus) => {
  //     setLoading(true);
  //     try {
  //         // ids yahan parent se aa rahi hai jo booking ki mongoDB id hai
  //         const res = await updateStats(ids, { status: newStatus });

  //         if (res.status === 200 || res.status === 201) {
  //             openNotification("success", `Booking status updated to ${newStatus}`);
  //             // Status update hone ke baad page refresh ya navigate kar sakte hain
  //             window.location.reload();
  //         }
  //     } catch (err) {
  //         console.error("Failed to update status:", err);
  //         openNotification("error", "Failed to update booking status");
  //     } finally {
  //         setLoading(false);
  //     }
  // };
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getAllRooms();
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setRooms(data);
        console.log(data, "Rooms");

      } catch (err) {
        console.error("Error fetching rooms:", err);
        openNotification("error", "Failed to load rooms");
      }
    };
    fetchRooms();
  }, []);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getAllApartment();
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setApartment(data);
        console.log(res.data, "Apartment");
      } catch (err) {
        console.error("Error fetching rooms:", err);
        openNotification("error", "Failed to load rooms");
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isApartment = formData.bookingType === "Apartment";

    // BOOKING TYPE CHANGE
    if (name === "bookingType") {
      setFormData((prev) => ({
        ...prev,
        bookingType: value,
        hotelName: "",
        hotelId: "",
        roomId: "",
        apartmentId: "",
        roomType: "",
        roomNumber: "",
        pricePerNight: 0,
      }));
      return;
    }
    console.log(name, "this is a name");
    // HOTEL / APARTMENT NAME
    if (name === "hotelName") {
      const dataSource = isApartment ? apartment : rooms;

      const selectedObj = dataSource.find((item) =>
        isApartment ? item.apartmentName === value : item.hotel?.name === value,
      );
      if (selectedObj) {
        // Update Host Data Dynamically from API
        setHostData({
          name: selectedObj.host?.name || "No Host Assigned",
          role: "Superhost", // Agar API mein role nahi hai to static rakh sakte hain
          profileImg:
            selectedObj.host?.image || "https://via.placeholder.com/150",
          phone: selectedObj.host?.phone || "N/A",
          email: selectedObj.host?.email || "N/A",
        });
      }
      setFormData((prev) => ({
        ...prev,
        hotelName: !isApartment ? value : "",
        hotelId: selectedObj?.hotelId || selectedObj?.hotel?._id || selectedObj?.hotel?.id || "",
        roomType: selectedObj?.type || selectedObj?.roomType.title || "",
        pricePerNight: selectedObj?.price || selectedObj?.pricePerNight || 0,
        // roomId: selectedObj?.id || "",
        apartmentId: selectedObj?.id || "",
        roomNumber: selectedObj?.apartmentNumber || "",
        apartmentName: isApartment ? value : "",



      }));
      console.log(selectedObj, "selected Object for Hotel/Apartment");
      console.log(value, "selected value for Hotel/Apartment");

      return;
    }

    // ROOM / APARTMENT NUMBER
    if (name === "roomNumber") {
      const dataSource = isApartment ? apartment : rooms;

      const selectedObj = dataSource.find((item) =>
        isApartment
          ? item.apartmentNumber === value
          : item.roomNumber === value,
      );
      console.log(selectedObj, "selected");
      setFormData((prev) => ({
        ...prev,
        roomNumber: value,
        roomId: !isApartment ? selectedObj?.id || "" : "",
        apartmentId: isApartment ? selectedObj?.id || "" : "",
        pricePerNight: selectedObj?.price || selectedObj?.pricePerNight || 0,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getHotelOptions = () => {
    if (formData.bookingType === "Apartment") {
      return [...new Set(apartment.map((a) => a.apartmentName))];
    }
    return [
      ...new Set(
        Array.isArray(rooms)
          ? rooms.map((r) => r.hotel?.name)
          : []
      ),
    ];
  };
  const abc = getHotelOptions()
  console.log(abc, "this is hotel options");


  const getTypeOptions = () => {
    if (formData.bookingType === "Apartment") {
      return [...new Set(apartment.map((a) => a.roomType?.title || a.data?.roomType.title))];
    }
    return [...new Set(rooms.map((r) => r.roomType?.title || r.roomType))];
  };

  const getNumberOptions = () => {
    if (formData.bookingType === "Apartment") {
      // Filter based on selected apartment name
      return apartment
        .filter(
          (a) => !formData.hotelName || a.apartmentName === formData.hotelName,
        )
        .map((a) => a.apartmentNumber);
    }
    return rooms
      .filter((r) => !formData.roomType || r.roomType?.title === formData.roomType)
      .map((r) => r.roomNumber);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const finalPayload = {
  //       ...formData,
  //       isApartment: formData.bookingType === "Apartment",
  //     };

  //     console.log("Final Payload:", finalPayload);

  //     const res = await createBooking(finalPayload);

  //     if (res.status === 200 || res.status === 201) {
  //       openNotification("success", "Booking saved successfully!");
  //       setIsModalOpen(true);
  //     }
  //   } catch (err) {
  //     openNotification("error", "Error saving booking");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalPayload = {
        ...formData,
        isApartment: formData.bookingType === "Apartment",
      };

      console.log("Final Payload:", finalPayload);

      let res;

      if (isEditMode) {
        // ✅ UPDATE
        res = await updateBooking(id, finalPayload);
      } else {
        // ✅ CREATE
        res = await createBooking(finalPayload);
      }

      if (res.status === 200 || res.status === 201) {
        openNotification(
          "success",
          isEditMode
            ? "Booking updated successfully!"
            : "Booking created successfully!"
        );
        setIsModalOpen(true);
      }
    } catch (err) {
      openNotification("error", "Error saving booking");
    } finally {
      setLoading(false);
    }
  };
  const basePriceTotal =
    (Number(formData.duration) || 0) * (Number(formData.pricePerNight) || 0);
  const taxes = Number(formData.taxes) || 0;
  const discount = Number(formData.discount) || 0;
  const totalPayable = basePriceTotal + taxes - discount;
  const amountPaid = totalPayable; // As per your requirement
  const remainingBalance = 0; // Hardcoded as per your requirement

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 items-center gap-4">
          <img
            src={leftangle}
            alt=""
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600 flex font-medium"
          >
            Back
          </button>
        </div>

        <h3 className="font-semibold pb-2 px-3 text-lg">
          {" "}
          {isEditMode ? "Edit Booking" : "Add New Booking"}
        </h3>

        <div className="bg-white w-full border border-gray-100 rounded-[24px] p-6 shadow-sm mt-6 m-0 mb-2">
          <div className="flex flex-wrap items-center gap-12 py-2">
            <span className="text-dark font-semibold text-15">
              Select Booking Type
            </span>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="bookingType" // Same Name
                    value="Room"
                    checked={formData.bookingType === "Room"}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "bookingType", value: "Room" },
                      })
                    }
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all"
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-blue scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                </div>
                <span className="text-dark font-medium text-15">
                  Room Booking
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="bookingType" // Same Name
                    value="Apartment"
                    checked={formData.bookingType === "Apartment"}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "bookingType", value: "Apartment" },
                      })
                    }
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all"
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-blue scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                </div>
                <span className="text-dark font-medium text-15">
                  Appartment Booking
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl m-0 shadow-md min-h-screen p-4 md:p-8 w-full">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Section 1: Guest Information */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Guest Full Name
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      required
                      placeholder="Enter full Name"
                      className="w-full bg-white border-2 border-lightSeconday rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter Number"
                      className="w-full bg-white border-2 border-lightSeconday rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full bg-white border-2 border-lightSeconday rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleChange}
                      required
                      placeholder="Enter CNIC"
                      className="w-full bg-white border-2 border-lightSeconday rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                </div>


                <div className="flex flex-col">
                  <label className="text-lightSeconday text-13 font-bold ml-1">
                    {/* {formData.bookingType === "Apartment"
                        ? "Apartment Name"
                        : "Hotel Name"} */} Maxinfants
                  </label>
                  <Select
                    className="w-full h-12 border border-lightSeconday rounded-lg font-medium"
                    placeholder={"Select maxinfants"}
                    value={formData.infants || undefined}
                    onChange={(val) =>
                      handleChange({
                        target: { name: "infants", value: val },
                      })
                    }
                    suffixIcon={
                      <ChevronDown size={18} className="text-gray-400" />
                    }
                  >
                    <Option value={0}>
                      0 Maxinfants
                    </Option>
                    <Option value={1}>
                      1 Maxinfants
                    </Option>
                    <Option value={2}>
                      2 Maxinfants
                    </Option>
                    <Option value={3}>
                      3 Maxinfants
                    </Option>
                    <Option value={4}>
                      4 Maxinfants
                    </Option>
                    <Option value={5}>
                      5 Maxinfants
                    </Option>
                    <Option value={6}>
                      6 Maxinfants
                    </Option>

                  </Select>
                </div>
              </div>

              {/* Section 2: Room Selection */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <h3 className="text-dark font-bold text-lg mb-6 pb-2 border-b border-gray-100">
                  {formData.bookingType === "Apartment"
                    ? "Apartment Selection"
                    : "Room Selection"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Hotel Name Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      {formData.bookingType === "Apartment"
                        ? "Apartment Name"
                        : "Hotel Name"}
                    </label>
                    <Select
                      className="w-full h-12 border border-lightSeconday rounded-lg font-medium"
                      placeholder={
                        formData.bookingType === "Apartment"
                          ? "Select Apartment"
                          : "Select Hotel"
                      }
                      value={formData.hotelName || undefined}
                      onChange={(val) =>
                        handleChange({
                          target: { name: "hotelName", value: val },
                        })
                      }
                      suffixIcon={
                        <ChevronDown size={18} className="text-gray-400" />
                      }
                    >
                      {getHotelOptions().map((name, i) => (
                        <Option key={i} value={name}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Select Room Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      {formData.bookingType === "Apartment"
                        ? "Apartment Type"
                        : "Select Room Type"}
                    </label>
                    <Select
                      className="w-full h-12 border border-lightSeconday rounded-lg font-medium"
                      placeholder="Select Type"
                      value={formData.roomType || undefined}
                      onChange={(val) =>
                        handleChange({
                          target: { name: "roomType", value: val },
                        })
                      }
                      suffixIcon={
                        <ChevronDown size={18} className="text-dark" />
                      }
                    >
                      {getTypeOptions().map((type, i) => (
                        <Option key={i} value={type}>
                          {type === "false" ? "Standard" : type}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Room Number Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      {formData.bookingType === "Apartment"
                        ? "Apartment Number"
                        : "Room Number"}
                    </label>
                    <Select
                      className="w-full h-12 border border-lightSeconday rounded-lg font-medium"
                      placeholder={
                        formData.bookingType === "Apartment"
                          ? "Select Apartment No"
                          : "Select Room No"
                      }
                      value={formData.roomNumber || undefined}
                      onChange={(val) =>
                        handleChange({
                          target: { name: "roomNumber", value: val },
                        })
                      }
                      suffixIcon={
                        <ChevronDown size={18} className="text-dark" />
                      }
                    >
                      {getNumberOptions().map((num, i) => (
                        <Option key={i} value={num}>
                          {num}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Number of Guests Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-base font-bold ml-1">
                      Number of Guests
                    </label>
                    <Select
                      className="w-full h-12 border border-lightSeconday  rounded-lg font-medium"
                      value={formData.numGuests || "01 Adult"}
                      onChange={(val) =>
                        handleChange({
                          target: { name: "numGuests", value: val },
                        })
                      }
                      suffixIcon={
                        <ChevronDown size={18} className="text-dark" />
                      }
                    >
                      <Option value="01 Adult">01 Adult</Option>
                      <Option value="02 Adults">02 Adults</Option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section 3: Stay Details */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">
                  Stay Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex flex-col w-full">
                    <label className="text-lightSeconday text-13 font-bold ml-1 mb-1">
                      Checked in Date
                    </label>
                    <div className="relative w-full">
                      <img
                        src={tablecalender}
                        alt="calendar"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-20"
                      />
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-lightSeconday text-13 font-bold ml-1 mb-1">
                      Checked out Date
                    </label>
                    <div className="relative w-full">
                      <img
                        src={tablecalender}
                        alt="calendar"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-20"
                      />
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Total Night
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      placeholder="Enter Nights"
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Pricing & Payment */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">
                  Pricing & Payment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Price per Night
                    </label>
                    <input
                      type="number"
                      readOnly
                      name="pricePerNight"
                      value={formData.pricePerNight}
                      onChange={handleChange}
                      required
                      placeholder="Enter Price"
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0 "
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Taxes & Fee
                    </label>
                    <input
                      type="number"
                      name="taxes"
                      value={formData.taxes}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Discount
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-lightSeconday text-13 font-bold ml-1">
                      Payment Method
                    </label>
                    <Select
                      className="w-full h-[58px] custom-antd-select"
                      value={formData.paymentMethod || "Card"}
                      onChange={(val) =>
                        handleChange({
                          target: { name: "paymentMethod", value: val },
                        })
                      }
                      suffixIcon={
                        <ChevronDown size={18} className="text-dark bg-white" />
                      }
                    >
                      <Option value="Card">Credit Card</Option>
                      <Option value="Bank">Bank</Option>
                      <Option value="Cash">Cash</Option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Booking Status Section remains the same as it uses Radio buttons */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm mt-6">
                <h3 className="text-dark font-semibold text-lg mb-6 pb-1 border-b-2 border-gray-100">
                  Booking Status
                </h3>
                <div className="flex flex-wrap items-center gap-12 py-2">
                  <span className="text-dark font-semibold text-15">
                    Set Booking Status
                  </span>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="status"
                          value="Checked-In"
                          checked={formData.status === "Checked-In"}
                          onChange={handleChange}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all"
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-blue scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                      </div>
                      <span className="text-dark font-medium text-15">
                        Checked in
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="status"
                          value="Reserved"
                          checked={formData.status === "Reserved"}
                          onChange={handleChange}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all"
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-blue scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                      </div>
                      <span className="text-dark font-medium text-15">
                        Reserved
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#EDFDF2] border-2 border-[#107326] rounded-[24px] p-6 top-8">
                <h3 className="text-[#107326] font-semibold text-lg mb-5 border-b-2 border-darkgrayline pb-2">
                  Booking Summary
                </h3>

                <div className="space-y-5">
                  {/* Room Selected Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#718096] text-13 font-semibold mb-0 tracking-wider">
                        {formData.bookingType === "Apartment"
                          ? "Apartment Selected"
                          : "Room Selected"}
                      </p>
                      <p className="text-dark font-bold text-base">
                        {formData.hotelName || "Not Selected"}{" "}
                        {formData.roomNumber ? `#${formData.roomNumber}` : ""}
                      </p>
                    </div>
                    <span className="pt-2.5 rounded-xl shadow-sm text-lg">
                      <img src={selection} alt="" />
                    </span>
                  </div>

                  {/* Stay Duration */}
                  <div className="flex justify-between item-center">
                    <div className="flex flex-col justify-between text-14">
                      <span className="text-[#718096] font-medium">
                        Stay Duration
                      </span>
                      <span className="text-dark font-bold">
                        {formData.checkIn || "Start Date"} -{" "}
                        {formData.checkOut || "End Date"}
                      </span>
                    </div>
                    <p className="text-right text-dark font-bold mt-2 text-sm">
                      {formData.duration || 0} Nights
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t-2 border-darkgrayline pt-4 space-y-3 text-14">
                    <p className="text-lightSeconday font-bold text-sm">
                      Pricing Breakdown
                    </p>
                    <div className="flex justify-between font-medium text-dark">
                      <span>
                        Base Price {formData.duration} night ($
                        {formData.pricePerNight} x {formData.duration})
                      </span>
                      <span className="font-bold text-dark">
                        ${basePriceTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-dark">
                      <span>Taxes & Service Fees</span>
                      <span className="font-bold text-dark">
                        ${taxes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-dark">
                      <span>Discount</span>
                      <span className="font-bold text-red">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Totals Section */}
                  <div className="border-t-2 border-darkgrayline pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-dark font-semibold text-sm">
                        Total Payable
                      </span>
                      <span className="text-xl font-bold text-blue">
                        ${totalPayable.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-dark font-medium">Amount Paid</span>
                      <div className="border border-lightSeconday rounded-lg px-3 py-1.5 font-bold text-dark text-sm">
                        ${amountPaid.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-dark font-medium">
                        Remaining Balance
                      </span>
                      <span className="font-bold text-dark">
                        ${remainingBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-6 flex gap-3 p-3">
                    <Info size={20} className="text-[#48BB78] shrink-0" />
                    <p className="text-[11px] text-[#718096] leading-relaxed">
                      Room availability is checked automatically upon selection.
                      Price estimates include regional stay taxes.
                    </p>
                  </div>
                </div>
              </div>
              {formData.bookingType === "Apartment" && (
                <div className="w-full">
                  {/* Title */}
                  <h3 className="text-blue font-bold text-[16px] mb-3 ml-1">
                    Host Details
                  </h3>

                  {/* Main Card Container */}
                  <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:shadow-md">
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={hostData.profileImg}
                        alt={hostData.name}
                        className="w-100% h-[85px] rounded-full object-cover border-2 border-gray-50 shadow-sm"
                      />
                    </div>

                    {/* Info Content */}
                    <div className="flex flex-col justify-center text-center sm:text-left">
                      {/* Name and Badge */}
                      <div className="mb-4 pr-4 mr-4 mt-4">
                        <h4 className="text-dark font-bold text-medium leading-tight">
                          {hostData.name}
                        </h4>
                        <p className="text-lightSeconday text-14 font-medium mt-0.5 text-start">
                          {hostData.role}
                        </p>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-2.5">
                        {/* Phone */}
                        <div className="flex items-center justify-center sm:justify-start gap-3 group">
                          <div className="text-[#0061F2] opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* <Phone size={16} fill="currentColor" className="text-[#0061F2]/20" /> */}
                            <img src={phone} alt="" />
                          </div>
                          <span className="text-[#374151] font-semibold text-[15px]">
                            {hostData.phone}
                          </span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-center sm:justify-start gap-3 group">
                          <div className="text-[#0061F2] opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* <Mail size={16} fill="currentColor" className="text-[#0061F2]/20" /> */}
                            <img src={inbox} alt="" />
                          </div>
                          <span className="text-[#374151] font-semibold text-[15px]">
                            {hostData.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className=" border-2 border-lightSeconday bg-myWhite px-10 text-lightSeconday rounded-md py-2 font-medium hover:bg-gray-50 transition-all"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-2 bg-blue text-white rounded-md"
          >
            {loading ? "Adding..." : "Save Booking"}
          </button>
        </div>
      </form>
      {isModalOpen && (
        <>
          <SuccessModal
            open={true}
            // onClose={() => setIsModalOpen(false)}
            onClose={() => navigate("/admin/bookings")}
            title={
              !isEditMode
                ? "Booking Save Successfully!"
                : "Booking Save Successfully!"
            }
            description={
              !isEditMode
                ? "The booking has been saved successfully."
                : "The booking has been saved successfully."
            }
            showButton
            buttonText="View Bookings"
            onButtonClick={() => navigate("/admin/bookings")}
          />
        </>
      )}
    </>
  );
};
export default BookingAddComp;
