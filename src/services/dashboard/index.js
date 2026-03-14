import Api from "../../network/axiosClients";

export const getStats = async () => {
  return Api.get("dashboard/stats");
};

export const getBookingStatistics = async () => {
  return Api.get("dashboard/booking-statistics");
};

export const getRoomsAvailability = async () => {
  return Api.get("dashboard/room-availability");
};

export const getApartmentAvailability = async () => {
  return Api.get("dashboard/apartment-availability");
};

export const getBookingStatus = async () => {
  return Api.get("dashboard/booking-status");
};

export const getCustomers = async () => {
  return Api.get("dashboard/customers");
};

export const getRecentBookings = async (id) => {
  return Api.get("bookings/recent",id);
};

export const getOpenTickets = async () => {
  return Api.get("dashboard/open-tickets");
};

export const updateTicketStatus = async (ticketId, status) => {
  console.log("API HIT →", { ticketId, status });
  await Api.patch(`/tickets/${ticketId}/status`, { status });
};
