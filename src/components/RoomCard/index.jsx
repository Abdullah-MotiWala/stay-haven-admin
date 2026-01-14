import React from 'react';
import { Card, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const RoomCard = ({ name, price, image, capacity, description, onViewDetails }) => {
  return (
    <Card
      hoverable
      cover={<img alt={name} src={image} className="h-56 object-cover" />}
      className="rounded-xl overflow-hidden shadow-md border-none"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <Tag color="blue" className="m-0 font-bold px-3">${price}/night</Tag>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center border-t pt-4">
        <span className="text-gray-400 text-xs font-medium">
          <UserOutlined className="mr-1" /> {capacity} Guests
        </span>
        <Button 
          type="primary" 
          size="small" 
          onClick={onViewDetails}
          className="rounded-md font-semibold"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default RoomCard;