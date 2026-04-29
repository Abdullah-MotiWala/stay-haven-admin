import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { DEFAULT_IMAGE } from "../../shared/constant";
import { MatrixCardSkeleton } from "../shared/skeletons";

// Accept old props (showShadow, showshadow, icon) so callers don't break
const MatrixCard = ({ data = [], loading = false, showShadow, showshadow, icon, ...rest }) => {
  if (loading) return <MatrixCardSkeleton />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-white p-5 rounded-3xl shadow-sm">
      {Array.isArray(data) && data.map((card, i) => (
        <div
          key={i}
          className="relative p-5 rounded-2xl flex flex-col justify-between min-h-[120px]"
          style={{ backgroundColor: card.bg || "#F3F7EE" }}
        >
          {/* Title + Icon row */}
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600 leading-tight pr-8">
              {card.title}
            </p>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: card.iconBg || "#D1E1BC" }}
            >
              <img
                src={card.image ?? DEFAULT_IMAGE}
                alt={card.title}
                className="w-5 h-5 object-contain"
              />
            </div>
          </div>

          {/* Value + trend row */}
          <div className="mt-3 flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900 leading-none">
              {card.value ?? "—"}
            </h3>

            {card.showTrend && card.trend && (
              <div className="flex flex-col items-end gap-0.5">
                <span
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
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
                  <span className="text-[10px] text-gray-400 font-medium">
                    {card.trendText}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatrixCard;
