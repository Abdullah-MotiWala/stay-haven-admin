import React, { useState, useEffect } from "react";
import { Spin, Empty } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getAllNotifications, markAsRead, markAllAsRead } from "../../services/notification";
import { openNotification } from "../../network/notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedNotifications, setGroupedNotifications] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getAllNotifications();
      const notifData = res?.data?.data || [];
      setNotifications(notifData);
      groupNotificationsByDate(notifData);
    } catch (err) {
      console.error("Failed to load notifications", err);
      openNotification("error", "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const groupNotificationsByDate = (notifs) => {
    const grouped = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifs.forEach((notif) => {
      const notifDate = new Date(notif.createdAt);
      let groupKey;

      if (isSameDay(notifDate, today)) {
        groupKey = "TODAY";
      } else if (isSameDay(notifDate, yesterday)) {
        groupKey = "YESTERDAY";
      } else {
        groupKey = notifDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).toUpperCase();
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(notif);
    });

    setGroupedNotifications(grouped);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      openNotification("error", "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async (groupNotifs) => {
    try {
      // Mark all unread notifications in this group
      const unreadIds = groupNotifs.filter((n) => !n.isRead).map((n) => n.id);
      if (unreadIds.length === 0) {
        openNotification("info", "No unread notifications");
        return;
      }
      await markAllAsRead(unreadIds);
      openNotification("success", "All marked as read");
      fetchNotifications();
    } catch (err) {
      openNotification("error", "Failed to mark all as read");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const getNotificationIcon = (type) => {
    const iconClass = type === "Alert" ? "bg-red-100" : "bg-green-100";
    const checkClass = type === "Alert" ? "text-red-500" : "text-green-500";
    
    return (
      <div className={`w-12 h-12 rounded-full ${iconClass} flex items-center justify-center flex-shrink-0`}>
        <CheckCircleOutlined className={`text-xl ${checkClass}`} />
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="text-mainPrimary">Dashboard</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Notifications</span>
        </div>

        {/* Main Container */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mt-12">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notifications</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notifications"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([dateGroup, groupNotifs]) => (
                <div key={dateGroup}>
                  {/* Date Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-medium text-gray-500">{dateGroup}</h2>
                    {groupNotifs.some((n) => !n.isRead) && (
                      <button
                        onClick={() => handleMarkAllAsRead(groupNotifs)}
                        className="text-sm text-mainPrimary hover:text-red-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-3">
                    {groupNotifs.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        className={`p-4 rounded-xl transition-all cursor-pointer border ${
                          !notification.isRead 
                            ? "bg-blue-50/30 border-blue-100 hover:bg-blue-50/50" 
                            : "bg-gray-50/50 border-gray-100 hover:bg-gray-100/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-gray-900 text-base">
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
