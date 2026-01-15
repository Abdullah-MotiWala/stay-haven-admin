import React from 'react';
import RoomColumns from '../../../components/roomColumn';
const AddRooms = () => {
       
    const featureList = [
          { id: 'spacious', label: 'Spacious layout' },
          { id: 'balcony', label: 'Private balcony' },
          { id: 'stay', label: 'Comfortable stay' },
          { id: 'workspace', label: 'Dedicated workspace' },
          { id: 'water', label: 'Cold/Warm water' },
          { id: 'lunch', label: 'Lunch/Dinner' },
      ];
  
      const amenityList = [
          { id: 'Free Wifi', label: 'Free Wifi' },
          { id: 'Pool', label: 'Pool' },
          { id: 'Parking', label: 'Parking' },
          { id: 'Pool', label: 'Pool' },
          { id: 'Breakfast', label: 'Breakfast' },
          { id: 'Cold/Warm water', label: 'Cold/Warm water' },
          { id: 'Lunch/Dinner', label: 'Lunch/Dinner' },
          { id: 'Cold/Warm water', label: 'Cold/Warm water' },
  
      ]
  
      const facilitiesList = [
          { id: 'Hot & Cold Water', label: 'Hot & Cold Water' },
          { id: 'Clean Linen & Towels', label: 'Clean Linen & Towels' },
          { id: 'Luxury Toilet', label: 'Luxury Toilet' },
          { id: 'Hair Dryer', label: 'Hair Dryer' },
          { id: 'Shower Area', label: 'Shower Area' },
          { id: 'Proper Ventilation', label: 'Proper Ventilation' },
          { id: 'Mirror & Vanity Area', label: 'Mirror & Vanity Area' },
          { id: 'Bedside Switches', label: 'Bedside Switches' },
  
      ]
    return (
    <> 
    <RoomColumns feature={featureList} amenity={amenityList} facilities={facilitiesList} />
    </>
  );
};
export default AddRooms;