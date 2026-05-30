import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { getAllBooking } from "../../services/booking";
import { getAllHotels } from "../../services/hotel";
import { getAllUsers } from "../../services/user";
import { openNotification } from "../../network/notification";
import { Select, DatePicker, Button, Table, Input } from "antd";
import { DownloadOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const Reports = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    hotelId: null,
    hostId: null,
    status: null,
    checkIn: null,
    checkOut: null,
    bookingType: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    fetchHotels();
    fetchHosts();
    fetchReports();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await getAllHotels(1, 100);
      // Handle different response structures
      const hotelsData = res.data?.data || res.data || [];
      setHotels(Array.isArray(hotelsData) ? hotelsData : []);
    } catch (err) {
      console.error("Failed to load hotels:", err);
      setHotels([]);
    }
  };

  const fetchHosts = async () => {
    try {
      const res = await getAllUsers({ type: "host", page: 1, limit: 100 });
      // Handle different response structures
      const hostsData = res.data?.data || res.data || [];
      setHosts(Array.isArray(hostsData) ? hostsData : []);
    } catch (err) {
      console.error("Failed to load hosts:", err);
      setHosts([]);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getAllBooking(1, 10000, filters.bookingType === "apartment");
      let data = res.data?.data || res.data || [];

      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = [];
      }

      // Apply filters
      if (filters.hotelId) {
        data = data.filter((b) => b.hotel?.id === filters.hotelId);
      }
      if (filters.hostId) {
        data = data.filter((b) => b.hotel?.host?.id === filters.hostId);
      }
      if (filters.status) {
        data = data.filter((b) => b.status?.toLowerCase() === filters.status.toLowerCase());
      }
      // ... aapke baqi filters

      if (filters.checkIn) {
        data = data.filter((b) => {
          if (!b.checkIn) return false; // Agar API se date nahi aayi to skip karo
          // API ki date ko YYYY-MM-DD main convert karke filter se compare karein
          const bookingDate = dayjs(b.checkIn).format("YYYY-MM-DD");
          return bookingDate >= filters.checkIn;
        });
      }

      if (filters.checkOut) {
        data = data.filter((b) => {
          if (!b.checkOut) return false;
          const bookingDate = dayjs(b.checkOut).format("YYYY-MM-DD");
          return bookingDate <= filters.checkOut;
        });
      }

      // ... aapke baqi filters (bookingType waghera)
      if (filters.bookingType === "hostel") {
        data = data.filter((b) => b.isHostel === true);
      } else if (filters.bookingType === "room") {
        data = data.filter((b) => b.isHostel === false && !b.apartment);
      }

      setBookings(data);
    } catch (err) {
      console.error("Failed to load reports:", err);
      openNotification("error", "Failed to load reports");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // console.log("Filters " , filters);
  };

  const handleApplyFilters = () => {
    fetchReports();
  };

  const handleResetFilters = () => {
    setFilters({
      hotelId: null,
      hostId: null,
      status: null,
      checkIn: null,
      checkOut: null,
      bookingType: null,
    });
    setTimeout(() => fetchReports(), 100);

  };

  const exportToCSV = () => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      openNotification("warning", "No data to export");
      return;
    }

    const headers = [
      "Booking ID",
      "Guest Name",
      "Guest Email",
      "Guest Phone",
      "Hotel Name",
      "Host Name",
      "Room/Apartment",
      "Room Number",
      "Check-In",
      "Check-Out",
      "Duration (Days)",
      "Total Amount",
      "Status",
      "Booking Type",
      "Created At",
    ];

    const rows = bookings.map((booking) => [
      booking.bookingId || booking.id,
      booking.guestName || `${booking.guest?.firstName || ""} ${booking.guest?.lastName || ""}`.trim(),
      booking.guest?.email || "",
      booking.guest?.phone || "",
      booking.hotel?.name || booking.apartment?.hotel?.name || "",
      booking.hotel?.host?.name || booking.apartment?.hotel?.host?.name || "",
      booking.room?.roomType?.name || booking.apartment?.name || "",
      booking.room?.roomNumber || booking.apartment?.apartmentNumber || "",
      booking.checkIn ? dayjs(booking.checkIn).format("YYYY-MM-DD") : "",
      booking.checkOut ? dayjs(booking.checkOut).format("YYYY-MM-DD") : "",
      booking.duration || "",
      booking.totalAmount || "",
      booking.status || "",
      booking.apartment ? "Apartment" : booking.isHostel ? "Hostel" : "Room",
      booking.createdAt ? dayjs(booking.createdAt).format("YYYY-MM-DD HH:mm:ss") : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `booking-report-${dayjs().format("YYYY-MM-DD")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    openNotification("success", "Report exported successfully");
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (text, record) => text || record.id,
      width: 120,
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      render: (text, record) =>
        text || `${record.guest?.firstName || ""} ${record.guest?.lastName || ""}`.trim(),
      width: 150,
    },
    {
      title: "Hotel",
      dataIndex: ["hotel", "name"],
      key: "hotel",
      render: (text, record) => text || record.apartment?.hotel?.name || "—",
      width: 150,
    },
    {
      title: "Host",
      dataIndex: ["hotel", "host", "name"],
      key: "host",
      render: (text, record) => text || record.apartment?.hotel?.host?.name || record.room?.host?.name || "—",
      width: 130,
    },
    {
      title: "Room/Apartment",
      key: "roomType",
      render: (_, record) => record.room?.roomType?.name || record.apartment?.name || record.room?.roomNumber || "—",
      width: 150,
    },
    {
      title: "Check-In",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (date) => (date ? dayjs(date).format("MMM DD, YYYY") : "—"),
      width: 120,
    },
    {
      title: "Check-Out",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (date) => (date ? dayjs(date).format("MMM DD, YYYY") : "—"),
      width: 120,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text || 0} days`,
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (amount) => `$${amount || 0}`,
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const s = status?.toLowerCase();

        const styleMap = {
          "booked": { background: "#DBEAFE", color: "#1D4ED8" },
          "reserved": { background: "#DBEAFE", color: "#1D4ED8" },
          "checked-in": { background: "#DCFCE7", color: "#15803D" },
          "checkin": { background: "#DCFCE7", color: "#15803D" },
          "checked-out": { background: "#F3F4F6", color: "#374151" },
          "checkout": { background: "#F3F4F6", color: "#374151" },
          "completed": { background: "#EDE9FE", color: "#6D28D9" },
          "cancelled": { background: "#FEE2E2", color: "#DC2626" },
          "canceled": { background: "#FEE2E2", color: "#DC2626" },
          "pending": { background: "#FEF9C3", color: "#A16207" },
          "confirmed": { background: "#DCFCE7", color: "#15803D" },
        };

        const style = styleMap[s] || { background: "#F3F4F6", color: "#6B7280" };

        return (
          <span
            style={{
              ...style,
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {status || "—"}
          </span>
        );
      },
      width: 120,
    },
  ];

  const statusOptions = [
    { label: "All Status", value: null },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Checked-In", value: "checked-in" },
    { label: "Checked-Out", value: "checked-out" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const bookingTypeOptions = [
    { label: "All Types", value: null },
    { label: "Room Bookings", value: "room" },
    { label: "Hostel Bookings", value: "hostel" },
    { label: "Apartment Bookings", value: "apartment" },
  ];

  return (
    <div className="p-0">
      <Breadcrumb title="Booking Reports" />

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mt-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FilterOutlined className="text-blue-600" />
            Filters
          </h2>
          <div className="flex gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              className="flex items-center"
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <Select
              placeholder="Select booking type"
              className="w-full"
              value={filters.bookingType}
              onChange={(value) => handleFilterChange("bookingType", value)}
              options={bookingTypeOptions}
              allowClear
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
            <Select
              showSearch
              placeholder="Select hotel"
              className="w-full"
              value={filters.hotelId}
              onChange={(value) => handleFilterChange("hotelId", value)}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { label: "All Hotels", value: null },
                ...(Array.isArray(hotels) ? hotels.map((h) => ({ label: h.name, value: h.id })) : []),
              ]}
              allowClear
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
            <Select
              showSearch
              placeholder="Select host"
              className="w-full"
              value={filters.hostId}
              onChange={(value) => handleFilterChange("hostId", value)}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { label: "All Hosts", value: null },
                ...(Array.isArray(hosts) ? hosts.map((h) => ({ label: h.name, value: h.id })) : []),
              ]}
              allowClear
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              placeholder="Select status"
              className="w-full"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              options={statusOptions}
              allowClear
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-In From</label>
            <DatePicker
              className="w-full"
              placeholder="Select check-in date"
              value={filters.checkIn ? dayjs(filters.checkIn) : null}
              // yahan .toISOString() ko .format("YYYY-MM-DD") se replace kiya hai
              onChange={(date) => handleFilterChange("checkIn", date ? date.format("YYYY-MM-DD") : null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Until</label>
            <DatePicker
              className="w-full"
              placeholder="Select check-out date"
              value={filters.checkOut ? dayjs(filters.checkOut) : null}

              onChange={(date) => handleFilterChange("checkOut", date ? date.format("YYYY-MM-DD") : null)}
            />
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Booking Report</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Records: <span className="font-semibold text-gray-700">{bookings.length}</span>
            </p>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportToCSV}
            size="large"
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            Export to CSV
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          rowKey={(record) => record.id}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize, // Ab yeh state se aayega
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bookings`,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size); // Jab user size badlega, toh yeh state update karega

              // Yahan aap apni API call ka function laga sakte hain
              // fetchBookings(page, size); 
            },
          }}
          className="report-table"
          childrenColumnName="nestedData"
        />
      </div>
    </div>
  );
};

export default Reports;
