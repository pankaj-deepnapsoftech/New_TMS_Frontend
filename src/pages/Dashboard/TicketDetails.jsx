import { useState, useEffect } from 'react';
import { X, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TicketDetails() {
  const navigate = useNavigate();
  const { ticketId: _ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [addingTask, setAddingTask] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    isSchedule: false,
  });

  // Fetch ticket details
  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // First, get all tickets to find the specific one
      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/get`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const foundTicket = result.data.find((t) => t.ticket_id === _ticketId || t._id === _ticketId);

        if (foundTicket) {
          setTicket(foundTicket);
          setTasks(foundTicket.task || []);
        } else {
          setError('Ticket not found');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to fetch ticket details');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.due_date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setAddingTask(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/task/create`;

      const taskData = {
        ...newTask,
        ticket_id: ticket._id,
        due_date: new Date(newTask.due_date).toISOString(),
      };

      console.log('Creating task with data:', taskData);
      console.log('Description being sent:', newTask.description);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();
      console.log('Task creation response:', result);
      console.log('Response data description:', result.data?.description);

      if (response.ok) {
        // Add the new task to the local state
        const newTaskData = {
          ...result.data,
          description: newTask.description, // Ensure description is included
        };
        setTasks((prevTasks) => [...prevTasks, newTaskData]);

        // Reset form and close modal
        setNewTask({
          title: '',
          description: '',
          due_date: '',
          isSchedule: false,
        });
        setShowAddTask(false);

        console.log('Task created successfully:', result.data);
        console.log('New task data being added to state:', newTaskData);
      } else {
        setError(result.message || 'Failed to create task');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Network error. Please try again.');
    } finally {
      setAddingTask(false);
    }
  };

  // Load ticket details on component mount
  useEffect(() => {
    fetchTicketDetails();
  }, [_ticketId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'from-green-100 to-green-200 text-green-700';
      case 'In Progress':
        return 'from-yellow-100 to-yellow-200 text-yellow-700';
      case 'Pending':
        return 'from-blue-100 to-blue-200 text-blue-700';
      case 'Not Started':
        return 'from-gray-100 to-gray-200 text-gray-700';
      default:
        return 'from-gray-100 to-gray-200 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCurrentStatus = (task) => {
    if (Array.isArray(task.status) && task.status.length > 0) {
      const latest = task.status[task.status.length - 1];
      return latest?.status || 'Not Started';
    }
    return 'Not Started';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
          <button onClick={() => navigate('/ticket')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Ticket not found</p>
          <button onClick={() => navigate('/ticket')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/ticket')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
          <X size={20} /> Back to Tickets
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Ticket Details</h1>
      </div>

      {error && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1 rounded-lg font-medium">{ticket.ticket_id}</span>
              <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-3 py-1 rounded-lg font-medium`}>{getCurrentStatus(ticket)}</span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 rounded-lg font-medium">{ticket.priority}</span>
              <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-3 py-1 rounded-lg font-medium">Development</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">{ticket.title}</h2>
            {ticket.description && <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">{ticket.description}</p>}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Creator</label>
                <p className="mt-1 text-gray-800 font-medium">{ticket.creator}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Due Date</label>
                <p className="mt-1 text-red-500 font-semibold">{formatDate(ticket.due_date)}</p>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Tasks ({tasks.length})</h3>
              <button onClick={() => setShowAddTask(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-medium shadow-lg hover:scale-105 transition-transform">
                <Plus size={16} /> Add Task
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks found for this ticket.</p>
                </div>
              ) : (
                tasks.map((task) => {
                  console.log('Rendering task:', task);
                  console.log('Task description:', task.description);
                  return (
                    <div key={task._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(task))} px-3 py-1 rounded-lg text-xs font-medium`}>{getCurrentStatus(task)}</span>
                      </div>
                      {task.description && task.description.trim() !== '' ? (
                        <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-2 rounded border-l-2 border-blue-500">
                          <strong>Description:</strong> {task.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm mb-3 italic">No description provided</p>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">
                            Assigned: <span className="font-medium">{task.assign || 'Not assigned'}</span>
                          </span>
                          <span className="text-gray-500">
                            Due: <span className="font-medium">{formatDate(task.due_date)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Update Status</button>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Mark Complete</button>
              <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">Add Comment</button>
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Close Ticket</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">Add New Task</h2>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTask({
                    title: '',
                    description: '',
                    due_date: '',
                    isSchedule: false,
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Task Title */}
              <div>
                <label className="text-sm font-medium text-gray-600">Task Title *</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter task title..." required />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows="3" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter task description..." />
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-gray-600">Due Date *</label>
                <input type="datetime-local" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              {/* Is Schedule */}
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={newTask.isSchedule} onChange={(e) => setNewTask({ ...newTask, isSchedule: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Is Scheduled</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTask({
                    title: '',
                    description: '',
                    due_date: '',
                    isSchedule: false,
                  });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={addingTask}
              >
                Cancel
              </button>
              <button onClick={handleAddTask} disabled={addingTask} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                {addingTask ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
