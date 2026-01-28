export const DEFAULT_IMAGE = "https://placehold.net/default.png";
export const BASE_HOTEL_CODE = 301;
export const ENTIRES_PER_PAGE_OPTION = [10, 20, 30, 40];

export const APPARTMENT_TYPES = [
  "All Apartments",
  "Single Bed",
  "Double Bed",
  "Three Bed",
  "Luxury Suites",
];
export const TABS = [
  "General Settings",
  "Amenities",
  "Booking Features",
  "Booking Policies",
  "Pricing & Taxes",
];

export const ROOM_TYPES = [
  "All Rooms",
  "one Bed Room",
  "two Bed Room",
  "Three Bed Room",
  "Luxury Suites",
];

export const PAGE_CONFIG = {
  "/admin/rooms": {
    buttonText: "Add New Room",
    navigateTo: "/admin/rooms/add",
  },
  "/admin/appartments": {
    buttonText: "Add New Appartment",
    navigateTo: "/admin/appartments/add",
  },
  "/admin/hotels": {
    buttonText: "Add New Hotel",
    navigateTo: "/admin/hotel/add",
  },
  "/admin/bookings": {
    buttonText: "Add New Booking",
    navigateTo: "/admin/booking/add",
  },
};

export const STETPS_FIELDS = {
  0: [
    "name",
    "roomNumber",
    "hotel",
    "roomType",
    "bedType",
    "roomSize",
    "guests",
    "childrens",
    "description",
    "pricePerNight",
    "status",
  ],
  1: ["features", "amenities", "facility"],
};

export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};
export const DISPUTE_TYPES = [
  { label: "General", value: "general" },
  { label: "Session", value: "session" },
];

export const PRIORITIES = [
  { label: "High", value: "High" },
  { label: "Mid", value: "Mid" },
  { label: "Low", value: "Low" },
];

export const STATUSES = [
  { label: "Pending", value: "Pending" },
  { label: "In Process", value: "In Process" },
  { label: "Resolved", value: "Resolved" },
  { label: "Escalated", value: "Escalated" },
  { label: "Closed", value: "Closed" },
];

export const SideBarMenuList = [
  {
    id: 1,
    to: "/dashboard",
    label: "Dashboard",
    langLabel: "Dashboard",
    permission: "Dashboard",
    icon: "Test",
  },
  {
    id: 2,
    to: "/user",
    label: "Users",
    langLabel: "users",
    icon: "Test",
  },
];
