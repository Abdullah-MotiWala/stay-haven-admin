import React from 'react';
import RoomColumns from '../../../components/roomColumn';
const AddRooms = () => {
       
    // const featureList = [
    //       { id: 'spacious', label: 'Spacious layout' },
    //       { id: 'balcony', label: 'Private balcony' },
    //       { id: 'stay', label: 'Comfortable stay' },
    //       { id: 'workspace', label: 'Dedicated workspace' },
    //       { id: 'water', label: 'Cold/Warm water' },
    //       { id: 'lunch', label: 'Lunch/Dinner' },
    //   ];
  
    //   const amenityList = [
    //       { id: 'Free Wifi', label: 'Free Wifi' },
    //       { id: 'Pool', label: 'Pool' },
    //       { id: 'Parking', label: 'Parking' },
    //       { id: 'Pool', label: 'Pool' },
    //       { id: 'Breakfast', label: 'Breakfast' },
    //       { id: 'Cold/Warm water', label: 'Cold/Warm water' },
    //       { id: 'Lunch/Dinner', label: 'Lunch/Dinner' },
    //       { id: 'Cold/Warm water', label: 'Cold/Warm water' },
  
    //   ]
  
    //   const facilitiesList = [
    //       { id: 'Hot & Cold Water', label: 'Hot & Cold Water' },
    //       { id: 'Clean Linen & Towels', label: 'Clean Linen & Towels' },
    //       { id: 'Luxury Toilet', label: 'Luxury Toilet' },
    //       { id: 'Hair Dryer', label: 'Hair Dryer' },
    //       { id: 'Shower Area', label: 'Shower Area' },
    //       { id: 'Proper Ventilation', label: 'Proper Ventilation' },
    //       { id: 'Mirror & Vanity Area', label: 'Mirror & Vanity Area' },
    //       { id: 'Bedside Switches', label: 'Bedside Switches' },
  
    //   ]
    //         const navigate = useNavigate();
    //         const { id } = useParams();
    //             const isEditMode = Boolean(id);
    //    const handleSubmit = async (values) => {
    //       // setLoading(true);
      
    //       const payload = {
    //         name: values.name,
    //         roomNumber: values.room_number,
    //         select_hotel: values.select_hotel,
    //         type: values.room_type,
    //         bed_type: values.bed_type,
    //         size: values.siza,
    //         guest: values.guest,
    //         childrens: values.childrens,
    //         description: values.description,
    //         status: values.status,
    //         price: values.price,
    //         status: values.status
    //         // featureIds: [...values.amenities, ...values.rooms],
    //       };
      
    //       console.log(payload, "payloadpayloadpayload");
    //       try {
    //         if (isEditMode) {
    //           await updateRoom(id, payload);
    //           openNotification("success", "Hotel updated successfully");
    //         } else {
    //           await createRoom(payload);
    //           openNotification("success", "Hotel created successfully");
    //         }
      
    //         setIsModalOpen(true);
    //       } catch (err) {
    //         openNotification("error", "Internal Server Error");
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    return (
    <> 
    <RoomColumns  />
    </>
  );
};
export default AddRooms;