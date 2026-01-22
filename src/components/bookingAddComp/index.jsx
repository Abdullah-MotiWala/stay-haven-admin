import leftangle from "../../assets/icons/leftangle.png"
import { ChevronDown, Info } from 'lucide-react';
import selection from "../../assets/icons/selection.png"
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import calenderIcon from "../../assets/icons/calendarIcon.png"
import { createBooking } from "../../services/booking";
import { getAllRooms } from "../../services/rooms"
import { openNotification } from "../../network/notification";
import { updateStats } from "../../services/booking";

const BookingAddComp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [ids,setids] = useState();
    const [formData, setFormData] = useState({
        guestName: "",
        phone: "",
        email: "",
        cnic: "",
        hotelId: "", // Store Hotel ID
        hotelName: "",
        roomId: "",    // Store Room ID
        roomType: "",
        roomNumber: "",
        numGuests: "01 Adult",
        checkIn: "",
        checkOut: "",
        duration: 0,
        pricePerNight: 0,
        taxes: 0,
        discount: 0,
        paymentMethod: "Bank",
        status: "Checked-In"
    });
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
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getAllRooms();
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setRooms(data);
            } catch (err) {
                console.error("Error fetching rooms:", err);
                openNotification("error", "Failed to load rooms");
            }
        };
        fetchRooms();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "hotelName") {
            // Hotel select hote hi uski ID dhoondo
            const selectedRoomObj = rooms.find(r => (r.hotel?.name || "Ocean View Resort") === value);
            setFormData(prev => ({
                ...prev,
                hotelName: value,
                hotelId: selectedRoomObj?.hotel?.id || ""
            }));
            setids(selectedRoomObj?.hotel?.id)
        } else if (name === "roomNumber") {
            // Room select hote hi uski ID aur Price dhoondo
            const selectedRoomObj = rooms.find(r => r.roomNumber === value);
            setFormData(prev => ({
                ...prev,
                roomNumber: value,
                roomId: selectedRoomObj?.id || "",
                pricePerNight: selectedRoomObj?.pricePerNight || 0
            }));

        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // API ko send karne wala data
            const res = await createBooking(formData);
            if (res.status === 200 || res.status === 201) {
                openNotification("success", "Booking saved successfully!");
                navigate("/admin/booking");
            }

            if (typeof handleStatusUpdate === "function") {
                await handleStatusUpdate(formData.status);
            }
        } catch (err) {
            openNotification("error", "Error saving booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 items-center gap-4'>
                <img src={leftangle} alt="" className="cursor-pointer" onClick={() => navigate(-1)} />
                <button type="button" onClick={() => navigate(-1)} className='text-gray-600 flex font-medium'>Back</button>
            </div>

            <h3 className="font-semibold pb-2 px-3 text-lg"> {isEditMode ? "Edit Booking" : "Add New Booking"}</h3>

            <div className="bg-white rounded-2xl m-0 shadow-md min-h-screen p-4 md:p-8 w-full">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-8 space-y-6">
                        {/* Section 1: Guest Information */}
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">Guest Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Guest Full Name</label>
                                    <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required placeholder="Enter full Name" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter Number" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">CNIC</label>
                                    <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} required placeholder="Enter CNIC" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Room Selection */}
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-lg mb-6 pb-2 border-b border-gray-100">Room Selection</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Hotel Name</label>
                                    <div className="relative">
                                        <select name="hotelName" value={formData.hotelName} onChange={handleChange} required className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none cursor-pointer m-0">
                                            <option value="">Select Hotel</option>
                                            {[...new Set(rooms.map(r => r.hotel?.name || "Ocean View Resort"))].map((hotel, i) => (
                                                <option key={i} value={hotel}>{hotel}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Select Room Type</label>
                                    <div className="relative">
                                        <select name="roomType" value={formData.roomType} onChange={handleChange} required className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none cursor-pointer m-0">
                                            <option value="">Select Type</option>
                                            {[...new Set(rooms.map(r => r.type))].map((type, i) => (
                                                <option key={i} value={type}>{type === "false" ? "Standard" : type}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Room Number</label>
                                    <div className="relative">
                                        <select name="roomNumber" value={formData.roomNumber} onChange={handleChange} required className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none cursor-pointer m-0">
                                            <option value="">Select Room No</option>
                                            {rooms.filter(r => !formData.roomType || r.type === formData.roomType).map((room, i) => (
                                                <option key={i} value={room.roomNumber}>Room No {room.roomNumber}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Number of Guests</label>
                                    <div className="relative">
                                        <select name="numGuests" value={formData.numGuests} onChange={handleChange} className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none cursor-pointer m-0">
                                            <option value="01 Adult">01 Adult</option>
                                            <option value="02 Adults">02 Adults</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Stay Details (Fixed Calendar) */}
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">Stay Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex flex-col w-full">
                                    <label className="text-lightSeconday text-13 font-bold ml-1 mb-1">Checked in Date</label>
                                    <div className="relative group">
                                        {/* Removed appearance-none and pointer-events-none from indicator to allow click */}
                                        <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0 cursor-pointer" />
                                        {/* <img src={calenderIcon} alt="calendar" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" /> */}
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-lightSeconday text-13 font-bold ml-1 mb-1">Checked out Date</label>
                                    <div className="relative group">
                                        <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0 cursor-pointer" />
                                        {/* <img src={calenderIcon} alt="calendar" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" /> */}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Total Night</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} required placeholder="Enter Nights" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Pricing & Payment */}
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                            <h3 className="text-dark font-bold text-18 mb-6 pb-2 border-b border-gray-100">Pricing & Payment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Price per Night</label>
                                    <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required placeholder="Enter Price" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0 " />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Taxes & Fee</label>
                                    <input type="number" name="taxes" value={formData.taxes} onChange={handleChange} required placeholder="Enter Taxes & Fee" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Discount</label>
                                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Enter Discount" className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none m-0" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-lightSeconday text-13 font-bold ml-1">Payment Method</label>
                                    <div className="relative">
                                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-dark font-medium outline-none cursor-pointer m-0">
                                            <option value="Bank">Bank</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Card">Card</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm mt-6">
    <h3 className="text-dark font-semibold text-lg mb-6 pb-1 border-b-2 border-gray-100">Booking Status</h3>
    <div className="flex flex-wrap items-center gap-12 py-2">
        <span className="text-dark font-semibold text-15">Set Booking Status</span>
        <div className="flex items-center gap-8">
            
            {/* Checked-In Option */}
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                    <input 
                        type="radio" 
                        name="status" 
                        value="Checked-In" 
                        checked={formData.status === "Checked-In"} 
                        onChange={handleChange} // Sirf form state update hogi
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue transition-all" 
                    />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-blue scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                </div>
                <span className="text-dark font-medium text-15">Checked in</span>
            </label>

            {/* Reserved Option */}
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
                <span className="text-dark font-medium text-15">Reserved</span>
            </label>

        </div>
    </div>
</div>

                    </div>

                    {/* RIGHT SIDE: Summary */}
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
                <button type="button" onClick={() => navigate(-1)} className="border-2 border-lightSeconday bg-white px-10 py-2 rounded-md font-medium text-lightSeconday">Back</button>
                <button type="submit" disabled={loading} className="px-10 py-2 bg-blue text-white rounded-md shadow-lg font-medium hover:bg-blue-600 transition-all">
                    {loading ? "Saving..." : "Save Booking"}
                </button>
            </div>
        </form>
    )
}
export default BookingAddComp;