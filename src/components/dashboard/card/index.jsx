const Card = ({ title, right, children , height }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]  flex flex-col ${height ? 'h-full' : ''}`} style={{ height }}>
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold">{title}</h3>
      {right}
    </div>
    <div className="flex-1 min-h-0">
      {children}
    </div>
  </div>
);

export default Card;