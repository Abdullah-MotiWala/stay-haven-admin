import Api from "../../network/axiosClients";

// Admin Notification APIs
export const getAllNotifications = async () => {
  return Api.get("/notifications");
};

export const markAsRead = async (id) => {
  return Api.patch(`/notifications/${id}/read`);
};

// Note: Backend doesn't have mark-all-read for admin, so we'll mark individually
export const markAllAsRead = async (notificationIds) => {
  return Promise.all(notificationIds.map(id => markAsRead(id)));
};

// Note: Backend doesn't have delete/clear endpoints for admin notifications
export const deleteNotification = async (id) => {
  console.warn("Delete not supported for admin notifications");
  return Promise.resolve();
};

export const clearAllNotifications = async () => {
  console.warn("Clear all not supported for admin notifications");
  return Promise.resolve();
};

// Note: Backend doesn't have unread count endpoint, we'll calculate on frontend
export const getUnreadCount = async () => {
  const res = await getAllNotifications();
  const unreadCount = (res?.data?.data || []).filter(n => !n.isRead).length;
  return { data: { data: { count: unreadCount } } };
};

// FCM token save (if needed later)
export const saveFcmToken = async (token) => {
  return Api.post("/notifications/fcm-token", { token });
};
