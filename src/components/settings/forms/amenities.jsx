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

      <div className="max-w-6xl mx-auto my-20">
        <h3 className="text-lg font-semibold mb-8">
          Select all amenities available at your hotel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-10  ">
          {AMENITIES.map((item, i) => {
            return (
              <div key={i} className="flex justify-between max-w-64 ">
                <p className="text-base text-lightSeconday px-2 ">{item}</p>

                <img
                  src={deleteIcon}
                  alt="delete"
                  className="bg-lightRed rounded-lg px-2  cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-14">
          <h3 className="text-lg text-extradark font-semibold ">
            Add Custom Amenity{" "}
          </h3>
          <p className="text-lightText text-base font-normal">
            Add any additional amenities not listed above
          </p>
          <Input
            className="w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
            placeholder="Enter Custom Amenity"
          />
          <button
            htmlType="submit"
            className="px-8 h-12 ml-6 text-lg py-2 bg-blue text-white rounded-md"
          >
            Add in the above list
          </button>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
