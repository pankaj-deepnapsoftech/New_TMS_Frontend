import { useState } from "react";
import { Plus, X } from "lucide-react";

const initialNotes = [];

export default function ImportantNotesPage() {
  const [notes, setNotes] = useState(initialNotes);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    leads: "",
    deals: "",
    customer: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNote = {
      id: Date.now(),
      leads: Number(formData.leads),
      deals: formData.deals.split(",").map((d) => d.trim()),
      customer: formData.customer.split(",").map((c) => c.trim()),
    };

    setNotes([...notes, newNote]);
    setFormData({ leads: "", deals: "", customer: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Important Notes</h1>
        <button
          onClick={() => setShowModal(true)}
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notes.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500 italic">
                  No notes available
                </td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50">
                  <td className="p-3">{note.leads}</td>
                  <td className="p-3">{note.deals.join(", ")}</td>
                  <td className="p-3">{note.customer.join(", ")}</td>
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
              <h2 className="text-lg font-semibold">Add Important Notes</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Leads</label>
                <input
                  type="number"
                  name="leads"
                  value={formData.leads}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Deals (comma separated)
                </label>
                <input
                  type="text"
                  name="deals"
                  value={formData.deals}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Deal A, Deal B"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Customers (comma separated)
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Customer X, Customer Y"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
