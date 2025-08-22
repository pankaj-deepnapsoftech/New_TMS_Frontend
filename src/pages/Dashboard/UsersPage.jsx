import { useState } from 'react';
import { UserModal } from '@components/Modals/UserModal';
import { useGetUserQuery } from '../../services/Users.service';

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetUserQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Heading & Tagline */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">Manage and assign users efficiently</p>
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
            {data?.data?.length > 0 ? (
              data.data.map((user, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="px-4 py-2">{user?.full_name || '-'}</td>
                  <td className="px-4 py-2">{user?.username || '-'}</td>
                  <td className="px-4 py-2">{user?.email || '-'}</td>
                  <td className="px-4 py-2">{user?.phone || '-'}</td>
                  <td className="px-4 py-2">{user?.role?.role || '-'}</td>
                  <td className="px-4 py-2">{user?.department?.name || '-'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => setOpen(true)} className="text-blue-400 hover:text-blue-600 hover:underline">
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && <UserModal onClose={() => setOpen(false)} />}
    </div>
  );
}
