const Card = ({ title, right, children }) => (
  <div className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold">{title}</h3>
      {right}
    </div>
    {children}
  </div>
);

export default Card;
