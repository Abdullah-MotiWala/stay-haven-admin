import Api from "../../network/axiosClients";

export const getStats = async () => {
  return Api.get("dashboard/stats");
};

export const getBookingStatistics = async () => {
  return Api.get("dashboard/booking-statistics");
};

export const getRoomsAvailability = async () => {
  return Api.get("dashboard/rooms-availability");
};

export const getBookingStatus = async () => {
  return Api.get("dashboard/booking-status");
};

export const getCustomers = async () => {
  return Api.get("dashboard/customers");
};

export const getRecentBookings = async () => {
  return Api.get("bookings/recent");
};
