import { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { DashbaordNavLinks } from "@/constant/dashboardNavigation";

export function RolesModal({ onClose }) {
  const [roleName, setRoleName] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Role Name:", roleName, "Selected Pages:", selectedPages);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[600px] min-h-[350px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role Name</label>
            <input
              type="text"
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Select Pages */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Select Pages
            </label>
            <MultiSelect
              value={selectedPages}
              onChange={(e) => setSelectedPages(e.value)}
              options={DashbaordNavLinks}
              optionLabel="label"
              placeholder="Select pages"
              maxSelectedLabels={3}
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
