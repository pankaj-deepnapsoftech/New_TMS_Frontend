/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicketModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');

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
            <div className="p-6 space-y-4">
              {/* Ticket Title */}
              <div>
                <label className="text-sm font-medium">Ticket Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter ticket title..." className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea placeholder="Describe the ticket..." rows="3" className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium">Department</label>
                <select className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>All Departments</option>
                  <option>Development</option>
                  <option>Design</option>
                  <option>Support</option>
                </select>
              </div>

              {/* Team Assignment */}
              <div>
                <label className="text-sm font-medium">Team Assignment (0)</label>
                <input type="text" placeholder="Search employees..." className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Ticket</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
