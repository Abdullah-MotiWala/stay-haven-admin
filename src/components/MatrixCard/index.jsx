import { ArrowUpOutlined, HomeOutlined } from "@ant-design/icons";

const MatrixCard = ({ showShadow = true, data = [] }) => {
console.log("MatrixCard data:", data);

  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        gap-6 mb-8 bg-white p-6 rounded-3xl
        ${showShadow ? "shadow-sm" : ""}
      `}
    >
      {Array.isArray(data) && data?.map((card, i) => (
        <div
          key={i}
          className={`relative p-6 pb-4 rounded-3xl ${
            showShadow ? "shadow-sm" : ""
          }`}
          style={{ backgroundColor: card.bg }}
        >
          {/* Icon */}
          {/* <div
            className="absolute top-4 right-4 p-2 rounded-lg"
            style={{ backgroundColor: card.iconBg }}
          >
            <HomeOutlined className="text-base text-dark" />
          </div> */}
          <div
            className="absolute top-4 right-4 p-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: card.iconBg }}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-5 h-5 object-contain"
            />
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-gray-700">{card.title}</p>

          {/* Value */}
          <div className="flex justify-between items-end mt-2 h-full ">
            <h3 className="text-5xl font-semibold  position-relative bottom-8 ">
              {card.value.toString().padStart(2, "0")}
            </h3>

            {/* Trend (only first card) */}
            {card.showTrend && (
              <div className="flex flex-col items-center gap-2 mt-8 mb-4 text-sm">
                <span className="flex items-center gap-1 text-lightGreen px-3 py-1 rounded-full bg-extraLightGreen   font-medium">
                  <ArrowUpOutlined />
                  {card.trend}
                </span>
                <span className="font-medium">{card.trendText}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatrixCard;
