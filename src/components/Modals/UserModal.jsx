import { useState } from "react";


export function UserModal({ onClose }) {
  // eslint-disable-next-line no-unused-vars
  const [roleName, setRoleName] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Role Name:", roleName, "Tag:", tag);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[600px] h-[300px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Role</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Department</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a department --</option>
              <option value="full_access">option 1</option>
              <option value="read_only">option 2</option>
              <option value="editor">option 3</option>
            </select>
          </div>

          {/* Select Tag */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a role --</option>
              <option value="full_access">option 1</option>
              <option value="read_only">option 2</option>
              <option value="editor">option 3</option>
            </select>
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
