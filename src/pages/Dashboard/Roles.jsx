import { useState } from 'react';
import { RolesModal } from '@components/Modals/RoleModal';

export default function RolesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Heading & Tagline */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Roles Management</h1>
        <p className="text-gray-500">Manage and assign roles for your team efficiently</p>
      </div>

      {/* Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Role
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Role Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Pages</th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">Admin</td>
              <td className="px-4 py-2">Full Access</td>
              <td className="px-4 py-2">
                <button className="text-red-400 hover:text-red-600 hover:underline">Delete</button>
                <button className="text-blue-400 hover:text-blue-600  hover:underline">Edit</button>
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">Viewer</td>
              <td className="px-4 py-2">Read Only</td>
              <td className="px-4 py-2">
                <button className="text-red-400 hover:text-red-600 hover:underline">Delete</button>
                <button className="text-blue-400 hover:text-blue-600 hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && <RolesModal onClose={() => setOpen(false)} />}
    </div>
  );
}
