// utils/auth.js
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const isAdmin = () => {
  return localStorage.getItem("userType") === "admin";
};
