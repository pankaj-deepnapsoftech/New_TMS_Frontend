/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import { useCreateTicketMutation, useUpdateTicketMutation } from '../../services/Ticket.service';
import { useGetDepartmentQuery } from '../../services/Department.service';
import { TicketvalidationSchema } from '../../Validation/TicketCreateValidation';


const TicketModal = ({ isOpen, onClose, editTicket }) => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const { data } = useGetDepartmentQuery();
  const DepartmentData = data?.data || [];
  const [UpdatedTicket] = useUpdateTicketMutation();

  // console.log(editTicket);
  const formik = useFormik({
    initialValues: {
      title: editTicket?.title || '',
      description: editTicket?.description || '',
      department: editTicket?.department?._id || editTicket?.department || '',
      priority: editTicket?.priority || 'Medium',
      due_date: editTicket?.due_date
        ? new Date(editTicket.due_date).toISOString().slice(0, 16)
        : '',
    },
    enableReinitialize: true,
    validationSchema: TicketvalidationSchema,
    onSubmit: async (values) => {
      try {
        if (editTicket?._id) {
         
          const res = await UpdatedTicket({ id: editTicket._id, values }).unwrap();
         
        } else {
          await createTicket(values).unwrap();
        }
        formik.resetForm();
        onClose();
      } catch (err) {
        console.error(err);
      }
    },

  });


  return (
    <AnimatePresence>
    { isOpen && (<motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto" initial={{ y: '-100px', opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: '-100px', opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
          <div className="flex justify-between items-center border-b border-gray-300  px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {editTicket ? 'Edit Ticket' : 'Create New Ticket'}
            </h2>

           

            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✖
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Ticket Title *</label>
              <input type="text" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter ticket title..." className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              {formik.errors.title && formik.touched.title && <p className="text-sm text-red-600 mt-1">{formik.errors.title}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Describe the ticket..." rows="3" className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              {formik.errors.description && formik.touched.description && <p className="text-sm text-red-600 mt-1">{formik.errors.description}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Department *</label>
              <select name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur} className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Department</option>
                {DepartmentData?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {formik.errors.department && formik.touched.department && <p className="text-sm text-red-600 mt-1">{formik.errors.department}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select name="priority" value={formik.values.priority} onChange={formik.handleChange} onBlur={formik.handleBlur} className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {formik.errors.priority && formik.touched.priority && <p className="text-sm text-red-600 mt-1">{formik.errors.priority}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <input type="datetime-local" name="due_date" value={formik.values.due_date} onChange={formik.handleChange} onBlur={formik.handleBlur} className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              {formik.errors.due_date && formik.touched.due_date && <p className="text-sm text-red-600 mt-1">{formik.errors.due_date}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Team Assignment (0)</label>
              <input type="text" placeholder="Search employees..." className="mt-1 w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

           
            <div className="flex justify-end gap-3 border-t border-gray-300 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? (editTicket ? 'Updating...' : 'Creating...')
                  : (editTicket ? 'Update Ticket' : 'Create Ticket')}
              </button>
            </div>

          </form>
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  );
};
export default TicketModal;
