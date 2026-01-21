import React from "react"; 
import { Breadcrumb } from "antd";
import boxIcon from '../../assets/images/boxIcon.svg'

const App = ({ title, subtitle }) => {
  // Build breadcrumb items
  const breadcrumbItems = [
    {
      href: "",
      title: (
        <div className="flex items-center gap-2 cursor-pointer hover:bg-transparent">
          <img
            src={boxIcon}
            alt="dashboardIcon"
            className="w-4 h-4 !hover:bg-transparent"
          />
          <span className="text-blue font-medium !hover:bg-transparent">Dashboard</span>
        </div>
      ),
    },
    {
      href: "",
      title: <span className="text-lightSeconday font-medium !hover:bg-transparent">{title}</span>,
    },
    subtitle
      ? {
          href: "",
          title: <span className="text-gray-500 font-medium hover:bg-transparent">{subtitle}</span>,
        }
      : null, // optional subtitle
  ].filter(Boolean); // remove any nulls

  return <Breadcrumb separator="/" items={breadcrumbItems} />;
};

export default App;
