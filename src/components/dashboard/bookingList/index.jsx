import React from "react";
import HotelDirectory from "../../Table";
import { Pagination, Select } from "antd";
import { useState } from "react";
const entriesPerPageOptions = [5, 10, 15, 20];

const BookingList = ({ recentBookings }) => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const columns = [
    { key: "bookingId", label: "Booking ID", type: "text" },
    { key: "guestName", label: "Guest Name", type: "text" },
    { key: "roomType", label: "Room Type", type: "roomType" },
    { key: "roomNumber", label: "Room No", type: "text" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "checkInOut", label: "Check-In & Check-Out", type: "dateRange" },
    { key: "status", label: "Status", type: "status" },
  ];

  const bookings = [
    {
      bookingId: "#321-02",
      guestName: "Muhammad Akbar Ali Khan Iqbal",
      roomType: "Deluxe",
      roomNumber: "Room 101",
      duration: "3 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-In",
    },
    {
      bookingId: "#321-02",
      guestName: "Sara Iqbal",
      roomType: "Standard",
      roomNumber: "Room 202",
      duration: "2 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-In",
    },
    {
      bookingId: "#321-02",
      guestName: "Alexander James William Robert Smith",
      roomType: "Deluxe",
      roomNumber: "Room 300",
      duration: "1 night",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-Out",
    },
    {
      bookingId: "#321-02",
      guestName: "Sophia Grace",
      roomType: "Deluxe",
      roomNumber: "Room 119",
      duration: "3 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-Out",
    },
    {
      bookingId: "#321-02",
      guestName: "Benjamin Thomas Edward Samuel Brown",
      roomType: "Standard",
      roomNumber: "Room 210",
      duration: "2 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-In",
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBookings = recentBookings.slice(startIndex, endIndex);
  return (
    <div>
      <div className="min-h-[400px] mt-6 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <HotelDirectory
          data={paginatedBookings}
          title="Bookings List"
          columns={columns}
          filter={false}
          view={true}
          path={`/admin/booking/view`}
          viewpath={`/admin/booking/view`}
        />
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={itemsPerPage}
              className="text-black min-w-[72px]"
              onChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
              options={entriesPerPageOptions.map((option) => ({
                label: option,
                value: option,
              }))}
            />

            <span className="text-lightSeconday text-sm">Entries per page</span>
          </div>

          <Pagination
            current={currentPage}
            total={recentBookings?.length || 0}
            pageSize={itemsPerPage}
            onChange={onPageChange}
            className="admin-pagination flex justify-end flex-wrap"
          />

        </div>
      </div>
    </div>
  );
};

export default BookingList;
