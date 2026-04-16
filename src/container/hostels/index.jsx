import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Table";
import { getAllHostels, deleteRoom, updateRoomStatus } from "../../services/rooms";
import { openNotification } from "../../network/notification";
import { Pagination, Select, Input } from "antd";
import StatusReasonModal, { needsReason } from "../../components/shared/statusReasonModal";
import searchImg from "../../assets/icons/search.svg";

const entriesPerPageOptions = [10, 20, 30, 40];

const HOSTEL_TABS = ["All", "Available", "Occupied", "Maintenance"];

const HostelListing = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [reasonModal, setReasonModal] = useState({ open: false, id: null, status: "" });
    const [reason, setReason] = useState("");
    const [statusLoading, setStatusLoading] = useState(false);

    const fetchHostels = async () => {
        try {
            setLoading(true);
            const status = activeTab === "All" ? "" : activeTab.toLowerCase();
            const res = await getAllHostels(currentPage, itemsPerPage, status, search);
            setHostels(res.data?.data || []);
            setTotal(res.data?.meta?.totalItems || res.data?.meta?.total || 0);
        } catch (err) {
            console.error("Fetch error", err);
            openNotification("error", "Failed to fetch hostels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, [currentPage, itemsPerPage, activeTab]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchHostels();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusToggle = (id, newStatus) => {
        if (needsReason(newStatus)) {
            setReasonModal({ open: true, id, status: newStatus });
        } else {
            applyStatusUpdate(id, newStatus, "");
        }
    };

    const applyStatusUpdate = async (id, status, reasonText) => {
        setStatusLoading(true);
        try {
            await updateRoomStatus(id, status, reasonText);
            openNotification("success", "Hostel status updated");
            fetchHostels();
        } catch {
            openNotification("error", "Failed to update status");
        } finally {
            setStatusLoading(false);
            setReasonModal({ open: false, id: null, status: "" });
            setReason("");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteRoom(id);
            openNotification("success", "Hostel deleted successfully");
            fetchHostels();
        } catch (err) {
            openNotification("error", "Failed to delete hostel");
        }
    };

    const columns = [
        { key: "roomName", label: "Hostel Name", type: "text" },
        { key: "roomNumber", label: "Room/Bed No.", type: "text" },
        { key: "pricePerNight", label: "Price/Night", type: "text" },
        { key: "maxAdults", label: "Capacity", type: "text" },
        { key: "status", label: "Status", type: "status" },
        { key: "actions", label: "Actions", type: "actions" },
    ];
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);
    };

    return (
        <div className="p-0">
            <div className="p-0">
                <div className="mt-4 px-3">
                    <Breadcrumb title="Hostels" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm mt-12">
                    {/* Tabs */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex gap-1 flex-wrap">
                            {HOSTEL_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                                        ? "bg-blue text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <Input
                                placeholder="Search hostels..."
                                prefix={<img src={searchImg} className="w-4 h-4" />}
                                className="w-64 h-10 border border-lightSeconday rounded-xl font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                onClick={() => navigate("/admin/hostels/add")}
                                className="px-5 py-2 bg-blue text-white rounded-lg text-sm font-semibold whitespace-nowrap"
                            >
                                + Add Hostel
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-blue-600 font-medium">Loading Hostels...</span>
                        </div>
                    ) : (
                        <Table
                            data={hostels}
                            onDelete={handleDelete}
                            title="Hostels Directory"
                            columns={columns}
                            path={`/admin/hostels/edit`}
                            onStatusToggle={handleStatusToggle}
                        />
                    )}

                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <Select
                                defaultValue={10}
                                className="text-black"
                                onChange={(value) => { setItemsPerPage(value); setCurrentPage(1); }}
                                options={entriesPerPageOptions.map((o) => ({ label: o, value: o }))}
                            />
                            <span className="text-lightSeconday ml-4">Entries per page</span>
                        </div>
                        <Pagination
                            current={currentPage}
                            total={total}
                            pageSize={itemsPerPage}
                            onChange={onPageChange}
                            className="flex justify-end"
                        />
                    </div>
                </div>
            </div>
            <StatusReasonModal
                open={reasonModal.open}
                status={reasonModal.status}
                reason={reason}
                onChange={setReason}
                onConfirm={() => applyStatusUpdate(reasonModal.id, reasonModal.status, reason)}
                onCancel={() => { setReasonModal({ open: false, id: null, status: "" }); setReason(""); }}
                loading={statusLoading}
            />
        </div >
    );
};

export default HostelListing;
