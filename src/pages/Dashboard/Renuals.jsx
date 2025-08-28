// src/pages/RenualsPage.jsx
import {  useState } from 'react'; 
import { Plus, X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetRenualQuery, useUpdateRenualMutation, useDeleteRenualMutation, useCreateRenualMutation } from '@/services/Renuals.service';
import Pagination from '@components/ui/Pagination';

export default function RenualsPage() {
  const [page, setPage] = useState(1);

  // --------------------- rtk queries ----------------------
  const [createRenual, { isloading: CreateRenualLoading }] = useCreateRenualMutation();
  const { data: renuals, isLoading: getRenualsLoad, refetch } = useGetRenualQuery(page); 
  const [deleteRenual, { isLoading: deleteRenualLoad }] = useDeleteRenualMutation();
  const [updateRenual, { isLoading: updateRenualLoad }] = useUpdateRenualMutation();

  const [editable, setEditable] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this renewal?')) return;

    try {
      const res = await deleteRenual(id).unwrap();
      toast.success(res.message || 'Deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Error deleting');
    }
  };

  const [showModal, setShowModal] = useState(false);

  const validationSchema = Yup.object({
    customer: Yup.string().required('Customer is required'),
    renual_date: Yup.date().required('Renewal date is required'),
    product: Yup.string().required('Product is required'),
  });

  const handleAddRenual = async (values, { resetForm }) => {
    const newRenual = {
      id: renuals.length + 1,
      ...values,
    };
    resetForm();
    setShowModal(false);

    try {
      let res;
      if (editable) {
        res = await updateRenual({ id: values._id, values }).unwrap();
      } else {
        res = await createRenual(newRenual).unwrap();
      }
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  if (getRenualsLoad) {
    return <div>loging ........</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Renewals</h1>
        <button
          onClick={() => {
            (setShowModal(true), setEditable(null));
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus size={18} /> Add Renewal
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Renewal Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product / Service</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {renuals?.data?.length > 0 ? (
              renuals?.data?.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="px-6 py-4 font-medium text-gray-800">{r.customer}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">{new Date(r.renual_date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{r.product}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditable(r);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>

                    {/* Delete Button */}
                    <button disabled={deleteRenualLoad} onClick={() => handleDelete(r._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500 italic">
                  No renewals added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Renewal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{editable ? 'Edit Renewal' : 'Add Renewal'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <Formik initialValues={editable || { customer: '', renual_date: '', product: '' }} enableReinitialize={true} validationSchema={validationSchema} onSubmit={handleAddRenual}>
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <Field name="customer" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200" />
                    <ErrorMessage name="customer" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Renewal Date</label>
                    <Field name="renual_date" type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200" />
                    <ErrorMessage name="renual_date" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <Field name="product" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200" />
                    <ErrorMessage name="product" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                    <button type="submit" disabled={CreateRenualLoading || updateRenualLoad} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {editable ? 'Edit' : 'Save'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      
      <Pagination currentPage={page} onPageChange={setPage} totalPages={renuals?.totalPage}  />
    </div>
  );
}
