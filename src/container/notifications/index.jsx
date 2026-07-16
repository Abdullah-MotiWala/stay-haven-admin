import React, { useState, useEffect } from "react";
import { Spin, Empty, Pagination, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  getNotifications,
  getNotificationsLoading,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchNotifications,
} from "../../redux/features/notification";
import Breadcrumb from "../../components/Breadcrumb";

const PAGE_SIZES = [10, 20, 30];

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(getNotifications);
  const loading = useSelector(getNotificationsLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    dispatch(fetchNotifications()).then((res) => {
      console.log("Raw notification response:", res.payload);
    });
  }, [dispatch]);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();


  const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (!isValidDate(date)) return "—";

    const now = new Date();
    const diffMs = now - date;
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const getDateGroupKey = (dateVal) => {
    const d = new Date(dateVal);
    if (!isValidDate(d)) return "UNKNOWN DATE";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(d, today)) return "TODAY";
    if (isSameDay(d, yesterday)) return "YESTERDAY";
    return d
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      .toUpperCase();
  };

  const handleMarkAsRead = (id) => dispatch(markNotificationAsRead(id));
  const handleMarkAllAsRead = (groupNotifs) =>
    dispatch(markAllNotificationsAsRead(groupNotifs.filter((n) => !n.isRead).map((n) => n.id)));

  const totalItems = notifications.length;
  const paginatedNotifs = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paginatedGrouped = {};
  paginatedNotifs.forEach((n) => {
    const key = getDateGroupKey(n.createdAt);
    if (!paginatedGrouped[key]) paginatedGrouped[key] = [];
    paginatedGrouped[key].push(n);
  });

  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb title="Notifications" />

        <div className="bg-white p-6 rounded-3xl shadow-sm mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
              {unreadTotal > 0 && (
                <span className="bg-mainPrimary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadTotal} new
                </span>
              )}
            </div>
            {unreadTotal > 0 && (
              <button
                onClick={() => handleMarkAllAsRead(notifications)}
                className="text-sm text-mainPrimary hover:underline font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications" className="py-12" />
          ) : (
            <>
              <div className="space-y-5">
                {Object.entries(paginatedGrouped).map(([dateGroup, groupNotifs]) => (
                  <div key={dateGroup}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {dateGroup}
                      </span>
                      {groupNotifs.some((n) => !n.isRead) && (
                        <button
                          onClick={() => handleMarkAllAsRead(groupNotifs)}
                          className="text-xs text-mainPrimary hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {groupNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                          className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all
                            ${!notif.isRead
                              ? "bg-[#FFF5F5] border-[#FECACA] cursor-pointer hover:bg-[#FEE2E2]"
                              : "bg-gray-50 border-gray-100 cursor-default"
                            }`}
                        >
                          <div
                            className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${notif.type === "Alert" ? "bg-red-100" : "bg-green-100"}`}
                          >
                            <svg
                              className={`w-4 h-4 ${notif.type === "Alert" ? "text-red-500" : "text-green-500"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                              />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`text-sm font-semibold ${!notif.isRead ? "text-gray-900" : "text-gray-600"
                                  }`}
                              >
                                {notif.title}
                                {!notif.isRead && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-mainPrimary rounded-full align-middle" />
                                )}
                              </p>
                              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                {formatTime(notif.createdAt)}
                              </span>
                            </div>
                            <p
                              className={`text-xs mt-0.5 leading-relaxed ${!notif.isRead ? "text-gray-700" : "text-gray-400"
                                }`}
                            >
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {totalItems > pageSize && (
                <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                  <Select
                    value={pageSize}
                    onChange={(val) => {
                      setPageSize(val);
                      setCurrentPage(1);
                    }}
                    options={PAGE_SIZES.map((s) => ({ label: `${s} per page`, value: s }))}
                    className="w-36"
                    size="small"
                  />
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={(p) => setCurrentPage(p)}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;