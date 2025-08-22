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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('Not Started');
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editStatusData, setEditStatusData] = useState({
    status: 'Not Started'
  });
  const [deletingStatus, setDeletingStatus] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    due_date: '',
    isSchedule: false
  });
  const [deletingTask, setDeletingTask] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    isSchedule: false,
  });

  // State for task status management
  const [showTaskStatusModal, setShowTaskStatusModal] = useState(false);
  const [selectedTaskForStatus, setSelectedTaskForStatus] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('Not Started');
  const [updatingTaskStatus, setUpdatingTaskStatus] = useState(false);

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
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include' // This will send cookies automatically
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
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include', // This will send cookies automatically
        body: JSON.stringify(taskData)
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

  // Update ticket status
  const handleUpdateStatus = async () => {
    try {
      setUpdatingStatus(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/status/add`;
      
      const statusData = {
        status: newStatus,
        ticket_id: typeof ticket._id === 'string' ? ticket._id : null
      };

      console.log('Updating status with data:', statusData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include', // This will send cookies automatically
        body: JSON.stringify(statusData)
      });

      const result = await response.json();
      console.log('Status update response:', result);

      if (response.ok) {
        // Update the ticket's status in local state
        setTicket(prevTicket => ({
          ...prevTicket,
          status: [...(prevTicket.status || []), result.data]
        }));
        
        // Close modal and reset form
        setShowStatusModal(false);
        setNewStatus('Not Started');
        
        console.log('Status updated successfully:', result.data);
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Network error. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Edit existing status
  const handleEditStatus = async () => {
    if (!selectedStatus) return;

    try {
      setEditingStatus(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/status/update/${selectedStatus._id}`;
      
      const statusData = {
        status: editStatusData.status
      };

      console.log('Updating status with data:', statusData);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include', // This will send cookies automatically
        body: JSON.stringify(statusData)
      });

      const result = await response.json();
      console.log('Status edit response:', result);

      if (response.ok) {
        // Update the status in local state
        setTicket(prevTicket => ({
          ...prevTicket,
          status: prevTicket.status.map(status => 
            status._id === selectedStatus._id 
              ? { ...status, status: editStatusData.status }
              : status
          )
        }));
        
        // Close modal and reset form
        setShowEditStatusModal(false);
        setSelectedStatus(null);
        setEditStatusData({ status: 'Not Started' });
        
        console.log('Status updated successfully');
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Network error. Please try again.');
    } finally {
      setEditingStatus(false);
    }
  };

  // Open edit status modal
  const openEditStatusModal = (status) => {
    setSelectedStatus(status);
    setEditStatusData({ status: status.status });
    setShowEditStatusModal(true);
  };

  // Delete status
  const handleDeleteStatus = async (statusId) => {
    if (!statusId) return;

    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this status?')) {
      return;
    }

    try {
      setDeletingStatus(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/status/delete/${statusId}`;

      console.log('Deleting status with ID:', statusId);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include' // This will send cookies automatically
      });

      const result = await response.json();
      console.log('Status delete response:', result);

      if (response.ok) {
        // Remove the status from local state
        setTicket(prevTicket => ({
          ...prevTicket,
          status: prevTicket.status.filter(status => status._id !== statusId)
        }));
        
        console.log('Status deleted successfully');
      } else {
        setError(result.message || 'Failed to delete status');
      }
    } catch (err) {
      console.error('Error deleting status:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeletingStatus(false);
    }
  };

  // Edit existing task
  const handleEditTask = async () => {
    if (!selectedTask) return;

    try {
      setEditingTask(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/task/update/${selectedTask._id}`;
      
      const taskData = {
        title: editTaskData.title,
        description: editTaskData.description,
        due_date: new Date(editTaskData.due_date).toISOString(),
        isSchedule: editTaskData.isSchedule
      };

      console.log('Updating task with data:', taskData);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include', // This will send cookies automatically
        body: JSON.stringify(taskData)
      });

      const result = await response.json();
      console.log('Task edit response:', result);

      if (response.ok) {
        // Update the task in local state
        setTasks(prevTasks => prevTasks.map(task => 
          (typeof task._id === 'string' && typeof selectedTask._id === 'string' && task._id === selectedTask._id)
            ? { ...task, ...editTaskData }
            : task
        ));
        
        // Close modal and reset form
        setShowEditTaskModal(false);
        setSelectedTask(null);
        setEditTaskData({
          title: '',
          description: '',
          due_date: '',
          isSchedule: false
        });
        
        console.log('Task updated successfully');
      } else {
        setError(result.message || 'Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Network error. Please try again.');
    } finally {
      setEditingTask(false);
    }
  };

  // Open edit task modal
  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setEditTaskData({
      title: task.title || '',
      description: task.description || '',
      due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      isSchedule: task.isSchedule || false
    });
    setShowEditTaskModal(true);
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!taskId) return;

    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setDeletingTask(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/task/delete/${taskId}`;

      console.log('Deleting task with ID:', taskId);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include' // This will send cookies automatically
      });

      const result = await response.json();
      console.log('Task delete response:', result);

      if (response.ok) {
        // Remove the task from local state
        setTasks(prevTasks => prevTasks.filter(task => typeof task._id === 'string' && task._id !== taskId));
        
        console.log('Task deleted successfully');
      } else {
        setError(result.message || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeletingTask(false);
    }
  };

  // Update task status function
  const handleUpdateTaskStatus = async () => {
    if (!selectedTaskForStatus) return;

    try {
      setUpdatingTaskStatus(true);
      setError('');

      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/status/add`;
      
      const statusData = {
        status: newTaskStatus,
        task_id: typeof selectedTaskForStatus._id === 'string' ? selectedTaskForStatus._id : null,
        ticket_id: typeof ticket._id === 'string' ? ticket._id : null
      };

      console.log('Updating task status with data:', statusData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header - cookies will be sent automatically
        },
        credentials: 'include', // This will send cookies automatically
        body: JSON.stringify(statusData)
      });

      const result = await response.json();
      console.log('Task status update response:', result);

      if (response.ok) {
        // Update the task's status in local state
        setTasks(prevTasks => prevTasks.map(task => 
          (typeof task._id === 'string' && typeof selectedTaskForStatus._id === 'string' && task._id === selectedTaskForStatus._id)
            ? { 
                ...task, 
                status: [...(task.status || []), result.data]
              }
            : task
        ));
        
        // Close modal and reset form
        setShowTaskStatusModal(false);
        setSelectedTaskForStatus(null);
        setNewTaskStatus('Not Started');
        
        console.log('Task status updated successfully:', result.data);
      } else {
        setError(result.message || 'Failed to update task status');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Network error. Please try again.');
    } finally {
      setUpdatingTaskStatus(false);
    }
  };

  // Open task status update modal
  const openTaskStatusModal = (task) => {
    setSelectedTaskForStatus(task);
    setNewTaskStatus(getCurrentStatus(task));
    setShowTaskStatusModal(true);
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

           {/* Status History Section */}
           <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-800">Ticket Status</h3>
             </div>

             {/* Status List */}
             <div className="space-y-3">
               {(!ticket.status || ticket.status.length === 0) ? (
                 <div className="text-center py-4">
                   <p className="text-gray-500">No status history found.</p>
                 </div>
               ) : (
                 ticket.status.map((status) => (
                   <div key={status._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-3">
                         <span className={`bg-gradient-to-r ${getStatusColor(status.status)} px-3 py-1 rounded-lg text-xs font-medium`}>
                           {status.status}
                         </span>
                         <span className="text-xs text-gray-500">
                           Update #{status.updateCount || 0}
                         </span>
                       </div>
                       <button
                         onClick={() => openEditStatusModal(status)}
                         className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                         title="Edit status"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                       </button>
                       <button
                         onClick={() => handleDeleteStatus(status._id)}
                         disabled={deletingStatus}
                         className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         title="Delete status"
                       >
                         {deletingStatus ? (
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                         ) : (
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                         )}
                       </button>
                     </div>
                     <div className="text-xs text-gray-500">
                       Status ID: {status._id}
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>

           {/* Tasks Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Tasks ({tasks.length})</h3>
                {tasks.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Completed: {tasks.filter(t => getCurrentStatus(t) === 'Completed').length}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      In Progress: {tasks.filter(t => getCurrentStatus(t) === 'In Progress').length}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Not Started: {tasks.filter(t => getCurrentStatus(t) === 'Not Started').length}
                    </span>
                  </div>
                )}
              </div>
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
                     <div key={typeof task._id === 'string' ? task._id : index} className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                       task.status && task.status.length > 0 
                         ? 'border-blue-200 bg-blue-50/30' 
                         : 'border-gray-200'
                     }`}>
                       <div className="flex justify-between items-start mb-2">
                         <h4 className="font-semibold text-gray-800">{typeof task.title === 'string' ? task.title : 'Untitled Task'}</h4>
                         <div className="flex items-center gap-2">
                           <button
                             onClick={() => openTaskStatusModal(task)}
                             className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(task))} px-3 py-1 rounded-lg text-xs font-medium hover:scale-105 transition-transform cursor-pointer`}
                             title="Click to update status"
                           >
                             {getCurrentStatus(task)}
                           </button>

                           <button
                             onClick={() => openEditTaskModal(task)}
                             className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                             title="Edit task"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                           </button>
                                                        <button
                               onClick={() => handleDeleteTask(typeof task._id === 'string' ? task._id : null)}
                               disabled={deletingTask}
                               className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                               title="Delete task"
                             >
                             {deletingTask ? (
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                             ) : (
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                               </svg>
                             )}
                           </button>
                         </div>
                       </div>
                       {task.description && typeof task.description === 'string' && task.description.trim() !== '' ? (
                         <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-2 rounded border-l-2 border-blue-500">
                           <strong>Description:</strong> {task.description}
                         </p>
                       ) : (
                         <p className="text-gray-400 text-sm mb-3 italic">No description provided</p>
                       )}
                       <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-4">
                           <span className="text-gray-500">Assigned: <span className="font-medium">{typeof task.assign === 'string' ? task.assign : 'Not assigned'}</span></span>
                           <span className={`${task.due_date && new Date(task.due_date) < new Date() ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                             Due: <span className="font-medium">{task.due_date ? formatDate(task.due_date) : 'Not set'}</span>
                             {task.due_date && new Date(task.due_date) < new Date() && <span className="ml-1 text-red-500">⏳ Overdue</span>}
                           </span>
                         </div>
                       </div>
                       
                       {/* Task Status History */}
                       {task.status && task.status.length > 0 && (
                         <div className="mt-3 pt-3 border-t border-gray-100">
                           <h5 className="text-xs font-medium text-gray-600 mb-2">Status History:</h5>
                           <div className="space-y-1">
                             {task.status.map((status, index) => (
                               <div key={typeof status._id === 'string' ? status._id : index} className="flex items-center gap-2 text-xs">
                                 <span className={`bg-gradient-to-r ${getStatusColor(typeof status.status === 'string' ? status.status : 'Not Started')} px-2 py-1 rounded text-xs font-medium`}>
                                   {typeof status.status === 'string' ? status.status : 'Not Started'}
                                 </span>
                                 <span className="text-gray-500">
                                   {status.createdAt && typeof status.createdAt === 'string' ? new Date(status.createdAt).toLocaleDateString() : 'Recent'}
                                 </span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
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
               <button 
                 onClick={() => setShowStatusModal(true)}
                 className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
               >
                 Update Ticket Status
               </button>
              {/* <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Mark Complete
              </button>
              <button onClick={handleAddTask} disabled={addingTask} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                {addingTask ? 'Adding...' : 'Add Task'}
              </button> */}
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
                      isSchedule: false
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
                 <input
                   type="text"
                   value={newTask.title}
                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                   className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="Enter task title..."
                   required
                 />
               </div>

                               

               {/* Description */}
               <div>
                 <label className="text-sm font-medium text-gray-600">Description</label>
                 <textarea
                   value={newTask.description}
                   onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                   rows="3"
                   className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="Enter task description..."
                 />
               </div>

               {/* Due Date */}
               <div>
                 <label className="text-sm font-medium text-gray-600">Due Date *</label>
                 <input
                   type="datetime-local"
                   value={newTask.due_date}
                   onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                   className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   required
                 />
               </div>

               {/* Is Schedule */}
               <div>
                 <label className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     checked={newTask.isSchedule}
                     onChange={(e) => setNewTask({...newTask, isSchedule: e.target.checked})}
                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                   />
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
                      isSchedule: false
                    });
                  }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={addingTask}
                >
                  Cancel
                </button>
               <button 
                 onClick={handleAddTask}
                 disabled={addingTask}
                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
               >
                 {addingTask ? 'Adding...' : 'Add Task'}
               </button>
             </div>
           </div>
         </div>
               )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">Update Ticket Status</h2>
                <button 
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('Not Started');
                  }} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Current Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">
                    {getCurrentStatus(ticket)}
                  </p>
                </div>

                {/* New Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">New Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="On Hold">On Hold</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Re Open">Re Open</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Status Description */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status Description</label>
                  <textarea
                    rows="3"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Add any notes about this status change..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button 
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('Not Started');
                  }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Status Modal */}
        {showEditStatusModal && selectedStatus && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">Edit Status</h2>
                <button 
                  onClick={() => {
                    setShowEditStatusModal(false);
                    setSelectedStatus(null);
                    setEditStatusData({ status: 'Not Started' });
                  }} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Current Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">
                    {selectedStatus.status}
                  </p>
                </div>

                {/* Status ID */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status ID</label>
                  <p className="mt-1 text-gray-800 font-mono text-sm bg-gray-50 p-2 rounded">
                    {selectedStatus._id}
                  </p>
                </div>

                {/* New Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">New Status *</label>
                  <select
                    value={editStatusData.status}
                    onChange={(e) => setEditStatusData({...editStatusData, status: e.target.value})}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="On Hold">On Hold</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Re Open">Re Open</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Update Count */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Update Count</label>
                  <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">
                    {selectedStatus.updateCount || 0}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button 
                  onClick={() => {
                    setShowEditStatusModal(false);
                    setSelectedStatus(null);
                    setEditStatusData({ status: 'Not Started' });
                  }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={editingStatus}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditStatus}
                  disabled={editingStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {editingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {showEditTaskModal && selectedTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">Edit Task</h2>
                <button 
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setSelectedTask(null);
                    setEditTaskData({
                      title: '',
                      description: '',
                      due_date: '',
                      isSchedule: false
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
                  <input
                    type="text"
                    value={editTaskData.title}
                    onChange={(e) => setEditTaskData({...editTaskData, title: e.target.value})}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <textarea
                    value={editTaskData.description}
                    onChange={(e) => setEditTaskData({...editTaskData, description: e.target.value})}
                    rows="3"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter task description..."
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date *</label>
                  <input
                    type="datetime-local"
                    value={editTaskData.due_date}
                    onChange={(e) => setEditTaskData({...editTaskData, due_date: e.target.value})}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Is Schedule */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editTaskData.isSchedule}
                      onChange={(e) => setEditTaskData({...editTaskData, isSchedule: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-600">Is Scheduled</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button 
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setSelectedTask(null);
                    setEditTaskData({
                      title: '',
                      description: '',
                      due_date: '',
                      isSchedule: false
                    });
                  }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={editingTask}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditTask}
                  disabled={editingTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {editingTask ? 'Updating...' : 'Update Task'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Status Update Modal */}
        {showTaskStatusModal && selectedTaskForStatus && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">Update Task Status</h2>
                <button 
                  onClick={() => {
                    setShowTaskStatusModal(false);
                    setSelectedTaskForStatus(null);
                    setNewTaskStatus('Not Started');
                  }} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Current Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">
                    {getCurrentStatus(selectedTaskForStatus)}
                  </p>
                </div>

                {/* New Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">New Status *</label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="On Hold">On Hold</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Re Open">Re Open</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Status Description */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status Description</label>
                  <textarea
                    rows="3"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Add any notes about this status change..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button 
                  onClick={() => {
                    setShowTaskStatusModal(false);
                    setSelectedTaskForStatus(null);
                    setNewTaskStatus('Not Started');
                  }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={updatingTaskStatus}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateTaskStatus}
                  disabled={updatingTaskStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {updatingTaskStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
