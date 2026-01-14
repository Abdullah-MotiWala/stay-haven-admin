/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createSlice } from "@reduxjs/toolkit";

export interface ISidebar {
  disable: boolean;
  reload: boolean;
}

const initialState: ISidebar = {
  disable: false,
  reload: false
};

const isSidebarSlice = createSlice({
  name: "isSidebar",
  initialState,
  reducers: {
    sidebar: (state, action) => {
      state.disable = action.payload;
    },
    reloadSidebar: state => {
      state.reload = !state.reload;
    }
  }
});

export const { sidebar, reloadSidebar } = isSidebarSlice.actions;

export default isSidebarSlice.reducer;

export const getSideBarFlag = (state) => state.isSidebar;
