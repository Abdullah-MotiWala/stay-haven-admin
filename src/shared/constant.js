export const DEFAULT_IMAGE = "https://placehold.net/default.png";
export const BASE_HOTEL_CODE = 301;
export const ENTIRES_PER_PAGE_OPTION = [10, 20, 30, 40];

// export const APPARTMENT_TYPES = [
//   "All Apartments",
//   "Single Bed",
//   "Double Bed",
//   "Three Bed",
//   "Luxury Suites",
// ];
// export const APPARTMENT_TYPES = [
//   {
//     label: "All Apartments",
//     typeId: null
//   },
//   {
//     label: "Single Bed",
//     typeId: "412ffc48-aa5c-40d9-8d3c-ca7cb241758d"
//   },
//   {
//     label: "Double Bed",
//     typeId: "41bde207-4e47-46d8-82e1-160646a41d27"
//   },
//    {
//     label: "Three Bed",
//     typeId: "61cd60c3-b361-4714-a6a0-a2e45ef6beac"
//   },
//    {
//     label: "Luxury Suites",
//     typeId: "7610e85b-78b6-4519-9fd6-cfddd1c21a76"
//   }
// ];
export const TABS = [
  "General Settings",
  "Amenities",
  "Booking Features",
  "Booking Policies",
  "Room Rules",
  "Pricing & Taxes",
  "Change Password",
  "Social Media ",
  // "Social Links"
];

// export const ROOM_TYPES = [
//   {
//     label: "All Rooms",
//     typeId: null
//   },
//   {
//     label: "Single Bed",
//     typeId: "412ffc48-aa5c-40d9-8d3c-ca7cb241758d"
//   },
//   {
//     label: "Double Bed",
//     typeId: "41bde207-4e47-46d8-82e1-160646a41d27"
//   },
//    {
//     label: "Three Bed",
//     typeId: "61cd60c3-b361-4714-a6a0-a2e45ef6beac"
//   },
//    {
//     label: "Luxury Suites",
//     typeId: "7610e85b-78b6-4519-9fd6-cfddd1c21a76"
//   }
// ];

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
  "/admin/hosts": {
    buttonText: "Add New Host",
    navigateTo: "/admin/hosts/add",
  },
  "/admin/hostels": {
    buttonText: "Add New Hostel",
    navigateTo: "/admin/hostels/add",
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
    "maxinfants"
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
