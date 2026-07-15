import React, { useState, useEffect } from 'react';
import Api from '../network/axiosClients';
import TicketTable from "./ticketTable";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [statusFilter, setStatusFilter] = useState("All Tickets"); // Status state

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Backend controller 'getAll' query params accept karta hai
      // const response = await Api.get("http://api.stayhaven.pk/api/tickets", {
      const response = await Api.get("tickets", {
        params: { 
          search: searchTerm, 
          status: statusFilter 
        }
      });
      const data = response.data?.data;
      if (Array.isArray(data)) {
        setTickets(data);
      } else if (response.data?.success !== false) {
        setTickets(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Fetch Problem:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jab bhi search ya filter change ho, data dobara laye
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTickets();
    }, 500); // 500ms delay taake har word par request na jaye (Debouncing)

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter]);

  return (
    <div className="h-screen">
      <TicketTable 
        tickets={tickets} 
        setSearchTerm={setSearchTerm} 
        setStatusFilter={setStatusFilter}
        loading={loading}
      />
    </div>
  );
};

export default TicketsPage;