/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { X, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserQuery } from '@/services/Users.service';
import { useGetTicketByIdQuery } from '@/services/Ticket.service';
import { useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from '@/services/Task.service';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAddStatusMutation, useDeleteStatusMutation, useUpdateStatusMutation } from '@/services/Status.service';
import { useAddCommentMutation } from '@/services/Comment.service';
export default function TicketDetails() {
  const { ticketId: _ticketId } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetTicketByIdQuery(_ticketId);
  const ticket = data?.data || null;
  const tasks = ticket?.task || [];
  const [comment, setComment] = useState('');
  const { data: User } = useGetUserQuery();
  const [createTask] = useCreateTaskMutation();
  const UserData = User?.data;
  const currentUser = useSelector((state) => state.Auth.user);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('Not Started');
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editStatusData, setEditStatusData] = useState({
    status: 'Not Started',
  });
  const [deletingStatus, setDeletingStatus] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [addComment] = useAddCommentMutation();
  const [taskComment, setTaskComment] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [loadingUsers, setLoadingUsers] = useState(false);
  // State for task status management
  const [showTaskStatusModal, setShowTaskStatusModal] = useState(false);
  const [selectedTaskForStatus, setSelectedTaskForStatus] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('Not Started');
  const [updatingTaskStatus, setUpdatingTaskStatus] = useState(false);
  const [updatedTask] = useUpdateTaskMutation();
  const [editTask, setEditTask] = useState(null);
  const [deleteTask] = useDeleteTaskMutation();
  const [addStatus] = useAddStatusMutation();
  const [updatedStatus] = useUpdateStatusMutation();
  const [deleteStatus] = useDeleteStatusMutation();

  const addTaskForm = useFormik({
    initialValues: {
      title: editTask?.title || '',
      description: editTask?.description || '',
      due_date: editTask?.due_date ? new Date(editTask.due_date).toISOString().slice(0, 16) : '',
      isSchedule: editTask?.isSchedule || false,
      assign: editTask?.assign?._id || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().trim().required('Title is required'),
      due_date: Yup.string().required('Due date is required'),
      description: Yup.string(),
      assign: Yup.string().nullable(),
      isSchedule: Yup.boolean(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const taskData = {
          ...values,
          ticket_id: ticket?._id,
          due_date: new Date(values.due_date).toISOString(),
        };

        if (editTask) {
          await updatedTask({ id: editTask?._id, taskData }).unwrap();
        } else {
          await createTask(taskData).unwrap();
        }
        refetch();
        helpers.resetForm();
        setShowAddTask(false);
        setShowEditTaskModal(false);
      } catch (err) {
        console.error('Error saving task:', err);
        helpers.setStatus(err?.data?.message || 'Failed to save task');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleTaskCommentSubmit = async (e, taskId) => {
    e.preventDefault();
    if (!taskComment.trim()) return;

    try {
      await addComment({
        ticket_id: ticket._id,
        task_id: taskId,
        text: taskComment,
        user_id: currentUser?._id,
      }).unwrap();

      setTaskComment('');
      refetch();
    } catch (err) {
      console.error('Error adding task comment:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment({
        ticket_id: ticket._id,
        text: comment,
        user_id: currentUser?._id,
      }).unwrap();

      setComment('');
      refetch();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Update ticket status
  const handleUpdateStatus = async () => {
    try {
      setUpdatingStatus(true);
      const existingStatus = ticket?.status?.find((status) => !status?.task_id);

      if (existingStatus) {
        await updatedStatus({
          id: existingStatus._id,
          status: { status: newStatus },
        }).unwrap();
      } else {
        await addStatus({
          status: newStatus,
          ticket_id: ticket?._id,
        }).unwrap();
      }

      refetch();
      setShowStatusModal(false);
      setNewStatus('Not Started');
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditStatus = async () => {
    if (!selectedStatus) return;
    try {
      setEditingStatus(true);

      await updatedStatus({
        id: selectedStatus._id,
        status: { status: editStatusData?.status },
      }).unwrap();

      refetch();
      setShowEditStatusModal(false);
      setSelectedStatus(null);
      setEditStatusData({ status: 'Not Started' });
    } catch (err) {
      console.error('Error updating status:', err);
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
    try {
      if (window.confirm('Are you sure you want to delete this status?')) {
        await deleteStatus(statusId).unwrap();
      }
      refetch();
    } catch (err) {
      console.error('Error deleting status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await deleteTask(taskId);
      }
      refetch();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTaskStatus = async () => {
    if (!selectedTaskForStatus) return;
    try {
      setUpdatingTaskStatus(true);

      const existingStatus = selectedTaskForStatus.status?.find((status) => status.task_id === selectedTaskForStatus._id);

      if (existingStatus) {
        await updatedStatus({
          id: existingStatus._id,
          status: { status: newTaskStatus },
        }).unwrap();
      } else {
        await addStatus({
          status: newTaskStatus,
          task_id: selectedTaskForStatus._id,
          ticket_id: ticket._id,
        }).unwrap();
      }

      refetch();
      setShowTaskStatusModal(false);
      setSelectedTaskForStatus(null);
      setNewTaskStatus('Not Started');
    } catch (err) {
      console.error('Error updating task status:', err);
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

  if (isLoading) {
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
        <div className="flex justify-end">
          <button onClick={() => navigate('/ticket')} className="flex items-center gap-2 text-gray-600 rounded-lg hover:text-gray-800">
            <X size={18} /> Back to Tickets
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Ticket Details</h1>
      </div>

      {error && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-1 rounded-lg font-medium">{ticket?.ticket_id}</span>
              <span className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(ticket))} px-3 py-1 rounded-lg font-medium`}>{getCurrentStatus(ticket)}</span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 rounded-lg font-medium">{ticket.priority}</span>
              <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-3 py-1 rounded-lg font-medium">{ticket?.department?.name}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">{ticket?.title}</h2>
            {ticket?.description && <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">{ticket?.description}</p>}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Creator</label>
                <p className="mt-1 text-gray-800 font-medium">{ticket?.creator?.full_name}</p>
                <p className="mt-1 text-gray-800 font-medium">{ticket?.creator?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Due Date</label>
                <p className="mt-1 text-red-500 font-semibold">{formatDate(ticket?.due_date)}</p>
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
              {!ticket.status || ticket?.status?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No status history found.</p>
                </div>
              ) : (
                ticket?.status
                  .filter((status) => !status?.task_id) // Filter out task statuses, keep only ticket statuses
                  .map((status) => (
                    <div key={status._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`bg-gradient-to-r ${getStatusColor(status.status)} px-3 py-1 rounded-lg text-xs font-medium`}>{status.status}</span>
                          <span className="text-xs text-gray-500">Update #{status.updateCount || 0}</span>
                        </div>
                        <div>
                          <button onClick={() => openEditStatusModal(status)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Edit status">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteStatus(status._id)} disabled={deletingStatus} className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Delete status">
                            {deletingStatus ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Status ID: {status._id}</div>
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
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed: {tasks.filter((t) => getCurrentStatus(t) === 'Completed').length}</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">In Progress: {tasks.filter((t) => getCurrentStatus(t) === 'In Progress').length}</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Not Started: {tasks.filter((t) => getCurrentStatus(t) === 'Not Started').length}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowAddTask(true);
                  setEditTask(null);
                }}
                className="bg-gradient-to-r from-blue-600 via-sky-600 to-sky-800 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-medium shadow-lg hover:scale-105 transition-transform"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks found for this ticket.</p>
                </div>
              ) : (
                tasks?.map((task, index) => {
                  return (
                    <div key={typeof task?._id === 'string' ? task?._id : index} className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${task.status && task.status.length > 0 ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{typeof task.title === 'string' ? task.title : 'Untitled Task'}</h4>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openTaskStatusModal(task)} className={`bg-gradient-to-r ${getStatusColor(getCurrentStatus(task))} px-3 py-1 rounded-lg text-xs font-medium hover:scale-105 transition-transform cursor-pointer`} title="Click to update status">
                            {getCurrentStatus(task)}
                          </button>
                          {(currentUser?.admin === true || ticket?.creator?._id === currentUser?._id) && (
                            <button
                              onClick={() => {
                                setShowAddTask(true);
                                setEditTask(task);
                              }}
                              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                              title="Edit task"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}

                          {(currentUser?.admin === true || ticket?.creator?._id === currentUser?._id) && (
                            <button onClick={() => handleDeleteTask(typeof task._id === 'string' ? task._id : null)} disabled={deletingTask} className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Delete task">
                              {deletingTask ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          )}
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
                          <span className="text-gray-500">
                            Assigned:{' '}
                            <span className="font-medium">
                              {task.assign && typeof task.assign === 'object' && task.assign.full_name ? `${task.assign.full_name} (${task.assign.username})` : typeof task.assign === 'string' ? UserData?.find((user) => user._id === task.assign)?.full_name || 'Not assigned' : 'Not assigned'}
                            </span>
                          </span>
                          <span className={`${task.due_date && new Date(task.due_date) < new Date() ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                            Due: <span className="font-medium">{task.due_date ? formatDate(task.due_date) : 'Not set'}</span>
                            {task.due_date && new Date(task.due_date) < new Date() && <span className="ml-1 text-red-500">⏳ Overdue</span>}
                          </span>
                        </div>
                      </div>

                      {task.status && task.status.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h5 className="text-xs font-medium text-gray-600 mb-2">Status History:</h5>
                          <div className="space-y-1">
                            {task.status.map((status, index) => (
                              <div key={typeof status._id === 'string' ? status._id : index} className="flex items-center gap-2 text-xs">
                                <span className={`bg-gradient-to-r ${getStatusColor(typeof status.status === 'string' ? status.status : 'Not Started')} px-2 py-1 rounded text-xs font-medium`}>{typeof status.status === 'string' ? status.status : 'Not Started'}</span>
                                <span className="text-gray-500">{status.createdAt && typeof status.createdAt === 'string' ? new Date(status.createdAt).toLocaleDateString() : 'Recent'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <form onSubmit={(e) => handleTaskCommentSubmit(e, task?._id)}>
                          <textarea
                            value={taskComment}
                            onChange={(e) => setTaskComment(e.target.value)}
                            placeholder="Write a comment for this task..."
                            className="w-full min-h-[100px] resize-none rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                          />

                          <div className="flex w-full justify-end">
                            <button type="submit" className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg">
                              Add Comment
                            </button>
                          </div>
                        </form>
                        {task?.comment?.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {task.comment.map((c, idx) => (
                              <div key={c?._id || idx} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <p className="text-gray-800">{c.text}</p>
                                <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                                  <span>
                                    By:{' '}
                                    {Array.isArray(c?.creator) && c?.creator.length > 0
                                      ? c?.creator.map((dets, i) => (
                                          <span key={i}>
                                            {dets?.full_name || 'Unknown'}
                                            {i < c?.creator.length - 1 ? ', ' : ''}
                                          </span>
                                        ))
                                      : 'Unknown'}
                                  </span>
                                  <span className="text-xs">{c?.createdAt ? new Date(c?.createdAt).toLocaleString() : 'Just now'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setShowStatusModal(true)} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Change Ticket Status
              </button>
            </div>
          </div>

          {/* Add Comment */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-10 w-full max-w-xl">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">Add Comment</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full min-h-[112px] resize-none rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />

              <div className="flex justify-end gap-3">
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Show Comments */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-6 w-full max-w-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Comments</h2>

            {ticket?.comment?.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {ticket.comment.map((c, index) => (
                  <div key={c._id || index} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-700">{c.text}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>By: {c.creator?.full_name || 'Unknown'}</span>
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">Add New Task</h2>
              <button
                onClick={() => {
                  addTaskForm.resetForm();
                  setShowAddTask(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <form onSubmit={addTaskForm.handleSubmit} className="p-6 space-y-4">
              {addTaskForm.status && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">{addTaskForm.status}</div>}

              {/* Task Title */}
              <div>
                <label className="text-sm font-medium text-gray-600">Task Title *</label>
                <input type="text" name="title" value={addTaskForm.values.title} onChange={addTaskForm.handleChange} onBlur={addTaskForm.handleBlur} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter task title..." />
                {addTaskForm.touched.title && addTaskForm.errors.title && <p className="text-xs text-red-600 mt-1">{addTaskForm.errors.title}</p>}
              </div>

              {/* Assign To */}
              <div>
                <label className="text-sm font-medium text-gray-600">Assign To</label>
                <select name="assign" value={addTaskForm.values.assign} onChange={addTaskForm.handleChange} onBlur={addTaskForm.handleBlur} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" disabled={loadingUsers}>
                  <option value="">{loadingUsers ? 'Loading users...' : 'Select a user...'}</option>
                  {UserData?.filter((user) => user.department?.name === ticket?.department?.name).map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.full_name} ({user.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={addTaskForm.values.description}
                  onChange={addTaskForm.handleChange}
                  onBlur={addTaskForm.handleBlur}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter task description..."
                />
                {addTaskForm.touched.description && addTaskForm.errors.description && <p className="text-xs text-red-600 mt-1">{addTaskForm.errors.description}</p>}
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-gray-600">Due Date *</label>
                <input type="datetime-local" name="due_date" value={addTaskForm.values.due_date} onChange={addTaskForm.handleChange} onBlur={addTaskForm.handleBlur} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                {addTaskForm.touched.due_date && addTaskForm.errors.due_date && <p className="text-xs text-red-600 mt-1">{addTaskForm.errors.due_date}</p>}
              </div>

              {/* Is Schedule */}
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isSchedule" checked={addTaskForm.values.isSchedule} onChange={addTaskForm.handleChange} onBlur={addTaskForm.handleBlur} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Is Scheduled</span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    addTaskForm.resetForm();
                    setShowAddTask(false);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  disabled={addTaskForm.isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed" disabled={addTaskForm.isSubmitting || !addTaskForm.isValid}>
                  {addTaskForm.isSubmitting ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-300 px-6 py-4">
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
                <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">{getCurrentStatus(ticket)}</p>
              </div>

              {/* New Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">New Status *</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
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
                <textarea rows="3" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add any notes about this status change..." />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('Not Started');
                }}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
                disabled={updatingStatus}
              >
                Cancel
              </button>
              <button onClick={handleUpdateStatus} disabled={updatingStatus} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
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
                <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">{selectedStatus.status}</p>
              </div>

              {/* Status ID */}
              <div>
                <label className="text-sm font-medium text-gray-600">Status ID</label>
                <p className="mt-1 text-gray-800 font-mono text-sm bg-gray-50 p-2 rounded">{selectedStatus._id}</p>
              </div>

              {/* New Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">New Status *</label>
                <select value={editStatusData.status} onChange={(e) => setEditStatusData({ ...editStatusData, status: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
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
                <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">{selectedStatus.updateCount || 0}</p>
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
              <button onClick={handleEditStatus} disabled={editingStatus} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                {editingStatus ? 'Updating...' : 'Update Status'}
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
                <p className="mt-1 text-gray-800 font-medium bg-gray-50 p-2 rounded">{getCurrentStatus(selectedTaskForStatus)}</p>
              </div>

              {/* New Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">New Status *</label>
                <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
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
                <textarea rows="3" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add any notes about this status change..." />
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
              <button onClick={handleUpdateTaskStatus} disabled={updatingTaskStatus} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                {updatingTaskStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
