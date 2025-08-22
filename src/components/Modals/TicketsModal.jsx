/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicketModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    priority: 'Medium',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Log the request details for debugging
    const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/v1/ticket/create`;
    console.log('Making API request to:', apiUrl);
    console.log('Request payload:', formData);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        // Success - close modal and reset form
        setFormData({
          title: '',
          description: '',
          department: '',
          priority: 'Medium',
          due_date: ''
        });
        onClose();
        // You can add a success notification here
        console.log('Ticket created successfully:', result.data);
      } else {
        setError(result.message || `Server error: ${response.status}`);
      }
    } catch (err) {
      console.error('Network error details:', err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.name === 'SyntaxError') {
        setError('Invalid response from server. Please try again.');
      } else {
        setError(`Network error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Modal Content */}
          <motion.div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto" initial={{ y: '-100px', opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: '-100px', opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"> Create New Ticket</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✖
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Ticket Title */}
              <div>
                <label className="text-sm font-medium">Ticket Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Enter ticket title..." 
                  className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the ticket..." 
                  rows="3" 
                  className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium">Department *</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="68a5c292e7b0c7fd04d669f1">Development</option>
                  <option value="68a5c292e7b0c7fd04d669f2">Design</option>
                  <option value="68a5c292e7b0c7fd04d669f3">Support</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <input 
                  type="datetime-local" 
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              {/* Team Assignment */}
              <div>
                <label className="text-sm font-medium">Team Assignment (0)</label>
                <input type="text" placeholder="Search employees..." className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button 
                onClick={onClose} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
