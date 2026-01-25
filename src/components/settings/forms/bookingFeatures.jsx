import { Form, Checkbox, Input, Button } from "antd";
import deleteIcon from "../../../assets/icons/deleteIcon.svg";

const FEATURES = [
  "Designed with a spacious layout",
  "Private balcony",
  "Dedicated workspace for laptops",
  "Comfortable stay",
];
const FACILITY = [
  "Luxury Toilet",
  "Bedside Switches",
  "Mirror & Vanity Area",
  "Hot & Cold Water",
];

const BookingFeatures = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Booking Features</h3>

      <div className="max-w-6xl mx-auto my-20 space-y-24">
        <div>
          <h3 className="text-lg font-semibold mb-8">
            Add Features to booking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10  ">
            {FEATURES.map((item, i) => {
              return (
                <div key={i} className="flex justify-between max-w-96 ">
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
              Add Custom features{" "}
            </h3>
            <p className="text-lightText text-base font-normal">
              Add any additional features not listed above
            </p>
            <Input
              className="w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
              placeholder="Enter Custom feature"
            />
            <button
              htmlType="submit"
              className="px-8 h-12 ml-6 text-lg py-2 bg-blue text-white rounded-md"
            >
              Add in the above list
            </button>
          </div>
        </div>

        <hr />

        <div>
          <h3 className="text-lg font-semibold mb-8">
            Add Room Facilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10  ">
            {FACILITY.map((item, i) => {
              return (
                <div key={i} className="flex justify-between max-w-96 ">
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
              Add Custom facilities{" "}
            </h3>
            <p className="text-lightText text-base font-normal">
              Add any additional facilities not listed above
            </p>
            <Input
              className="w-96 h-12 p-2 border-2 border-lightSeconday rounded-md font-medium"
              placeholder="Enter Custom facilities"
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
    </div>
  );
};

export default BookingFeatures;
