import React from "react";
import { RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { ConfigProvider } from "antd";
import appRoutes from "./routes"; 
import AppLoader from "./components/shared/appLoader/index";
import { getLoadStatus, getTotalRequest } from "./redux/features/loader"; 
// Path check karein: Agar App.js src mein hai to "./assets/..." use karein
import bgImage from "./assets/images/background.png"; 

function App() {
  const loading = useSelector(getLoadStatus);
  const totalRequest = useSelector(getTotalRequest);

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
      <div
        className="App"
       
      >
        {loading < totalRequest && <AppLoader />}
        
        {/* Router Provider */}
        <div className="relative z-10 w-full min-h-screen">
            <RouterProvider router={appRoutes} />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;