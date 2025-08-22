import { useState } from 'react';
import { X, Plus, CheckCircle, RefreshCcw, MessageSquare, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TicketDetails() {
  const navigate = useNavigate();
  const { ticketId: _ticketId } = useParams();

  const [ticket] = useState({
    id: 'TKT-0001',
    title: 'Build Company Website',
    description: 'Create navbar, footer and landing page',
    status: 'In Progress',
    priority: 'Medium',
    department: 'Developer',
    comments: 4,
    assigned: ['Tanish', 'Deepak'],
    dueDate: 'Jul 12, 2025',
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design Homepage Layout',
      description: 'Create wireframes and mockups for homepage',
      status: 'Completed',
      assignedTo: 'Tanish',
      dueDate: 'Jul 10, 2025',
    },
    {
      id: 2,
      title: 'Implement Navigation Bar',
      description: 'Code the responsive navigation component',
      status: 'In Progress',
      assignedTo: 'Deepak',
      dueDate: 'Jul 15, 2025',
    },
  ]);

  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      const task = { id: tasks.length + 1, ...newTask, status: 'Pending' };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      setShowAddTask(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 ring-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 ring-yellow-200';
      case 'Pending':
        return 'bg-blue-100 text-blue-700 ring-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 ring-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
        <button onClick={() => navigate('/ticket')} className="flex items-center gap-2 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
          <X size={14} /> Back to Tickets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ticket Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap gap-2 text-xs mb-6">
              <span className="px-3 py-1 rounded-lg font-medium bg-red-50 text-red-700 ring-1 ring-red-100">{ticket.id}</span>
              <span className="px-3 py-1 rounded-lg font-medium bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100">{ticket.status}</span>
              <span className="px-3 py-1 rounded-lg font-medium bg-purple-50 text-purple-700 ring-1 ring-purple-100">{ticket.priority}</span>
              <span className="px-3 py-1 rounded-lg font-medium bg-pink-50 text-pink-700 ring-1 ring-pink-100">{ticket.department}</span>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{ticket.title}</h2>
            <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg leading-relaxed">{ticket.description}</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ticket.assigned.map((name, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="mt-2 text-red-600 font-semibold">{ticket.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
              <button onClick={() => setShowAddTask(true)} className="bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition">
                <Plus size={16} /> Add Task
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ring-1 ${getStatusColor(task.status)}`}>{task.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Assigned: <span className="font-medium text-gray-700">{task.assignedTo}</span>
                    </span>
                    <span>
                      Due: <span className="font-medium text-gray-700">{task.dueDate}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                <RefreshCcw size={20} className="mb-1" />
                <span className="text-xs font-medium">Update</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition">
                <CheckCircle size={20} className="mb-1" />
                <span className="text-xs font-medium">Complete</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition">
                <MessageSquare size={20} className="mb-1" />
                <span className="text-xs font-medium">Comment</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition">
                <Lock size={20} className="mb-1" />
                <span className="text-xs font-medium">Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-400 px-6 py-4">
              <h2 className="text-lg font-semibold">Add New Task</h2>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Task Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter task title..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Assigned To</label>
                <input type="text" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter assignee name..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows="3" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter task description..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Due Date</label>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-400 px-6 py-4">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
                }}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button onClick={handleAddTask} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-lg transition">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
