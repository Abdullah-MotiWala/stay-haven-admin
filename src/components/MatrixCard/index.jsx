import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { DEFAULT_IMAGE } from "../../shared/constant";
import { MatrixCardSkeleton } from "../shared/skeletons";

const MatrixCard = ({ data = [], loading = false, showShadow, showshadow, icon, ...rest }) => {
  if (loading) return <MatrixCardSkeleton />;

  return (
    <div className="w-full bg-white p-3 sm:p-4 rounded-3xl shadow-sm mb-6 overflow-hidden">
      <div
        className={`grid gap-3 ${
          data.length === 5
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            : data.length === 4
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {Array.isArray(data) && data.map((card, i) => (
          <div
            key={i}
            className="relative p-3 sm:p-4 rounded-2xl flex flex-col justify-between min-h-[110px] sm:min-h-[130px]"
            style={{ backgroundColor: card.bg || "#F3F7EE" }}
          >
            {/* Title + Icon row */}
            <div className="flex justify-between items-start gap-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 leading-tight flex-1 min-w-0">
                {card.title}
              </p>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.iconBg || "#D1E1BC" }}
              >
                <img
                  src={card.image ?? DEFAULT_IMAGE}
                  alt={card.title}
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              </div>
            </div>

            {/* Value + trend row */}
            <div className="mt-2 sm:mt-3 flex items-end justify-between gap-1">
              <h3
                className={`font-bold text-gray-900 leading-none break-all ${
                  String(card.value ?? "").length > 8
                    ? "text-base sm:text-lg"
                    : "text-2xl sm:text-3xl"
                }`}
              >
                {card.value ?? "—"}
              </h3>

              {card.showTrend && card.trend && (
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span
                    className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                      String(card.trend).startsWith("-")
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {String(card.trend).startsWith("-") ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowUpOutlined />
                    )}
                    {card.trend}
                  </span>
                  {card.trendText && (
                    <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
                      {card.trendText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrixCard;