/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Search, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks, Trash2, Edit } from 'lucide-react';
import TicketModal from '@components/Modals/TicketsModal';
import { useNavigate } from 'react-router-dom';
import { useDeleteTicketMutation, useGetAdminTicketcardDataQuery, useGetAssignedTicketQuery, useGetTicketQuery } from '@/services/Ticket.service';
import { useSelector } from 'react-redux';
import Pagination from '@/components/ui/Pagination';


export default function TicketsPage() {


  const [page, setPage] = useState(1)
  const [assignTicktPage,setAssigneTicketPage] = useState(1)
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.Auth.user);
  const isAdmin = currentUser?.admin || false;
  // eslint-disable-next-line no-unused-vars   
  const [assignedError, setAssignedError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTicket, setEditTicket] = useState(null)
  const [DeleteTicket] = useDeleteTicketMutation()
  const { data: AdminCarddata, isLoading: adminCardDataload, refetch } = useGetAdminTicketcardDataQuery(); 

  const [limit, setLimit] = useState(10);

  const { data: tickets, isLoading: getTicketloading, error: ticketError, refetch: refreshTicket } = useGetTicketQuery({ page, limit });

  const { data: assignedTicket, isLoading: assignedLoading, refetch: refreshAssignTicket } = useGetAssignedTicketQuery({ assignTicktPage, limit });
  
  // console.log(assignedTicket)

  const assignedTickets = assignedTicket?.data || [] ;

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

   

  const handleDeleteTicket = async (ticketId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        DeleteTicket(ticketId);
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    if (currentUser) {
      if (!isAdmin) {
        refetch()
        refreshTicket()
        refreshAssignTicket()
      }
    }
  }, [currentUser, isAdmin]);



  const handleTicketClick = (ticket) => {
    navigate(`/tickets/${ticket?.ticket_id || ticket?._id}`);

  };

  const myCreatedTickets = tickets?.data?.filter(ticket => ticket?.creator === currentUser?._id) || [];
  const assignedOnlyTickets = assignedTickets?.filter(ticket => ticket?.creator !== currentUser?._id) || [];

  const filteredAssignedTickets = isAdmin
    ? tickets?.data || []
    : assignedTickets?.filter(ticket => ticket?.creator !== currentUser?._id) || [];



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

  // console.log(filteredAssignedTickets)

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

  if (getTicketloading || adminCardDataload) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-50/50 p-6">
      
      <div className="mb-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold bg-sky-800 bg-clip-text text-transparent tracking-tight">{isAdmin ? 'All Tickets Dashboard' : 'My Assigned Tickets'}</h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">{isAdmin ? 'Manage and monitor all tickets across the organization' : 'View and manage tickets assigned to you'}</p>
          </div>
        </div>  
      </div>

      {ticketError && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{ticketError}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {[
          { title: 'Total Tickets', count: AdminCarddata?.data?.total || 0, icon: <ListChecks className="text-yellow-100" size={14} />, color: 'from-yellow-300 to-yellow-500', bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50' },
          { title: 'Not Started', count: AdminCarddata?.data?.statusCounts.find((item) => item.status === "Not Started")?.count || 0, icon: <AlertCircle className="text-blue-100" size={14} />, color: 'from-blue-300 to-blue-500', bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
          { title: 'On Hold', count: AdminCarddata?.data?.statusCounts.find((item) => item.status === "On Hold")?.count || 0, icon: <Clock className="text-indigo-100" size={14} />, color: 'from-indigo-300 to-indigo-500', bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50' },
          { title: 'Re Open', count: AdminCarddata?.data?.statusCounts.find((item) => item.status === "Re Open")?.count || 0, icon: <CheckCircle className="text-green-100" size={14} />, color: 'from-green-300 to-green-500', bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50' },
          { title: 'Overdue', count: AdminCarddata?.data?.overdue, icon: <Clock className="text-red-100" size={14} />, color: 'from-red-300 to-red-500', bgColor: 'bg-gradient-to-br from-red-50 to-pink-50' },
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

      <div className="bg-white/70 backdrop-blur-sm flex flex-col md:flex-row gap-4 md:items-center justify-between border border-white/20 rounded-3xl p-6 mb-10 shadow-xl">

        <div className="relative flex-1 max-w-full md:max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-0 bg-gray-50/80 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all duration-300 shadow-sm"
          />
        </div> 
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsOpen(true); setEditTicket(null) }}
            className="bg-gradient-to-r from-blue-600 via-sky-600 to-sky-800 text-white rounded-2xl px-6 py-3 flex items-center justify-center gap-3 font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto"
          >
            <Plus size={20} /> Create Ticket
          </button>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); 
            }}
            className="border border-gray-300 bg-gray-50/80 rounded-xl px-4 py-2 pl-2  text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all duration-300 shadow-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isAdmin ? (
          <>
            {getTicketloading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-600 rounded-full shadow-lg mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading tickets...</h3>
                <p className="text-gray-600">Please wait while we fetch your data</p>
              </div>
            ) : ticketError ? (
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
                  {searchTerm
                    ? 'No tickets match your current filters. Try adjusting your search criteria.'
                    : 'No tickets have been created yet. Create your first ticket to get started!'
                  }
                </p>
              </div>
            ) : (
              tickets?.data?.map((ticket) => (
                <div key={ticket._id} className="bg-white/90  border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 p-6 cursor-pointer relative group overflow-hidden" onClick={() => handleTicketClick(ticket)}>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-sky-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>


                  {(currentUser?.admin === true || ticket?.creator === currentUser?._id) && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsOpen(true);
                          setEditTicket(ticket);
                        }}
                        className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Edit ticket"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={(e) => handleDeleteTicket(ticket._id, e)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        title="Delete ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="relative z-10 mt-8">
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-red-200/50">{ticket.ticket_id}</span>
                      <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}>{getCurrentStatus(ticket)}</span>
                      <span className={`bg-gradient-to-r ${getPriorityColor(ticket.priority)} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}>{ticket.priority}</span>
                      <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-purple-200/50">{ticket?.department?.name}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">{ticket.title}</h3>
                    {ticket.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>}

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex items-center gap-2 bg-gray-100/80 px-3 py-1.5 rounded-full">
                          <Users size={16} className="text-gray-500" />
                          <span className="font-semibold">Due:</span>
                          <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm font-medium">{formatDate(ticket.due_date)}</span>
                        </div>
                      </div>
                    </div>


                    {new Date(ticket.due_date) < new Date() && (
                      <div className="absolute bottom-1 right-1 z-20">
                        <span className="text-red-500 font-bold animate-pulse bg-red-100 px-3 py-1 rounded-full text-xs shadow-lg border border-red-200">⏳ Overdue</span>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-100/50">
                      <span className="text-xs text-gray-500 font-medium">Created: {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
              
            )}
          
          </>
        ) : (

          <>
            {assignedLoading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-600 rounded-full shadow-lg mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading your tickets...</h3>
                <p className="text-gray-600">Please wait while we fetch your assigned tickets</p>
              </div>
            ) : assignedError ? (
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
                  {searchTerm
                    ? 'No assigned tickets match your current filters. Try adjusting your search criteria.'
                    : 'You don\'t have any tickets assigned to you yet. Check back later or contact your administrator.'
                  }
                </p>
              </div>
            ) : (
              assignedOnlyTickets?.map((ticket) => (
                <div key={ticket._id} className="bg-gradient-to-br from-blue-50/80 to-sky-50/60  border border-blue-200/50 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 p-6 cursor-pointer relative group overflow-hidden" onClick={() => handleTicketClick(ticket)}>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-sky-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>


                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-gradient-to-r from-blue-500 to-sky-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-blue-400/30">Assigned to You</span>
                  </div>

                  {(currentUser?.admin === true || ticket?.creator === currentUser?._id) && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsOpen(true);
                          setEditTicket(ticket);
                        }}
                        className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Edit ticket"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={(e) => handleDeleteTicket(ticket._id, e)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        title="Delete ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}


                  <div className="relative z-10 mt-8">
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-red-200/50">{ticket.ticket_id}</span>
                      <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}>{getCurrentStatus(ticket)}</span>
                      <span className={`bg-gradient-to-r ${getPriorityColor(ticket?.priority)} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}>{ticket?.priority}</span>
                      <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-purple-200/50">{ticket?.department?.name}</span>
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
      { isAdmin && 
         <div className="mt-6 flex justify-center">
        <Pagination currentPage={page} onPageChange={setPage} totalPages={ tickets?.totalPage } />
      </div>}
      
        <div className="mt-6 flex justify-center">
        <Pagination currentPage={assignTicktPage} onPageChange={setAssigneTicketPage} totalPages={assignedTicket?.totalPage} />
        </div>
     
      {!isAdmin && (
        <div className="mb-10 h-full mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Created Tickets</h2>
          <div className="flex-grow">
          {myCreatedTickets.length === 0 ? (
            <p className="text-gray-600">You haven’t created any tickets yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCreatedTickets.map(ticket => (
                <div
                  key={ticket._id}
                  className="bg-white/90  border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 p-6 cursor-pointer relative group overflow-hidden"
                  onClick={() => handleTicketClick(ticket)}
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>


                  {(currentUser?.admin === true || ticket?.creator === currentUser?._id) && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsOpen(true);
                          setEditTicket(ticket);
                        }}
                        className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Edit ticket"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={(e) => handleDeleteTicket(ticket._id, e)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        title="Delete ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}


                  {/* content */}
                  <div className="relative z-10 mt-8">
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-red-200/50">
                        {ticket.ticket_id}
                      </span>
                      <span
                        className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}
                      >
                        {getCurrentStatus(ticket)}
                      </span>
                      <span
                        className={`bg-gradient-to-r ${getPriorityColor(ticket.priority)} px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200/50`}
                      >
                        {ticket.priority}
                      </span>
                      <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-purple-200/50">
                        {ticket?.department?.name}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">
                      {ticket.title}
                    </h3>
                    {ticket.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex items-center gap-2 bg-gray-100/80 px-3 py-1.5 rounded-full">
                          <Users size={16} className="text-gray-500" />
                          <span className="font-semibold">Due:</span>
                          <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm font-medium">
                            {formatDate(ticket.due_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Overdue indicator */}
                    {new Date(ticket.due_date) < new Date() && (
                      <div className="absolute bottom-1 right-1 z-20">
                        <span className="text-red-500 font-bold animate-pulse bg-red-100 px-3 py-1 rounded-full text-xs shadow-lg border border-red-200">
                          ⏳ Overdue
                        </span>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-100/50">
                      <span className="text-xs text-gray-500 font-medium">
                        Created: {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
          <Pagination currentPage={page} onPageChange={setPage} totalPages={tickets?.totalPage} />
        </div>
      )}




      <TicketModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        editTicket={editTicket}
      />
     
    </div>
  );
}
