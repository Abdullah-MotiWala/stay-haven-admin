import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { ConfigProvider, App as AntdApp } from "antd";
import appRoutes from "./routes"; 
import AppLoader from "./components/shared/appLoader/index";
import { getLoadStatus, getTotalRequest } from "./redux/features/loader"; 
// Path check karein: Agar App.js src mein hai to "./assets/..." use karein
import bgImage from "./assets/images/background.png"; 
import { initializeFCM, onMessageListener } from "./services/fcm";
import { openNotification } from "./network/notification";
import { saveFcmToken } from "./services/notification";
export let staticNotify = null;

const ContextGetter = () => {
  const { notification } = AntdApp.useApp();
  staticNotify = notification; // instance ko global variable mein save kar liya
  return null;
};

function App() {
  const loading = useSelector(getLoadStatus);
  const totalRequest = useSelector(getTotalRequest);

  useEffect(() => {
    // Initialize Firebase Cloud Messaging
    // Uncomment after adding VAPID key to .env
    /*
    const setupFCM = async () => {
      const token = await initializeFCM();
      if (token) {
        console.log("FCM initialized with token:", token);
        // Send token to backend to store for this user
        try {
          await saveFcmToken(token);
          console.log("FCM token saved to backend");
        } catch (err) {
          console.error("Failed to save FCM token:", err);
        }
      }
    };

    setupFCM();

    // Listen for foreground messages
    onMessageListener()
      .then((payload) => {
        console.log("Foreground notification received:", payload);
        openNotification(
          "info",
          payload.notification?.title || "New Notification",
          payload.notification?.body || ""
        );
      })
      .catch((err) => console.error("Failed to receive foreground message:", err));
    */
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      {/* Background Wrapper */}
      <AntdApp>
      <div className="App">
        <ContextGetter />
        
        {loading < totalRequest && <AppLoader />}
        
        {/* Router Provider */}
        <div className="relative z-10 w-full min-h-screen">
            <RouterProvider router={appRoutes} />
        </div>
      </div>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;