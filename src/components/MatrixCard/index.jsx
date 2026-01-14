import { HomeOutlined } from "@ant-design/icons";

const MatrixCard = ({
  showShadow = true,
  icon: Icon = HomeOutlined,
}) => {
  const colors = ["#F3F7EE", "#EFF9FF", "#F7EFFF", "#F3F4FB"];
  const iconcolors = ["#D1E1BC", "#C7DAE7", "#DED0EC", "#CBCEE7"];

  const cards = [
    "Total Hotels",
    "Ative Hotel",
    "Booked",
    "Under Maintenance",
  ];

  return (
    <div
      className={`
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-6 
        mb-8 
        bg-white 
        p-6 
        rounded-3xl
        ${showShadow ? "shadow-sm" : ""}
      `}
    >
      {cards.map((item, i) => (
        <div
          key={i}
          className={`relative p-6 pb-3 rounded-3xl ${
            showShadow ? "shadow-sm" : ""
          }`}
          style={{ backgroundColor: colors[i] }}
        >
          {/* Icon – Top Right */}
          <div
            style={{ backgroundColor: iconcolors[i] }}
            className="absolute top-4 right-4 p-1 rounded-lg"
          >
            <Icon className="text-lg" />
          </div>

          {/* Content */}
          <p className="text-dark text-bold text-sm">{item}</p>
          <h3 className="text-3xl font-bold mt-4">24</h3>
        </div>
      ))}
    </div>
  );
};

export default MatrixCard;
