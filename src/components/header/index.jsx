import React from 'react';
import { Input, Button, Badge, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  SearchOutlined, 
  BellOutlined, 
  AudioOutlined, 
  MoonOutlined, 
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';

const Header = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Admin";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="flex justify-between items-center bg-transparent py-4">
      <Input 
        placeholder="Search" 
        prefix={<SearchOutlined className="text-gray-400" />} 
        className="w-1/3 rounded-mdborder-none h-11 shadow-sm"
      />

      <div className="flex items-center gap-6">
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 text-gray-600">
          <CalendarOutlined />
          <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        <div className="flex gap-3 items-center">
          <Avatar icon={<MoonOutlined />} className="bg-white text-black shadow-sm cursor-pointer hover:bg-gray-50" />
          <Avatar icon={<AudioOutlined />} className="bg-white text-black shadow-sm cursor-pointer hover:bg-gray-50" />
          <Badge count={0} size="small" offset={[-2, 5]}>
            <Avatar icon={<BellOutlined />} className="bg-white text-black shadow-sm cursor-pointer hover:bg-gray-50" />
          </Badge>
          <div
            className="ml-2 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/admin/profile")}
            title="My Profile"
          >
            <Avatar
              icon={<UserOutlined />}
              className="border-2 border-white shadow-sm bg-blue text-white"
            >
              {initial}
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;