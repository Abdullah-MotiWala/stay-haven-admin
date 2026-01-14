import React from 'react';
import { Tag, Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import MatrixCard from '../../../components/MatrixCard';
import Table from "../../../components/Table"
import Breadcrumb from '../../../components/Breadcrumb';
const HotelsListing = () => {
 const columns = [
    { title: 'Hotel Name', dataIndex: 'name', key: 'name', render: (text) => <span className="font-semibold">{text}</span> },
    { title: 'Rooms', dataIndex: 'rooms', key: 'rooms' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (
      <Tag color={status === 'Active' ? 'green' : 'red'} className="rounded-full px-4">{status}</Tag>
    )},
    { title: 'Actions', key: 'action', render: () => <Button type="text">...</Button> },
  ];
    const navigate = useNavigate();

  

  return (
   
    <div className="p-6 bg-[#F4F7FE] min-h-screen">
     <Navbar/>  
       <Breadcrumb title="Hotels" />
     <MatrixCard />

      {/* Figma Frame 7: Table & Filters */}
      <div className="bg-white p-8 rounded-3xl shadow-sm">
       <Table/>
      </div>
    </div>
  );
};
export default HotelsListing;