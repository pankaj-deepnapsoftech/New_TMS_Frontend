import { useState } from "react";

export default function TicketModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Assign Ticket
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 onClick={() => setIsOpen(true)} className="text-lg font-semibold flex items-center gap-2">
                + Create New Ticket
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Ticket Title */}
              <div>
                <label className="text-sm font-medium">Ticket Title</label>
                <input
                  type="text"
                  placeholder="Enter ticket title..."
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="Describe the ticket..."
                  rows="3"
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium">Department</label>
                <select className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>All Departments</option>
                  <option>Development</option>
                  <option>Design</option>
                  <option>Support</option>
                </select>
              </div>

              {/* Team Assignment */}
              <div>
                <label className="text-sm font-medium">Team Assignment (0)</label>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="text-sm font-medium">Select Team Members</label>
                <div className="mt-2 space-y-2 border rounded-lg p-3">
                  {/* Example employee */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Hritik</p>
                      <p className="text-sm text-gray-500">Developer</p>
                    </div>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
