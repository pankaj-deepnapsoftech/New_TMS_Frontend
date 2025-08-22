import { useState, useEffect } from 'react';
import { Search, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks, Trash2, Edit } from 'lucide-react';
import TicketModal from '@components/Modals/TicketsModal';
import UpdateTicketModal from '@components/Modals/UpdateTicketModal';
import { useNavigate } from 'react-router-dom';

export default function TicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterPriority, setFilterPriority] = useState('All Priorities');
  const [filterDepartment, setFilterDepartment] = useState('All Departments');
  const [deletingTicket, setDeletingTicket] = useState(null);

  const getCurrentStatus = (ticket) => {
    if (Array.isArray(ticket.status) && ticket.status.length > 0) {
      const latest = ticket.status[ticket.status.length - 1];
      return latest?.status || 'Not Started';
    }
    return 'Not Started';
  };

  // Fetch tickets from API (no userId param)
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/get`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setTickets(result.data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket function
  const handleDeleteTicket = async (ticketId, e) => {
    e.stopPropagation(); // Prevent ticket click event
    
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingTicket(ticketId);
      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/delete/${ticketId}`;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        // Remove the ticket from the local state
        setTickets(prevTickets => prevTickets.filter(ticket => ticket._id !== ticketId));
        // You can add a success notification here
        console.log('Ticket deleted successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to delete ticket');
      }
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeletingTicket(null);
    }
  };

  // Edit ticket function
  const handleEditTicket = (ticket, e) => {
    e.stopPropagation(); // Prevent ticket click event
    setSelectedTicket(ticket);
    setIsUpdateOpen(true);
  };

  // Handle ticket update
  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket._id === updatedTicket._id ? updatedTicket : ticket
      )
    );
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketCreated = () => {
    fetchTickets();
  };

  const handleTicketClick = (ticket) => {
    navigate(`/tickets/${ticket.ticket_id || ticket._id}`);
  };

  const filteredTickets = tickets.filter(ticket => {
    const idText = (ticket.ticket_id || '').toLowerCase();
    const titleText = (ticket.title || '').toLowerCase();
    const matchesSearch = idText.includes(searchTerm.toLowerCase()) || titleText.includes(searchTerm.toLowerCase());

    const statusText = getCurrentStatus(ticket);
    const matchesStatus = filterStatus === 'All Statuses' || statusText === filterStatus;
    const matchesPriority = filterPriority === 'All Priorities' || ticket.priority === filterPriority;
    const matchesDepartment = filterDepartment === 'All Departments' || ticket.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => getCurrentStatus(t) === 'Open' || getCurrentStatus(t) === 'Not Started').length,
    inProgress: tickets.filter(t => getCurrentStatus(t) === 'In Progress').length,
    resolved: tickets.filter(t => getCurrentStatus(t) === 'Resolved').length,
    overdue: tickets.filter(t => new Date(t.due_date) < new Date()).length
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
      case 'Not Started':
        return 'from-blue-100 to-blue-200 text-blue-700';
      case 'In Progress':
        return 'from-yellow-100 to-yellow-200 text-yellow-700';
      case 'Resolved':
        return 'from-green-100 to-green-200 text-green-700';
      default:
        return 'from-gray-100 to-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'from-red-100 to-red-200 text-red-700';
      case 'Medium': return 'from-yellow-100 to-yellow-200 text-yellow-700';
      case 'Low': return 'from-green-100 to-green-200 text-green-700';
      default: return 'from-gray-100 to-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Ticket Management Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Oversee, track and manage all tickets across the team in real-time.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {[
          { title: 'Total Tickets', count: stats.total, icon: <ListChecks className="text-yellow-100" size={25} />, color: 'from-yellow-400 to-yellow-600' },
          { title: 'Open', count: stats.open, icon: <AlertCircle className="text-blue-100" size={25} />, color: 'from-blue-400 to-blue-600' },
          { title: 'In Progress', count: stats.inProgress, icon: <Clock className="text-indigo-100" size={25} />, color: 'from-indigo-400 to-indigo-600' },
          { title: 'Resolved', count: stats.resolved, icon: <CheckCircle className="text-green-100" size={25} />, color: 'from-green-400 to-green-600' },
          { title: 'Overdue', count: stats.overdue, icon: <Clock className="text-red-100" size={25} />, color: 'from-red-400 to-red-600' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex items-center justify-between transform hover:scale-105 hover:shadow-xl transition-all duration-300">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h2 className="text-3xl font-extrabold text-gray-800">{stat.count}</h2>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-xl px-3 py-2 text-sm shadow-sm hover:shadow transition">
            <option>All Statuses</option>
            <option>Not Started</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border rounded-xl px-3 py-2 text-sm shadow-sm hover:shadow transition">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="border rounded-xl px-3 py-2 text-sm shadow-sm hover:shadow transition">
            <option>All Departments</option>
            <option>Development</option>
            <option>Design</option>
            <option>Support</option>
          </select>
        </div>

        <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-transform">
          <Plus size={18} /> Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || filterStatus !== 'All Statuses' || filterPriority !== 'All Priorities' || filterDepartment !== 'All Departments' ? 'No tickets match your filters.' : 'No tickets found.'}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket._id} className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all p-6 cursor-pointer relative group" onClick={() => handleTicketClick(ticket)}>
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {/* Edit Button */}
                <button
                  onClick={(e) => handleEditTicket(ticket, e)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  title="Edit ticket"
                >
                  <Edit size={16} />
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteTicket(ticket._id, e)}
                  disabled={deletingTicket === ticket._id}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete ticket"
                >
                  {deletingTicket === ticket._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs mb-4">
                <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-2 py-1 rounded-lg font-medium shadow-sm">{ticket.ticket_id}</span>
                <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-2 py-1 rounded-lg font-medium shadow-sm`}>{getCurrentStatus(ticket)}</span>
                <span className={`bg-gradient-to-r ${getPriorityColor(ticket.priority)} px-2 py-1 rounded-lg font-medium shadow-sm`}>{ticket.priority}</span>
                <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-2 py-1 rounded-lg font-medium shadow-sm">Development</span>
                <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-1 rounded-lg font-medium shadow-sm">Created: {formatDate(ticket.createdAt)}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-1">{ticket.title}</h3>
              {ticket.description && (<p className="text-sm text-gray-600 mb-4">{ticket.description}</p>)}

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={16} className="text-gray-500" />
                  <span className="font-medium">Due:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs shadow-sm">{formatDate(ticket.due_date)}</span>
                </div>
                {new Date(ticket.due_date) < new Date() && (<span className="text-red-500 font-semibold animate-pulse">⏳ Overdue</span>)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      <TicketModal 
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          handleTicketCreated();
        }}
      />

      {/* Update Ticket Modal */}
      <UpdateTicketModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onUpdate={handleTicketUpdate}
      />
    </div>
  );
}
