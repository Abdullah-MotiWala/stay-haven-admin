import { createSlice } from "@reduxjs/toolkit";



const selfUserInitialState = {};
const initialState= { chatRoom: selfUserInitialState };

const chatSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    CreateRoom: (state, payload) => {
      state.chatRoom = payload.payload;
    }
  }
});

export const { CreateRoom } = chatSlice.actions;
export const getRoomDetails = (state) => state.chatSlice.chatRoom
;

export default chatSlice.reducer;
