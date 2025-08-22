import { useState } from 'react';
import { X, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TicketDetails() {
  const navigate = useNavigate();
  const { ticketId: _ticketId } = useParams();
  
  // Mock ticket data - in real app this would come from API using _ticketId
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
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      const task = {
        id: tasks.length + 1,
        ...newTask,
        status: 'Pending'
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      setShowAddTask(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'from-green-100 to-green-200 text-green-700';
      case 'In Progress': return 'from-yellow-100 to-yellow-200 text-yellow-700';
      case 'Pending': return 'from-blue-100 to-blue-200 text-blue-700';
      default: return 'from-gray-100 to-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/ticket')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <X size={20} /> Back to Tickets
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Ticket Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1 rounded-lg font-medium">
                {ticket.id}
              </span>
              <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 px-3 py-1 rounded-lg font-medium">
                {ticket.status}
              </span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 rounded-lg font-medium">
                {ticket.priority}
              </span>
              <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-3 py-1 rounded-lg font-medium">
                {ticket.department}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">{ticket.title}</h2>
            <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">{ticket.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Assigned To</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {ticket.assigned.map((name, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Due Date</label>
                <p className="mt-1 text-red-500 font-semibold">{ticket.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Tasks</h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-medium shadow-lg hover:scale-105 transition-transform"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>

            

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{task.title}</h4>
                    <span className={`bg-gradient-to-r ${getStatusColor(task.status)} px-3 py-1 rounded-lg text-xs font-medium`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">Assigned: <span className="font-medium">{task.assignedTo}</span></span>
                      <span className="text-gray-500">Due: <span className="font-medium">{task.dueDate}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Update Status
              </button>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Mark Complete
              </button>
              <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                Add Comment
              </button>
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Close Ticket
              </button>
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
                   setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
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
                 <label className="text-sm font-medium text-gray-600">Task Title</label>
                 <input
                   type="text"
                   value={newTask.title}
                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                   className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="Enter task title..."
                 />
               </div>

               {/* Assigned To */}
               <div>
                 <label className="text-sm font-medium text-gray-600">Assigned To</label>
                 <input
                   type="text"
                   value={newTask.assignedTo}
                   onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                   className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="Enter assignee name..."
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
                 <label className="text-sm font-medium text-gray-600">Due Date</label>
                 <input
                   type="date"
                   value={newTask.dueDate}
                   onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                   className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>
             </div>

             {/* Footer */}
             <div className="flex justify-end gap-3 border-t px-6 py-4">
               <button 
                 onClick={() => {
                   setShowAddTask(false);
                   setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
                 }} 
                 className="px-4 py-2 border rounded-lg hover:bg-gray-100"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleAddTask}
                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
               >
                 Add Task
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
