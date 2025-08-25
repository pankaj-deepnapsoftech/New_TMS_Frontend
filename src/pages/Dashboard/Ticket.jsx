import { useState, useEffect } from 'react';
import { Search, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks, Trash2, Edit } from 'lucide-react';
import TicketModal from '@components/Modals/TicketsModal';
import UpdateTicketModal from '@components/Modals/UpdateTicketModal';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/services/Auth.service';

export default function TicketsPage() {
  const navigate = useNavigate();

  // Get current user
  const { data: currentUserData, isLoading: userLoading } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.user;
  const isAdmin = currentUser?.admin || false;

  const [tickets, setTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [assignedLoading, setAssignedLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedError, setAssignedError] = useState('');
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
      const ticketStatuses = ticket.status.filter((status) => !status.task_id);
      if (ticketStatuses.length > 0) {
        const latest = ticketStatuses[ticketStatuses.length - 1];
        return latest?.status || 'Not Started';
      }
    }  
    return 'Not Started';
  };

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/get`;                             

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  // Fetch assigned tickets from API
  const fetchAssignedTickets = async () => {
    try {
      setAssignedLoading(true);
      setAssignedError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/get-assign`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setAssignedTickets(result.data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setAssignedError(errorData.message || 'Failed to fetch assigned tickets');
      }
    } catch (err) {
      console.error('Error fetching assigned tickets:', err);
      setAssignedError('Network error. Please try again.');
    } finally {
      setAssignedLoading(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingTicket(ticketId);
      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/delete/${ticketId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        if (isAdmin) {
          setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
        } else {
          setAssignedTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
        }
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

  // Edit ticket
  const handleEditTicket = (ticket, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTicket(ticket);
    setIsUpdateOpen(true);
  };

  // Handle ticket update
  const handleTicketUpdate = (updatedTicket) => {
    if (isAdmin) {
      setTickets((prevTickets) => prevTickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket)));
    } else {
      setAssignedTickets((prevTickets) => prevTickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket)));
    }
  };

  useEffect(() => {
    if (!userLoading && currentUser) {
      if (isAdmin) {
        fetchTickets();
      } else {
        fetchAssignedTickets();
      }
    }
  }, [userLoading, currentUser, isAdmin]);

  const handleTicketCreated = () => {
    if (isAdmin) {
      fetchTickets();
    } else {
      fetchAssignedTickets();
    }
  };

  const handleTicketClick = (ticket) => {
    navigate(`/tickets/${ticket.ticket_id || ticket._id}`);
  };

  const filteredAssignedTickets = assignedTickets.filter((ticket) => {
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
    total: isAdmin ? tickets.length : assignedTickets.length,
    open: isAdmin ? tickets.filter((t) => getCurrentStatus(t) === 'Open' || getCurrentStatus(t) === 'Not Started').length : assignedTickets.filter((t) => getCurrentStatus(t) === 'Open' || getCurrentStatus(t) === 'Not Started').length,
    inProgress: isAdmin ? tickets.filter((t) => getCurrentStatus(t) === 'In Progress').length : assignedTickets.filter((t) => getCurrentStatus(t) === 'In Progress').length,
    resolved: isAdmin ? tickets.filter((t) => getCurrentStatus(t) === 'Resolved').length : assignedTickets.filter((t) => getCurrentStatus(t) === 'Resolved').length,
    overdue: isAdmin ? tickets.filter((t) => new Date(t.due_date) < new Date()).length : assignedTickets.filter((t) => new Date(t.due_date) < new Date()).length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      case 'High':
        return 'from-red-100 to-red-200 text-red-700';
      case 'Medium':
        return 'from-yellow-100 to-yellow-200 text-yellow-700';
      case 'Low':
        return 'from-green-100 to-green-200 text-green-700';
      default:
        return 'from-gray-100 to-gray-200 text-gray-700';
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold bg-indigo-800 bg-clip-text text-transparent tracking-tight">{isAdmin ? 'All Tickets Dashboard' : 'My Assigned Tickets'}</h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">{isAdmin ? 'Manage and monitor all tickets across the organization' : 'View and manage tickets assigned to you'}</p>
          </div>
        </div>
      </div>

      {error && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {[
          { title: isAdmin ? 'Total Tickets' : 'My Tickets', count: stats.total, icon: <ListChecks className="text-yellow-100" size={18} />, color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50' },
          { title: 'Open', count: stats.open, icon: <AlertCircle className="text-blue-100" size={18} />, color: 'from-blue-400 to-blue-600', bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
          { title: 'In Progress', count: stats.inProgress, icon: <Clock className="text-indigo-100" size={18} />, color: 'from-indigo-400 to-indigo-600', bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50' },
          { title: 'Resolved', count: stats.resolved, icon: <CheckCircle className="text-green-100" size={18} />, color: 'from-green-400 to-green-600', bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50' },
          { title: 'Overdue', count: stats.overdue, icon: <Clock className="text-red-100" size={18} />, color: 'from-red-400 to-red-600', bgColor: 'bg-gradient-to-br from-red-50 to-pink-50' },
        ].map((stat, i) => (
          <div key={i} className={`group ${stat.bgColor} border border-gray-200/50 rounded-3xl shadow-lg p-6 flex items-center justify-between transform hover:scale-105 hover:shadow-2xl transition-all duration-500 hover:rotate-1`}>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
              <h2 className="text-4xl font-black text-gray-800">{stat.count}</h2>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-0 bg-gray-50/80 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all duration-300 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border-0 bg-gray-50/80 rounded-2xl px-4 py-3 text-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>All Statuses</option>
              <option>Not Started</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border-0 bg-gray-50/80 rounded-2xl px-4 py-3 text-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="border-0 bg-gray-50/80 rounded-2xl px-4 py-3 text-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>All Departments</option>
              <option>Development</option>
              <option>Design</option>
              <option>Support</option>
            </select>
          </div>

          <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-2xl px-6 py-3 flex items-center gap-3 font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <Plus size={20} /> Create Ticket
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isAdmin && (
          <>
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading tickets...</h3>
                <p className="text-gray-600">Please wait while we fetch your data</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg mb-6">
                  <AlertCircle className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Tickets</h3>
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-md mx-auto">{assignedError}</div>
              </div>
            ) : filteredAssignedTickets.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg mb-6">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assigned Tickets</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm || filterStatus !== 'All Statuses' || filterPriority !== 'All Priorities' || filterDepartment !== 'All Departments'
                    ? 'No assigned tickets match your current filters. Try adjusting your search criteria.'
                    : "You don't have any tickets assigned to you yet. Check back later or contact your administrator."}
                </p>
              </div>
            ) : (
              filteredAssignedTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm border border-blue-200/50 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 p-6 cursor-pointer relative group overflow-hidden"
                  onClick={() => handleTicketClick(ticket)}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-indigo-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Assigned Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-blue-400/30">Assigned to You</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 transition-all duration-300 z-20">
                    <button
                      onClick={(e) => handleEditTicket(ticket, e)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Edit ticket"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTicket(ticket._id, e)}
                      onMouseDown={(e) => e.stopPropagation()}
                      disabled={deletingTicket === ticket._id}
                      className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      title="Delete ticket"
                    >
                      {deletingTicket === ticket._id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Trash2 size={16} />}
                    </button>
                  </div>

                  <div className="relative z-10 mt-8">
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-red-200/50">{ticket.ticket_id}</span>
                      <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}>{getCurrentStatus(ticket)}</span>
                      <span className={`bg-gradient-to-r ${getPriorityColor(ticket.priority)} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}>{ticket.priority}</span>
                      <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-purple-200/50">Development</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">{ticket.title}</h3>
                    {ticket.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>}

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex items-center gap-2 bg-blue-100/80 px-3 py-1.5 rounded-full">
                          <Users size={16} className="text-blue-500" />
                          <span className="font-semibold">Due:</span>
                          <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm font-medium">{formatDate(ticket.due_date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Overdue Indicator - Bottom Right Corner */}
                    {new Date(ticket.due_date) < new Date() && (
                      <div className="absolute bottom-2 right-4 z-20">
                        <span className="text-red-500 font-bold animate-pulse bg-red-100 px-3 py-1 rounded-full text-xs shadow-lg border border-red-200">⏳ Overdue</span>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-blue-100/50">
                      <span className="text-xs text-gray-500 font-medium">Created: {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
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
