import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      const response = await axios.get("http://api.stayhaven.pk/api/tickets", {
        params: { 
          search: searchTerm, 
          status: statusFilter 
        }
      });
      if (response.data.success) {
        setTickets(response.data.data);
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
    <div className=" min-h-screen">
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