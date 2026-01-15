import { useState } from 'react';

const useRoomForm = () => {
  const [activeType, setActiveType] = useState("All Rooms");
  const [formData, setFormData] = useState({
    roomName: '', roomNumber: '', hotel: '', roomType: '',
    bedType: '', roomSize: '', adults: '', children: '',
    description: '', price: '', status: ''
  });

  const [mainImage, setMainImage] = useState([{ name: 'Room image.JPG', date: '22/07/2023 10:30 AM' }]);
  const [gallery, setGallery] = useState([{ name: 'Room1.JPG', date: '22/07/2023 10:30 AM' }]);

  const roomTypes = ["All Rooms", "Single Bed Room", "Double Bed Room", "Three Bed Room", "Luxury Suites"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return { activeType, setActiveType, formData, handleInputChange, mainImage, gallery, roomTypes };
};

export default useRoomForm;