import { combineReducers } from "redux";
import userReducer from "./features/authSlice";
import  enrollReducer  from "./features/enroll";
import LoaderReducer from "./features/loader";
import chatReducer from "./features/chat";

export default combineReducers({
  enrol: enrollReducer,
  user: userReducer,
  chatSlice: chatReducer,
  loading: LoaderReducer,
});
