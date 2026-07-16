import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllNotifications, markAsRead, markAllAsRead } from "../../../services/notification";

// Thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllNotifications();
      console.log("Fetched notifications:", res?.data?.data);
      return res?.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await markAsRead(id);
      return id;
    } catch (err) {
      dispatch(fetchNotifications()); // rollback agar API fail ho
      return rejectWithValue(err.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (ids, { dispatch, rejectWithValue }) => {
    try {
      await markAllAsRead(ids);
      return ids;
    } catch (err) {
      dispatch(fetchNotifications()); // rollback
      return rejectWithValue(err.message);
    }
  }
);

const notificationInitialState = {
  items: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: notificationInitialState,
  reducers: {
    NotificationReceived: (state, action) => {
      if (action.payload) {
        state.items.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.pending, (state, action) => {
        const id = action.meta.arg;
        const notif = state.items.find((n) => n.id === id);
        if (notif) notif.isRead = true;
      })
      .addCase(markAllNotificationsAsRead.pending, (state, action) => {
        const ids = action.meta.arg;
        state.items.forEach((n) => {
          if (ids.includes(n.id)) n.isRead = true;
        });
      });
  },
});

export const { NotificationReceived } = notificationSlice.actions;

// Selectors
export const getNotifications = (state) => state.notifications.items;
export const getUnreadCount = (state) =>
  state.notifications.items.filter((n) => !n.isRead).length;
export const getNotificationsLoading = (state) => state.notifications.loading;

export default notificationSlice.reducer;