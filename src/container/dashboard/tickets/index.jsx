import Breadcrumb from "../../../components/Breadcrumb"
import TicketTable from "../../../components/ticketTable"
const Ticket = ()=>{
    const tickets = [
    { id: '#321-01', userName: 'Sara Khalid', subject: 'Payment failed during checkout', date: '30 July 2025', status: 'Open', lastUpdate: '1 hour ago' },
    { id: '#321-01', userName: 'Muhammad Ali Akbar', subject: 'In publishing and graphic design, Lorem ipsum is a placeholder text', date: '30 July 2025', status: 'Closed', lastUpdate: '1 hour ago' },
    { id: '#321-01', userName: 'Sara Khalid', subject: 'Booking confirmation not received', date: '30 July 2025', status: 'Closed', lastUpdate: '1 hour ago' },
  ];
    return(<>
    <Breadcrumb title="Tickets"/>
    <TicketTable tickets={tickets}/>
    </>)
}
export default Ticket;