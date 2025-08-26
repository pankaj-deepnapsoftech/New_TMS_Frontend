// src/pages/ImportantNotesPage.jsx
import { useState } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateImportantNotesMutation, useDeleteImportantNotesMutation, useGetImportantNotesQuery, useUpdateImportantNotesMutation } from '@/services/ImportantNotes.services';

// 🔹 Reusable Chip/Badge MultiInput Component
function MultiInput({ label, values, setValues, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        setValues([...values, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeValue = (val) => {
    setValues(values.filter((v) => v !== val));
  };

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        {values.map((val, i) => (
          <span key={i} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
            {val}
            <button type="button" onClick={() => removeValue(val)} className="text-blue-700 hover:text-red-600">
              <X size={14} />
            </button>
          </span>
        ))}
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} className="flex-1 border-none focus:ring-0 outline-none text-sm" />
      </div>
    </div>
  );
}

export default function ImportantNotesPage() {
  const { data, isLoading, refetch } = useGetImportantNotesQuery();
  const [createNote, { isLoading: creating }] = useCreateImportantNotesMutation();
  const [updateNote, { isLoading: updating }] = useUpdateImportantNotesMutation();
  const [deleteNote, { isLoading: deleting }] = useDeleteImportantNotesMutation();

  const [showModal, setShowModal] = useState(false);
  const [editable, setEditable] = useState(null);

  // deals & customer are arrays now
  const [formData, setFormData] = useState({
    leads: '',
    deals: [],
    customer: [],
  });

  // ---------- Handlers ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      leads: Number(formData.leads),
      deals: formData.deals.filter((d) => d.trim() !== ''),
      customer: formData.customer.filter((c) => c.trim() !== ''),
    };

    try {
      let res;
      if (editable) {
        res = await updateNote({ id: editable._id, values: payload }).unwrap();
        toast.success(res?.message || 'Note updated successfully');
      } else {
        res = await createNote(payload).unwrap();
        toast.success(res?.message || 'Note created successfully');
      }
      setShowModal(false);
      setEditable(null);
      setFormData({ leads: '', deals: [], customer: [] });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Error saving note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await deleteNote(id).unwrap();
      toast.success(res?.message || 'Deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Error deleting note');
    }
  };

  // ---------- Render ----------
  if (isLoading) return <div className="p-6">Loading notes...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Important Notes</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditable(null);
            setFormData({ leads: '', deals: [], customer: [] });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Add Notes
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Leads</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Deals</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customers</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.data?.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                  No notes available
                </td>
              </tr>
            ) : (
              data?.data?.map((note) => (
                <tr key={note._id} className="hover:bg-gray-50">
                  <td className="p-3">{note.leads}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      {note.deals?.map((deal, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {deal}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      {note.customer?.map((cust, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {cust}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditable(note);
                        setFormData({
                          leads: note.leads,
                          deals: note.deals || [],
                          customer: note.customer || [],
                        });
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button disabled={deleting} onClick={() => handleDelete(note._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editable ? 'Edit Important Note' : 'Add Important Note'}</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Leads */}
              <div>
                <label className="block mb-1 font-medium">Leads</label>
                <input type="number" name="leads" value={formData.leads} onChange={(e) => setFormData({ ...formData, leads: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Deals MultiInput */}
              <MultiInput label="Deals" values={formData.deals} setValues={(vals) => setFormData({ ...formData, deals: vals })} placeholder="Type deal and press Enter" />

              {/* Customers MultiInput */}
              <MultiInput label="Customers" values={formData.customer} setValues={(vals) => setFormData({ ...formData, customer: vals })} placeholder="Type customer and press Enter" />

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={creating || updating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editable ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
