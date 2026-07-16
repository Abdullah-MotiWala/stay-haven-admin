import { combineReducers } from "redux";
import userReducer from "./features/authSlice";
import enrollReducer from "./features/enroll";
import LoaderReducer from "./features/loader";
import chatReducer from "./features/chat";
import notificationReducer from "./features/notification";

export default combineReducers({
  enrol: enrollReducer,
  user: userReducer,
  chatSlice: chatReducer,
  loading: LoaderReducer,
  notifications: notificationReducer,
});
