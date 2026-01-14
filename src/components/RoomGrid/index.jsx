import React from 'react';
import { Row, Col } from 'antd';
import RoomCard from '../RoomCard';

const RoomGrid = ({ data, onRoomClick }) => {
  return (
    <Row gutter={[24, 32]}>
      {data.map((room) => (
        <Col xs={24} sm={12} lg={8} key={room.id}>
          <RoomCard 
            {...room} 
            onViewDetails={() => onRoomClick(room.id)} 
          />
        </Col>
      ))}
    </Row>
  );
};

export default RoomGrid;