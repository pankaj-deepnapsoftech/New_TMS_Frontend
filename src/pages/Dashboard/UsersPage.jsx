import { useState } from 'react';
import { UserModal } from '@components/Modals/UserModal';
import { useGetUserQuery } from '../../services/Users.service';

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch } = useGetUserQuery();
  const [updateId, setUpdateId] = useState('');

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Heading & Tagline */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm sm:text-base">Manage and assign users efficiently</p>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border border-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">Full Name</th>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">User Name</th>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">Email</th>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">Phone</th>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">Role</th>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">Department</th>
              <th className="px-3 sm:px-4 py-2 text-left text-gray-700 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.length > 0 ? (
              data.data.map((user, idx) => (
                <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-3 sm:px-4 py-2">{user?.full_name || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">{user?.username || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">{user?.email || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">{user?.phone || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">{user?.role?.role || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">{user?.department?.name || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">
                    <button
                      onClick={() => {
                        setOpen(true);
                        setUpdateId(user._id);
                      }}
                      className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200 
                                 hover:bg-blue-100 hover:shadow-md text-xs sm:text-sm transition"
                    >
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
      {open && <UserModal onClose={() => setOpen(false)} refetch={refetch} id={updateId} />}
    </div>
  );
}
