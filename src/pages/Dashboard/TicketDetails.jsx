/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { X, Plus, Users, Clock, CheckCircle, AlertCircle, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAssigneUserQuery } from '@/services/Users.service';
import { useGetTicketByIdQuery } from '@/services/Ticket.service';
import { useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from '@/services/Task.service';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAddStatusMutation, useDeleteStatusMutation, useUpdateStatusMutation } from '@/services/Status.service';
import { useAddCommentMutation } from '@/services/Comment.service';
import axios from 'axios';
import { LuImagePlus } from "react-icons/lu";
export default function TicketDetails() {


  const { ticketId: _ticketId } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetTicketByIdQuery(_ticketId);
  const ticket = data?.data || null;
  const tasks = ticket?.task || [];
  const [comment, setComment] = useState('');
  const { data: User } = useGetAssigneUserQuery();
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
  const [taskComment, setTaskComment] = useState({});
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
  const [imagePreview, setImagePreview] = useState(null)
  const [imagesfile, setImageFile] = useState(null);
  const [taskImagePreview, setTaskImagePreview] = useState(null);
  const [taskImageFile, setTaskImageFile] = useState(null);


  const ImageUploader = async (formData) => {

    try {
      const res = await axios.post("https://images.deepmart.shop/upload", formData);
      // console.log(res.data?.[0])
      return res.data?.[0];
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleDownload = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name || "download";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };


  const addTaskForm = useFormik({
    initialValues: {
      title: editTask?.title || '',
      description: editTask?.description || '',
      due_date: editTask?.due_date
        ? new Date(editTask.due_date).toISOString().slice(0, 16)
        : '',
      isSchedule: editTask?.isSchedule ?? false,   // <- yaha default true/false hona chahiye
      assign: editTask?.assign?._id || '',
      schedule: {
        schedule_type: editTask?.schedule?.schedule_type || '',
        date: editTask?.schedule?.date
          ? new Date(editTask.schedule.date).toISOString().slice(0, 10)
          : '',
        weekly: editTask?.schedule?.weekly || [],
        time: editTask?.schedule?.time
          ? new Date(editTask.schedule.time).toISOString().slice(11, 16)
          : '',
      },
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required"),
      due_date: Yup.string().required("Due date is required"),
      description: Yup.string(),
      assign: Yup.string().nullable(),
      isSchedule: Yup.boolean(),
      schedule: Yup.object().shape({
        schedule_type: Yup.string().when("..isSchedule", {
          is: true,
          then: (schema) => schema.required("Schedule type is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        date: Yup.string().when("schedule_type", {
          is: (val) => ["Monthly", "daily", "yearly"].includes(val),
          then: (schema) => schema.required("Date is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        weekly: Yup.array().when("schedule_type", {
          is: "Weekly",
          then: (schema) =>
            schema.min(1, "Please select at least one day").required(),
          otherwise: (schema) => schema.notRequired(),
        }),
        time: Yup.string().when("..isSchedule", {
          is: true,
          then: (schema) => schema.required("Time is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
    }),
    onSubmit: async (values, helpers) => {
      try {
        let scheduleData = null;

        if (values.isSchedule) {   // <-- only if true
          const timeString = values.schedule.time;
          const today = new Date();
          const [hours, minutes] = timeString.split(":").map(Number);
          const timeDate = new Date(today);
          timeDate.setHours(hours, minutes, 0, 0);

          if (values.schedule.schedule_type === "Monthly") {
            scheduleData = {
              schedule_type: "Monthly",
              date: values.schedule.date,
              time: timeDate.toISOString(),
            };
          } else if (values.schedule.schedule_type === "Weekly") {
            scheduleData = {
              schedule_type: "Weekly",
              weekly: values.schedule.weekly,
              time: timeDate.toISOString(),
            };
          } else if (values.schedule.schedule_type === "daily") {
            scheduleData = {
              schedule_type: "daily",
              date: values.schedule.date,
              time: timeDate.toISOString(),
            };
          } else if (values.schedule.schedule_type === "yearly") {
            scheduleData = {
              schedule_type: "yearly",
              date: values.schedule.date,
              time: timeDate.toISOString(),
            };
          }
        }

        const taskData = {
          ...values,
          ticket_id: ticket?._id,
          due_date: new Date(values.due_date).toISOString(),
          schedule: values.isSchedule ? scheduleData : undefined
        };

        if (editTask) {
          await updatedTask({ id: editTask?._id, taskData }).unwrap();
        } else {
          await createTask(taskData).unwrap();
        }

        refetch();
        helpers.resetForm();
        setShowAddTask(false);
      } catch (err) {
        console.error('Error saving task:', err);
        helpers.setStatus(err?.data?.message || 'Failed to save task');
      } finally {
        helpers.setSubmitting(false);
      }
    }


  });



  const handleCommentChange = (taskId, value) => {
    setTaskComment((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleTaskCommentSubmit = async (e, taskId) => {
    e.preventDefault();
    const text = taskComment[taskId] || "";

    if (!text.trim() && !taskImageFile) return;

    try {
      let imageUrl = null;

      if (taskImageFile) {
        const formData = new FormData();
        formData.append("file", taskImageFile);
        imageUrl = await ImageUploader(formData);
      }

      await addComment({
        task_id: taskId,
        text,
        user_id: currentUser?._id,
        file: imageUrl,
      }).unwrap();


      setTaskComment((prev) => ({ ...prev, [taskId]: "" }));
      setTaskImagePreview(null);
      setTaskImageFile(null);
      refetch();
    } catch (err) {
      console.error('Error adding task comment:', err);
    }
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() && !imagePreview) return;

    try {
      let imageUrl = null;

      if (imagesfile) {
        const formData = new FormData();
        formData.append("file", imagesfile);
        imageUrl = await ImageUploader(formData);
      }

      await addComment({
        ticket_id: ticket._id,
        text: comment,
        user_id: currentUser?._id,
        file: imageUrl,
      }).unwrap();

      setComment("");
      setImagePreview(null);

      refetch();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };


  // Update ticket status
  const handleAddStatus = async () => {
    try {
      setUpdatingStatus(true);
      // const existingStatus = ticket?.status?.find((status) => !status?.task_id);

      {
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

          {(ticket?.creator?._id === currentUser?._id) && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Ticket Status</h3>
              </div>

              <div className="space-y-3">
                {!ticket?.status || ticket?.status?.filter((s) => !s?.task_id).length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No status history found.</p>
                  </div>
                ) : (
                  (() => {
                    const filteredStatuses = ticket.status.filter((status) => !status?.task_id);
                    const lastStatus = filteredStatuses[filteredStatuses.length - 1];

                    return (
                      <div key={lastStatus._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`bg-gradient-to-r ${getStatusColor(lastStatus.status)} px-3 py-1 rounded-lg text-xs font-medium`}>
                              {lastStatus.status}
                            </span>
                            <span className="text-xs text-gray-500">Update #{lastStatus.updateCount || 0}</span>
                          </div>
                          <div>
                            <button
                              onClick={() => openEditStatusModal(lastStatus)}
                              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                              title="Edit status"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteStatus(lastStatus._id)}
                              disabled={deletingStatus}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete status"
                            >
                              {deletingStatus ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Status ID: {lastStatus._id}</div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          )}


          {/* Tasks Section */}
          <div className="bg-white rounded-2xl max-h-screen  shadow-md p-6 overflow-y-scroll">
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
                      <div className="bg-gray-50 rounded-xl p-4 text-sm shadow-sm">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Assigned By */}
                          <div>
                            <p className="text-gray-500 font-medium">Assigned By</p>
                            <p className="text-gray-800">
                              {task.creator && typeof task.creator === 'object' && task.creator.full_name
                                ? `${task.creator.full_name} (${task.creator.username})`
                                : typeof task.creator === 'string'
                                  ? UserData?.find((user) => user._id === task.creator)?.full_name || 'Not assigned'
                                  : 'Not assigned'}
                            </p>
                          </div>

                          {/* Assigned To */}
                          <div>
                            <p className="text-gray-500 font-medium">Assigned To</p>
                            <p className="text-gray-800">
                              {task.assign && typeof task.assign === 'object' && task.assign.full_name
                                ? `${task.assign.full_name} (${task.assign.username})`
                                : typeof task.assign === 'string'
                                  ? UserData?.find((user) => user._id === task.assign)?.full_name || 'Not assigned'
                                  : 'Not assigned'}
                            </p>
                          </div>

                          {/* Due Date */}
                          <div>
                            <p className="text-gray-500 font-medium">Due Date</p>
                            <p
                              className={`${task.due_date && new Date(task.due_date) < new Date()
                                ? 'text-red-500 font-semibold'
                                : 'text-gray-800'
                                }`}
                            >
                              {task.due_date ? formatDate(task.due_date) : 'Not set'}
                              {task.due_date && new Date(task.due_date) < new Date() && (
                                <span className="ml-1 text-red-500 text-xs">⏳ Overdue</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Schedule Details (only if isSchedule is true) */}
                        {task.isSchedule && task.schedule && (
                          <div className="mt-4 border-t pt-4">
                            <h3 className="text-gray-700 font-semibold mb-2">Schedule Details</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-gray-500 font-medium">Schedule Type</p>
                                <p className="text-gray-800">{task.schedule.schedule_type}</p>
                              </div>

                              <div>
                                <p className="text-gray-500 font-medium">Days</p>
                                <p className="text-gray-800">
                                  {task.schedule.weekly?.length > 0
                                    ? task.schedule.weekly.join(', ')
                                    : 'No days selected'}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500 font-medium">Scheduled Time</p>
                                <p className="text-gray-800">
                                  {task.schedule?.time
                                    ? new Date(task.schedule.time).toLocaleString('en-US', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    })
                                    : 'Not set'}
                                </p>

                              </div>
                            </div>
                          </div>
                        )}
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
                            value={taskComment[task._id] || ""}
                            onChange={(e) => handleCommentChange(task._id, e.target.value)}
                            placeholder="Write a comment for this task..."
                            className="w-full min-h-[100px] resize-none rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                          />



                          <div className="flex justify-end gap-5 items-center mt-2">
                            {taskImagePreview && (
                              <div className="mt-4 relative">
                                {typeof taskImagePreview === "string" ? (
                                  <img
                                    src={taskImagePreview}
                                    alt="Preview"
                                    className="w-full max-h-18 rounded-lg object-contain border border-gray-200"
                                  />
                                ) : (
                                  <div className="flex items-center gap-2 border p-2 rounded bg-gray-100">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-blue-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                    <span className="text-sm text-gray-700">{taskImagePreview.name}</span>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setTaskImagePreview(null)}
                                  className="absolute -top-3 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}

                            <label
                              htmlFor={`taskFileUpload-${task._id}`}
                              className="cursor-pointer text-md p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-lg hover:scale-105 transition-transform duration-200"
                            >
                              <LuImagePlus />
                            </label>
                            <input
                              id={`taskFileUpload-${task._id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setTaskImageFile(file);

                                  if (file.type.startsWith("image/")) {
                                    // agar image hai to preview image
                                    setTaskImagePreview(URL.createObjectURL(file));
                                  } else {
                                    // pdf / zip / docx ke liye object with name
                                    setTaskImagePreview({
                                      type: "file",
                                      name: file.name,
                                    });
                                  }
                                }
                              }}
                            />


                            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded-lg">
                              Add Comment
                            </button>
                          </div>
                        </form>

                        {task?.comment?.length > 0 && (
                          <div className="mt-4 max-h-96 overflow-y-auto space-y-4 pr-2">
                            {task.comment.map((c, idx) => (
                              <div
                                key={c?._id || idx}
                                className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                  <p className="text-gray-800 text-sm leading-relaxed">{c.text}</p>

                                  {c.file && (
                                    <div className="mt-2">
                                      <span className="text-sm text-gray-600">Attachment: </span>
                                      <a
                                        href={c.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-sm hover:underline"
                                      >
                                        View
                                      </a>
                                      <a
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDownload(c.file, c.text || 'attachment');
                                        }}
                                        target="_blank"
                                        download
                                        className="text-green-600 cursor-pointer text-sm hover:underline ml-2"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                                  <span>
                                    By:{' '}
                                    {Array.isArray(c?.creator) && c?.creator.length > 0
                                      ? c.creator.map((dets, i) => (
                                        <span key={i}>
                                          {dets?.full_name || 'Unknown'}
                                          {i < c.creator.length - 1 ? ', ' : ''}
                                        </span>
                                      ))
                                      : 'Unknown'}
                                  </span>
                                  <span className="text-xs">
                                    {c?.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}
                                  </span>
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
          {(ticket?.creator?._id === currentUser?._id) && <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setShowStatusModal(true)} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Change Ticket Status
              </button>
            </div>
          </div>}

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

              <div className="flex justify-end gap-3 items-center">



                {imagePreview && (
                  <div className="mt-4 relative">
                    {typeof imagePreview === "string" ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-18 rounded-lg object-contain border border-gray-200"
                      />
                    ) : (
                      <div className="flex items-center gap-2 border p-2 rounded bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">{imagePreview.name}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-3 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}




                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer text-xl p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  <LuImagePlus />
                </label>

                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);

                      if (file.type.startsWith("image/")) {
                        setImagePreview(URL.createObjectURL(file));
                      } else {

                        setImagePreview({
                          type: "file",
                          name: file?.name,
                        });

                      }
                    }
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Comments</h2>

            {ticket?.comment?.length > 0 ? (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {ticket.comment.map((c, index) => (
                  <div
                    key={c._id || index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <p className="text-gray-800 text-sm leading-relaxed">{c.text}</p>

                      {c.file && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Attachment: </span>
                          <a href={c.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                            View
                          </a>
                          <a onClick={(e) => {
                            e.preventDefault();
                            handleDownload(c.file, c.text || "attachment");
                          }}
                            target="_blank" download className="text-green-600  cursor-pointer text-sm hover:underline ml-2">
                            Download
                          </a>
                        </div>
                      )}

                    </div>

                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>By: {c.creator?.full_name || 'Unknown'}</span>
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Just now'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
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


              {/* Is Schedule Checkbox */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isSchedule"
                    checked={addTaskForm.values.isSchedule}
                    onChange={addTaskForm.handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-600">Is Scheduled</span>
                </label>
              </div>

              {/* Conditional Schedule Fields */}
              {addTaskForm.values.isSchedule && (
                <div className="space-y-4 mt-3 p-3 border rounded-lg bg-gray-50">

                  {/* Schedule Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Schedule Type *</label>
                    <select
                      name="schedule.schedule_type"
                      value={addTaskForm.values.schedule.schedule_type}
                      onChange={addTaskForm.handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select...</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="daily">Daily</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {/* Date (for Monthly, Daily, Yearly) */}
                  {(addTaskForm.values.schedule.schedule_type === "Monthly" ||
                    addTaskForm.values.schedule.schedule_type === "daily" ||
                    addTaskForm.values.schedule.schedule_type === "yearly") && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date *</label>
                        <input
                          type="date"
                          name="schedule.date"
                          value={addTaskForm.values.schedule.date}
                          onChange={addTaskForm.handleChange}
                          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    )}

                  {/* Weekly (multiple select) */}
                  {addTaskForm.values.schedule.schedule_type === "Weekly" && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Select Days *</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                          <label
                            key={day}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition
            ${addTaskForm.values.schedule.weekly.includes(day)
                                ? "bg-blue-500 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                              }`}
                          >
                            <input
                              type="checkbox"
                              value={day}
                              checked={addTaskForm.values.schedule.weekly.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addTaskForm.setFieldValue("schedule.weekly", [
                                    ...addTaskForm.values.schedule.weekly,
                                    day,
                                  ]);
                                } else {
                                  addTaskForm.setFieldValue(
                                    "schedule.weekly",
                                    addTaskForm.values.schedule.weekly.filter((d) => d !== day)
                                  );
                                }
                              }}
                              className="hidden"
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                      {addTaskForm.touched.schedule?.weekly && addTaskForm.errors.schedule?.weekly && (
                        <p className="text-xs text-red-600 mt-1">{addTaskForm.errors.schedule.weekly}</p>
                      )}
                    </div>
                  )}


                  {/* Time (for all types) */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time *</label>
                    <input
                      type="time"
                      name="schedule.time"
                      value={addTaskForm.values.schedule.time}
                      onChange={addTaskForm.handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}



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
              <button onClick={handleAddStatus} disabled={updatingStatus} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
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
