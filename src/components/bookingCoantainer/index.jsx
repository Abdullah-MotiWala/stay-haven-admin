const BookingContainer = ({ title, children }) => (
  <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm w-full mb-6">
    <div className="border-b border-gray-100 pb-4 mb-8">
      <h3 className="text-dark font-semibold text-lg">{title}</h3>
    </div>
    {children}
  </div>
);

export default BookingContainer;