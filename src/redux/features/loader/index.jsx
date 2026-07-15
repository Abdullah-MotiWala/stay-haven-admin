import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  loading: 0,
  totalRequest: 0
};

const loaderSlice = createSlice({
  name: "loading",
  initialState: initialState,
  reducers: {
    TotalRequest: state => {
      state.totalRequest = state.totalRequest + 1;
    },
    FinishLoading: state => {
      state.loading = state.loading + 1;
    },
    ResetLoading: state => {
      state.loading = 0;
      state.totalRequest = 0;
    }
  }
});

export const { TotalRequest, FinishLoading, ResetLoading } = loaderSlice.actions;

export const getLoadStatus = (state) => state.loading.loading;

export const getTotalRequest = (state) => state.loading.totalRequest;

export default loaderSlice.reducer;
