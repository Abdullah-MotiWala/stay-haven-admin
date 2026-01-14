import { createSlice } from "@reduxjs/toolkit";



const selfUserInitialState = {
  id: "",
  contactNumber: "",
  name: "string",
  isActive: false,
  email: "",
  profileImage: "",
  userType: {
    id: 0,
    key: ""
  },
  roles: []
};
const initialState= { login: false, token: "", selfUser: selfUserInitialState };

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    Authenticate: (state, payload) => {
      state.login = true;
      state.token = payload.payload.token;
    },
    SelfUser: (state, payload) => {
      state.login = true;
      state.selfUser = payload.payload;
    },
    Logout: state => {
      state.login = false;
      state.token = "";
      state.selfUser = selfUserInitialState;
    }
  }
});

export const { Authenticate, Logout, SelfUser } = userSlice.actions;
export const getUserDetails = (state) => state.user.selfUser;

export default userSlice.reducer;
