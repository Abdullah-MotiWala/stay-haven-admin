import React from 'react';
import { Form, Input, Select, Checkbox, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const HotelForm = () => (
  <div className="p-8 bg-white rounded-3xl shadow-sm max-w-5xl mx-auto mt-10">
    <h2 className="text-2xl font-bold mb-8">Add / Edit Hotel</h2>
    <Form layout="vertical">
      <div className="grid grid-cols-2 gap-x-8">
        <Form.Item label="Hotel Name" name="hotelName">
          <Input placeholder="Enter hotel name" className="h-12 rounded-xl" />
        </Form.Item>
        <Form.Item label="Location" name="location">
          <Select placeholder="Select City" className="h-12 rounded-xl" />
        </Form.Item>
      </div>
      
      <Form.Item label="Amenities">
        <Checkbox.Group className="grid grid-cols-4 gap-4">
          <Checkbox value="wifi">Free Wifi</Checkbox>
          <Checkbox value="pool">Pool</Checkbox>
          <Checkbox value="parking">Parking</Checkbox>
          <Checkbox value="gym">Gym</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item label="Upload Hotel Image">
        <Upload.Dragger className="rounded-2xl">
          <p className="ant-upload-drag-icon"><UploadOutlined /></p>
          <p>Click or drag image to upload</p>
        </Upload.Dragger>
      </Form.Item>

      <div className="flex justify-end gap-4 mt-8">
        <Button className="h-12 px-8 rounded-xl">Cancel</Button>
        <Button type="primary" className="h-12 px-8 rounded-xl bg-blue-600">Save Changes</Button>
      </div>
    </Form>
  </div>
);
export default HotelForm;