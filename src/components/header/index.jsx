import React from 'react';
import { Input, Button, Badge, Avatar } from 'antd';
// Sab se important line niche wali hai, isi mein CalendarOutlined missing tha
import { 
  SearchOutlined, 
  BellOutlined, 
  AudioOutlined, 
  MoonOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-transparent  py-4">
      {/* Figma Search Bar */}
      <Input 
        placeholder="Search" 
        prefix={<SearchOutlined className="text-gray-400" />} 
        className="w-1/3 rounded-mdborder-none h-11 shadow-sm"
      />

      <div className="flex items-center gap-6">
        {/* Figma Add Button */}
        <Button type="primary" className="bg-[#1677ff] h-11 rounded-xl px-6 font-semibold">
          Add New Hotel
        </Button>
        
        {/* Figma Date Box - Jisme error aa raha tha */}
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 text-gray-600">
          <CalendarOutlined />
          <span className="font-medium">Mon, 02 Jan 2026</span>
        </div>

        {/* Action Icons & Profile */}
        <div className="flex gap-3 items-center">
          <Avatar icon={<MoonOutlined />} className="bg-white text-black shadow-sm cursor-pointer hover:bg-gray-50" />
          <Avatar icon={<AudioOutlined />} className="bg-white text-black shadow-sm cursor-pointer hover:bg-gray-50" />
          <Badge count={3} size="small" offset={[-2, 5]}>
            <Avatar icon={<BellOutlined />} className="bg-white text-black shadow-sm cursor-pointer hover:bg-gray-50" />
          </Badge>
          <div className="ml-2 flex items-center gap-2 cursor-pointer">
            <Avatar src="https://joeschmoe.io/api/v1/random" className="border-2 border-white shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;