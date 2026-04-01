import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import Api from "../../network/axiosClients";
import Breadcrumb from "../../components/Breadcrumb";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchMessages = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await Api.get(`contact?page=${currentPage}&limit=${limit}`);
      setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotal(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch contact messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <>
      <Breadcrumb title="Contact Messages" />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Contact Messages</h2>

        {loading ? (
          <div className="flex justify-center py-16 text-gray-400">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-3 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-gray-500">No messages yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["Name", "Email", "Phone", "Message", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {messages.map((msg, i) => (
                  <tr key={msg.id || i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {msg.first_name} {msg.last_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{msg.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{msg.phone || "—"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                      <p className="truncate" title={msg.message}>{msg.message}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(msg.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > limit && (
          <div className="flex justify-end mt-6">
            <Pagination
              current={page}
              total={total}
              pageSize={limit}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ContactMessages;
