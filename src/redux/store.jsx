// import {  configureStore } from "@reduxjs/toolkit";
// import reduxLogger from "redux-logger";
// import rootReducer from "./rootReducer";

// const addLoggerMiddleware = (getDefaultMiddleware) => {
//     return getDefaultMiddleware().concat(reduxLogger);
// };

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: addLoggerMiddleware
// });


import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reduxLogger from "redux-logger";
import rootReducer from "./rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ["notifications"],
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const addLoggerMiddleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types for serialization check
      ignoredActions: [
        'persist/PERSIST',
        'persist/REHYDRATE',
        'persist/PAUSE',
        'persist/PURGE',
        'persist/REGISTER',
      ],
    },
  }).concat(reduxLogger);
};

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: addLoggerMiddleware,
});

// Create a persistor to handle persisting the store
export const persistor = persistStore(store);
