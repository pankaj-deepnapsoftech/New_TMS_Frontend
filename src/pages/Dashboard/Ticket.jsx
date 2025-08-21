import { useState } from 'react';
import { Search, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks } from 'lucide-react';
import TicketModal from '@components/Modals/TicketsModal';

export default function TicketsPage() {
  const [tickets] = useState([
    {
      id: 'TKT-0001',
      title: 'Build Company Website',
      description: 'Create navbar, footer and landing page',
      status: 'In Progress',
      priority: 'Medium',
      department: 'Developer',
      comments: 4,
      assigned: ['Tanish', 'Deepak'],
      dueDate: 'Jul 12, 2025',
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Ticket Management Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Oversee, track and manage all tickets across the team in real-time.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {[
          {
            title: 'Total Tickets',
            count: 1,
            icon: <ListChecks className="text-yellow-100" size={25} />,
            color: 'from-yellow-400 to-yellow-600',
          },
          {
            title: 'Open',
            count: 0,
            icon: <AlertCircle className="text-blue-100" size={25} />,
            color: 'from-blue-400 to-blue-600',
          },
          {
            title: 'In Progress',
            count: 1,
            icon: <Clock className="text-indigo-100" size={25} />,
            color: 'from-indigo-400 to-indigo-600',
          },
          {
            title: 'Resolved',
            count: 0,
            icon: <CheckCircle className="text-green-100" size={25} />,
            color: 'from-green-400 to-green-600',
          },
          {
            title: 'Overdue',
            count: 1,
            icon: <Clock className="text-red-100" size={25} />,
            color: 'from-red-400 to-red-600',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex items-center justify-between transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h2 className="text-3xl font-extrabold text-gray-800">{stat.count}</h2>
            </div>
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full border rounded-xl pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {['All Statuses', 'All Priorities', 'All Employees', 'All Departments'].map((f, i) => (
            <select
              key={i}
              className="border rounded-xl px-3 py-2 text-sm shadow-sm hover:shadow transition"
            >
              <option>{f}</option>
            </select>
          ))}
        </div>

        {/* Create Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
        >
          <Plus size={18} /> Create Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all p-6"
          >
            {/* Ticket Header */}
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-2 py-1 rounded-lg font-medium shadow-sm">
                {ticket.id}
              </span>
              <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 px-2 py-1 rounded-lg font-medium shadow-sm">
                {ticket.status}
              </span>
              <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-2 py-1 rounded-lg font-medium shadow-sm">
                💬 {ticket.comments} comments
              </span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-2 py-1 rounded-lg font-medium shadow-sm">
                {ticket.priority}
              </span>
              <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-2 py-1 rounded-lg font-medium shadow-sm">
                {ticket.department}
              </span>
            </div>

            {/* Ticket Body */}
            <h3 className="text-lg font-bold text-gray-800 mb-1">{ticket.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>

            {/* Footer */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={16} className="text-gray-500" />
                <span className="font-medium">Assigned to:</span>
                {ticket.assigned.map((name, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 px-2 py-1 rounded-full text-xs shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <span className="text-red-500 font-semibold animate-pulse">
                ⏳ Overdue: {ticket.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
     <TicketModal isOpen={isOpen} onClose={() => setIsOpen(false)} />



    </div>
  );
}
