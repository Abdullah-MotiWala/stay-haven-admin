import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Table";
import { getAllUsers, deleteUser, toggleUserStatus } from "../../services/user";
import { openNotification } from "../../network/notification";
import { Pagination, Select, Input } from "antd";

const entriesPerPageOptions = [10, 20, 30, 40];

const HostsListing = () => {
    const navigate = useNavigate();
    const [hosts, setHosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Inactive reason modal
    const [reasonModal, setReasonModal] = useState({ open: false, hostId: null, currentStatus: "" });
    const [reason, setReason] = useState("");
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllUsers({
                    type: "host",
                    page: currentPage,
                    limit: itemsPerPage,
                });
                setHosts(res.data?.data || []);
                setTotal(res.data?.meta?.totalItems || res.data?.meta?.total || 0);
                setRefresh(false);
            } catch (err) {
                console.error("Data fetch error", err);
                openNotification("error", "Failed to fetch hosts");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refresh, currentPage, itemsPerPage]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this host?")) {
            try {
                await deleteUser(id);
                setHosts(hosts.filter((host) => host.id !== id));
                openNotification("success", "Host deleted successfully");
                setRefresh(true);
            } catch (err) {
                console.error("Problem in deleting", err);
                openNotification("error", "Failed to delete host");
            }
        }
    };


    const handleStatusToggle = async (id) => {
        // Find host to check current status
        const host = hosts.find(h => h.id === id);
        const isActive = host?.status?.toLowerCase() === "active";

        if (isActive) {
            // Going inactive → ask for reason
            setReasonModal({ open: true, hostId: id, currentStatus: "active" });
        } else {
            // Going active → no reason needed
            try {
                await toggleUserStatus(id);
                openNotification("success", "Status updated");
                setRefresh(true);
            } catch {
                openNotification("error", "Failed to update status");
            }
        }
    };

    const handleReasonConfirm = async () => {
        if (!reason.trim()) { openNotification("error", "Please enter a reason"); return; }
        setStatusLoading(true);
        try {
            await toggleUserStatus(reasonModal.hostId, reason.trim());
            openNotification("success", "Host deactivated and email sent");
            setRefresh(true);
        } catch {
            openNotification("error", "Failed to update status");
        } finally {
            setStatusLoading(false);
            setReasonModal({ open: false, hostId: null, currentStatus: "" });
            setReason("");
        }
    };


    const columns = [
        // { key: "id", label: "Host ID", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "email", label: "Email", type: "text" },
        { key: "phoneNumber", label: "Phone", type: "text" },
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
                    <Breadcrumb title="Hosts" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm mt-12">
                    {loading ? (
                        <div className="flex justify-center items-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-blue-600 font-medium">
                                Loading Hosts...
                            </span>
                        </div>
                    ) : (
                        <Table
                            data={hosts}
                            onDelete={handleDelete}
                            title="Hosts Directory"
                            columns={columns}
                            setRefresh={setRefresh}
                            path={`/admin/hosts/edit`}
                            viewpath={`/admin/hosts/view`}
                            view={true}
                            hostOptions={true}
                            onStatusToggle={handleStatusToggle}
                            extraActions={[
                                {
                                    label: "View Details",
                                    onClick: (row) => navigate(`/admin/hosts/view/${row.id}`),
                                },
                            ]}
                        />

                    )}

                    <div className="mt-4 flex justify-between">
                        <div>
                            <Select
                                defaultValue={10}
                                className="text-black "
                                onChange={(value) => setItemsPerPage(value)}
                                options={entriesPerPageOptions.map((option) => ({
                                    label: option,
                                    value: option,
                                }))}
                            />
                            <span className="text-lightSeconday ml-4">Entries per page</span>
                        </div>
                        <Pagination
                            current={currentPage}
                            total={total}
                            pageSize={itemsPerPage}
                            onChange={onPageChange}
                            className="admin-pagination flex justify-end flex-wrap"
                        />
                    </div>
                </div>
            </div>

            {/* Inactive Reason Modal */}
            {reasonModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Deactivate Host</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Please provide a reason. The host will receive an email with this reason.
                        </p>
                        <Input.TextArea
                            rows={3}
                            placeholder="e.g. Violation of terms of service"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setReasonModal({ open: false, hostId: null, currentStatus: "" }); setReason(""); }}
                                className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReasonConfirm}
                                disabled={statusLoading || !reason.trim()}
                                className="px-6 py-2 bg-red text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                            >
                                {statusLoading ? "Processing..." : "Deactivate & Notify"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostsListing;
