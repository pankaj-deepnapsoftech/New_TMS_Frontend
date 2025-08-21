import { useState } from 'react';
import { UserModal } from '@components/Modals/UserModal';

export default function UsersPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Heading & Tagline */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">Manage and assign users efficiently</p>
      </div>

      {/* Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Users
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Full Name</th>
              <th className="px-4 py-2 text-left text-gray-700">User Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-gray-700">Phone</th>
              <th className="px-4 py-2 text-left text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-gray-700">Department</th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">
                {' '}
                <button className="text-blue-400 hover:text-blue-600  hover:underline">Edit</button>
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">
                {' '}
                <button className="text-blue-400 hover:text-blue-600  hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && <UserModal onClose={() => setOpen(false)} />}
    </div>
  );
}
