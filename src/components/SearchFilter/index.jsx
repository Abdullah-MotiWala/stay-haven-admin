import React from 'react';
import { Form, DatePicker, Select, Button, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchFilter = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-30">
      <Card className="shadow-2xl rounded-2xl border-none p-2">
        <Form layout="vertical">
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} lg={10}>
              <Form.Item label={<span className="font-semibold text-gray-600">Check-in / Check-out</span>} className="mb-0">
                <RangePicker className="w-full h-12 rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={7}>
              <Form.Item label={<span className="font-semibold text-gray-600">Room Type</span>} className="mb-0">
                <Select placeholder="All Rooms" className="h-12 w-full" size="large">
                  <Option value="single">Single Room</Option>
                  <Option value="double">Double Room</Option>
                  <Option value="suite">Executive Suite</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={7}>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                size="large" 
                block 
                className="h-12 font-bold text-lg rounded-lg shadow-lg"
              >
                Find Rooms
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default SearchFilter;