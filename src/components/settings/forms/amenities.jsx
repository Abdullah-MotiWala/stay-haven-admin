import { Form, Checkbox, Input, Button } from "antd";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";

const AMENITIES = [
  "Free Wifi",
  "Parking",
  "Breakfast",
  "Swimming Pool",
  "Gym",
  "Restaurant",
];

const Amenities = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Amenities</h3>

      <h3 className="text-lg font-semibold mb-4">
        Select all amenities available at your hotel
      </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-6 mt-6">
  {AMENITIES.map((item, i) => {
    return (
      <div
        key={i}
        className="flex justify-between max-w-64"
      >

        <p className="text-base text-lightSeconday px-2 py-1">{item}</p>

        <img
          src={deleteIcon}
          alt="delete"
          className="bg-lightRed rounded-lg px-2  cursor-pointer"
        />
      </div>
    );
  })}
</div>



    </div>
  );
};

export default Amenities;
