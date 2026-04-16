import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatrixCard from "../../../components/MatrixCard";
import Breadcrumb from "../../../components/Breadcrumb";
import HotelDirectory from "../../../components/Table";
import {
  getAllHotels,
  deleteHotel,
  getStats,
  lastHotelId,
  hotelStatusUpdate,
} from "../../../services/hotel";
import home1 from "../../../assets/icons/home-1.png";
import home2 from "../../../assets//icons/home-2.png";
import home3 from "../../../assets/icons/home-3.png";
import home4 from "../../../assets/icons/home-4.png";
import { openNotification } from "../../../network/notification";
import { Pagination, Select } from "antd";
import StatusReasonModal, { needsReason } from "../../../components/shared/statusReasonModal";

const entriesPerPageOptions = [10, 20, 30, 40];

const HotelsListing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reasonModal, setReasonModal] = useState({ open: false, hotelId: null, status: "" });
  const [reason, setReason] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data.data);
      } catch (err) {
        openNotification("error", "Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const res = await lastHotelId();
        setLastId(res?.data);
      } catch {
        openNotification("error", "Failed to load hotel ID");
      }
    };
    fetchLastId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels(currentPage, itemsPerPage);
        setHotels(res.data || []);
        setRefresh(false);
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, currentPage, itemsPerPage]);

  const handleStatusToggle = (id, newStatus) => {
    if (needsReason(newStatus)) {
      setReasonModal({ open: true, hotelId: id, status: newStatus });
    } else {
      applyStatusUpdate(id, newStatus, "");
    }
  };

  const applyStatusUpdate = async (id, status, reasonText) => {
    setStatusLoading(true);
    try {
      await hotelStatusUpdate(id, { status, ...(reasonText ? { reason: reasonText } : {}) });
      openNotification("success", "Hotel status updated");
      setRefresh(true);
    } catch {
      openNotification("error", "Failed to update status");
    } finally {
      setStatusLoading(false);
      setReasonModal({ open: false, hotelId: null, status: "" });
      setReason("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteHotel(id);
        setHotels(hotels.filter((hotel) => hotel.id !== id));
        openNotification("success", "Hotel deleted successfully");
      } catch (err) {
        openNotification("error", "Internal Server Error");
      }
    }
  };

  const cardsData = [
    { title: "Total Hotels",    value: stats?.totalHotels,   bg: "#F3F7EE", iconBg: "#D1E1BC", image: home1, trend: `${stats?.growth?.isPositive ? "+" : "-"}${stats?.growth?.percentage ?? 0}%`, trendText: "vs last week", showTrend: true },
    { title: "Active Hotels",   value: stats?.activeHotels,  bg: "#EFF9FF", iconBg: "#C7DAE7", image: home2 },
    { title: "Inactive Hotels", value: stats?.inactiveHotels, bg: "#F7EFFF", iconBg: "#DED0EC", image: home3 },
    { title: "In Draft",        value: stats?.inDraft,       bg: "#F3F4FB", iconBg: "#CBCEE7", image: home4 },
  ];

  const columns = [
    { key: "uiHotelId",      label: "Hotel ID",        type: "text" },
    { key: "name",           label: "Hotel Name",      type: "hotel" },
    { key: "totalRooms",     label: "Total Rooms",     type: "number" },
    { key: "roomsAvailable", label: "Rooms Available", type: "number" },
    { key: "roomsOccupied",  label: "Rooms Occupied",  type: "number" },
    { key: "reserved",       label: "Reserved",        type: "number" },
    { key: "status",         label: "Status",          type: "status" },
    { key: "actions",        label: "Actions",         type: "actions" },
  ];

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  return (
    <div className="p-0">
      <div className="mt-4 px-3">
        <Breadcrumb title="Hotels" />
      </div>

      <div className="my-12">
        <MatrixCard data={cardsData} />
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm mt-12">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <span className="ml-3 text-blue-600 font-medium">Loading Hotels...</span>
          </div>
        ) : (
          <HotelDirectory
            data={hotels?.data}
            onDelete={handleDelete}
            title="Hotels Directory"
            columns={columns}
            setRefresh={setRefresh}
            lastId={lastId?.nextNumericId}
            path={`/admin/hotel/view`}
            hoteloptions={true}
            onStatusToggle={(id, newStatus) => handleStatusToggle(id, newStatus)}
          />
        )}

        <div className="mt-4 flex justify-between">
          <div>
            <Select
              placeholder="Select Entries"
              defaultValue={10}
              className="text-black"
              onChange={(value) => setItemsPerPage(value)}
              options={entriesPerPageOptions.map((o) => ({ label: o, value: o }))}
              showSearch
            />
            <span className="text-lightSeconday ml-4">Entries per page</span>
          </div>
          <Pagination
            current={currentPage}
            total={stats?.totalHotels || 0}
            pageSize={itemsPerPage}
            onChange={onPageChange}
            className="flex justify-end"
          />
        </div>
      </div>

      <StatusReasonModal
        open={reasonModal.open}
        status={reasonModal.status}
        reason={reason}
        onChange={setReason}
        onConfirm={() => applyStatusUpdate(reasonModal.hotelId, reasonModal.status, reason)}
        onCancel={() => { setReasonModal({ open: false, hotelId: null, status: "" }); setReason(""); }}
        loading={statusLoading}
      />
    </div>
  );
};

export default HotelsListing;
