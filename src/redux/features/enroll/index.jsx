import { createSlice } from "@reduxjs/toolkit";

const courseInitialState = {};
const initialState= { enrollNow: courseInitialState };

const enrolSlice = createSlice({
  name: "enrollNow",
  initialState: initialState,
  reducers: {
    EnrollNow: (state, payload) => {
      state.enrollNow = payload.payload;
    },
    RemoveEnrollNow: state => {
      state.enrollNow = courseInitialState;
    }
  }
});

export const { RemoveEnrollNow, EnrollNow } = enrolSlice.actions;
export const getEnrolDetails = (state) => state.enrol.enrollNow;

export default enrolSlice.reducer;
