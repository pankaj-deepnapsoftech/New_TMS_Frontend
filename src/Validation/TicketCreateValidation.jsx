import * as Yup from 'yup';

export const TicketvalidationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),

  description: Yup.string().max(1000, 'Description must be less than 1000 characters'),

  department: Yup.string().required('Please select a department'),

  priority: Yup.string().oneOf(['Low', 'Medium', 'High'], 'Invalid priority'),

  due_date: Yup.date().nullable().min(new Date(), 'Due date cannot be in the past'),
});
