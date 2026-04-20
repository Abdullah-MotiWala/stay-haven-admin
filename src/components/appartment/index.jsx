import { useState, useEffect } from "react";
import ApparmentCard from "./appartmentCard";
import AppartmentDetail from "./appartmentDetail";
import filter from "../../assets/icons/filter.png";
import MatrixCard from "../MatrixCard";
import home from "../../assets/icons/home.png";
import searchImg from "../../assets/icons/search.svg";
import right_arrow from "../../assets/icons/rightArrow.svg";
import { Pagination, ConfigProvider, Input, Select } from "antd";
import {
  getAllApartments,
  getStats,
  deleteAppartment,
  getBedType,
  updateApartmentStatus,
} from "../../services/appartments";
import home1 from "../../assets/icons/home-1.png";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/icons/home-3.png";
import home4 from "../../assets/icons/home-4.png";
import { openNotification } from "../../network/notification";
import { APPARTMENT_TYPES, ENTIRES_PER_PAGE_OPTION } from "../../shared/constant";
import StatusReasonModal, { needsReason } from "../shared/statusReasonModal";

export default function Appartments() {
  const [activeType, setActiveType] = useState(APPARTMENT_TYPES[0]); const [selectedAppartment, setSelectedAppartment] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const [appartmentData, setAppartmentsData] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [status, setStatus] = useState(null);
  const [reasonModal, setReasonModal] = useState({ open: false, id: null, status: "" });
  const [reason, setReason] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { Option } = Select;

  const fetchData = async () => {
    try {
      let res;

      if (activeType.typeId === null) {
        // All apartments
        res = await getAllApartments(
          currentPage,
          itemsPerPage,
          status,
          search,
          sort
        );
      } else {
        // Filter by type
        res = await getBedType(activeType.typeId);
      }

      setAppartmentsData(res?.data);

      if (res?.data?.data?.length > 0) {
        setSelectedAppartment(res.data.data[0]);
      }
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, search, activeType]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res?.data?.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };

    fetchStats();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    if (needsReason(newStatus)) {
      setReasonModal({ open: true, id, status: newStatus });
    } else {
      applyApartmentStatus(id, newStatus, "");
    }
  };

  const applyApartmentStatus = async (id, newStatus, reasonText) => {
    setStatusUpdating(true);
    try {
      await updateApartmentStatus(id, newStatus, reasonText);
      openNotification("success", "Status updated");
      fetchData();
    } catch {
      openNotification("error", "Failed to update status");
    } finally {
      setStatusUpdating(false);
      setReasonModal({ open: false, id: null, status: "" });
      setReason("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteAppartment(id);
        setAppartmentsData(
          appartmentData?.data.filter((appart) => appart.id !== id),
        );
        openNotification("success", "Hotel deleted successfully");
      } catch (err) {
        console.error("Any Problem in deleteing", err);
        openNotification("error", "Internal Server Error");
      }
    }
  };


  const cardsData = [
    {
      title: "Total appartments",
      value: stats?.totalApartments,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: `${stats?.occupancyRate ?? 0}`,
      trendText: "vs last week",
      showTrend: true,
    },
    {
      title: "Available",
      value: stats?.availableApartments,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: home2,
    },
    {
      title: "Occupied",
      value: stats?.rentedApartments,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: home3,
    },
    {
      title: "Maintenance",
      value: stats?.maintenanceApartments,
      bg: "#F3F4FB",
      iconBg: "#CBCEE7",
      image: home4,
    },
  ];

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };
  return (
    <>
      <MatrixCard showshadow="true" data={cardsData} icon={home} />

      <div className="p-0 ml-3 gap-[2px] flex flex-wrap  item-center rounded-lg">
        {APPARTMENT_TYPES.map((type, index) => (
          <button
            key={type.label}
            onClick={() => setActiveType(type)}
            className={`
        px-2 py-2 text-sm font-medium whitespace-nowrap
        transition-colors duration-200 rounded-0 m-0 
        
        ${activeType === type
                ? "bg-blue text-white"
                : "bg-white text-extradark hover:bg-gray-50"
              }
        ${index === 0 ? "" : ""}
        ${index === APPARTMENT_TYPES.length - 1 ? "" : ""}
      `}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 bg-white min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-[#000000] text-lg">
              All Appartments ({appartmentData?.meta?.totalItems ?? appartmentData?.data?.length ?? 0})
            </h2>
            <div className="flex justify-between items-center bg-white ">
              <div className="max-w-96">
                <Input
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  prefix={<img src={searchImg} className="w-4 h-4" />}
                  className="w-full p-2 border border-lightSeconday rounded-xl font-medium"
                />
              </div>

              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`border px-2 py-2  text-sm transition-all flex items-center gap-2 rounded-lg`}
              >
                <img src={filter} alt="filter" className="w-4 h-4" />
              </button>
            </div>

            {showFilter && (
              <div className="bg-white p-3 rounded-xlg shadow-md border border-lightSeconday animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-[18px] font-medium">Apply Filter</h3>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-2 py-2">  
                                  <div className="bg-green-400 flex flex-col sm:flex-row flex-wrap gap-3 w-full">
                  <Select
                    className="w-72 h-12 border border-lightSeconday rounded-lg font-medium"
                    defaultValue="sort"
                    onChange={(value) => setSort(value)}
                    suffixIcon={<img src={right_arrow} alt="" />}
                  >
                    <Option value="sort" disabled>
                      Sort by hotel name
                    </Option>

                    <Option value="ASC">A → Z</Option>
                    <Option value="DESC">Z → A</Option>
                  </Select>
                  <Select
                    className="w-72 h-12 border border-lightSeconday rounded-lg font-medium"
                    defaultValue="sort"
                    onChange={(value) => setStatus(value)}
                    suffixIcon={<img src={right_arrow} alt="" />}
                  >
                    <Option value="sort" disabled>
                      Sort by Staus
                    </Option>

                    <Option value="available">Available</Option>
                    <Option value="occupied">Occupied</Option>
                  </Select>
                </div>
                  <button
                    onClick={() => fetchData()}
                    className="bg-blue hover:bg-blue text-white px-2 py-2.5 w-36 rounded-md font-semibold transition-all text-sm h-11"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            <div>
              <div className="space-y-4">
                {appartmentData?.data?.length > 0 ? (
                  appartmentData.data.map((appart) => (
                    <ApparmentCard
                      key={appart.id}
                      data={appart}
                      active={selectedAppartment?.id === appart.id}
                      onClick={() => setSelectedAppartment(appart)}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-10">
                    No data found
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <Select
                    defaultValue={10}
                    className="text-black"
                    onChange={(value) => setItemsPerPage(value)}
                    options={ENTIRES_PER_PAGE_OPTION.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                  <span className="text-lightSeconday ml-4">
                    Entries per page
                  </span>
                </div>

                <Pagination
                  current={currentPage}
                  total={appartmentData?.meta?.totalItems || 0}
                  pageSize={itemsPerPage}
                  onChange={onPageChange}
                  className="flex justify-end"
                />
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
              {!selectedAppartment ? (
                <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    Select a appartment to see details
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Click on any card from the list
                  </p>
                </div>
              ) : (
                <AppartmentDetail data={selectedAppartment} />
              )}
            </div>
          </div>
        </div>
      </div>
      <StatusReasonModal
        open={reasonModal.open}
        status={reasonModal.status}
        reason={reason}
        onChange={setReason}
        onConfirm={() => applyApartmentStatus(reasonModal.id, reasonModal.status, reason)}
        onCancel={() => { setReasonModal({ open: false, id: null, status: "" }); setReason(""); }}
        loading={statusUpdating}
      />
    </>
  );
}
