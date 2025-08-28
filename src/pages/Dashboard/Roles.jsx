/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { RolesModal } from '@components/Modals/RoleModal';
import { useGetRoleQuery, useDeleteRoleMutation } from '@/services/Roles.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const user = useSelector((state) => state.Auth.user);

  const { data: rolesData, isLoading, error, refetch } = useGetRoleQuery(user?._id);
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const handleModalClose = () => {
    setOpen(false);
    setEditData(null);
    refetch();
  };

  const handleAddRole = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEditRole = (role) => {
    setEditData(role);
    setOpen(true);
  };

  const handleDeleteRole = async (roleId, roleName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the role "${roleName}"?\n\nThis action cannot be undone.`);
    if (!isConfirmed) return;

    try {
      await deleteRole(roleId).unwrap();
      toast.success(`Role "${roleName}" deleted successfully! 🗑️`);
      refetch();
    } catch (error) {
      toast.error('Failed to delete role. Please try again! ❌');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4 text-lg">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-500 text-xl font-semibold">Error loading roles</div>
          <div className="text-gray-500 mt-2">{error.message}</div>
        </div>
      </div>
    );
  }

  const roles = rolesData?.data || [];

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Roles Management System</h1>
            <p className="text-gray-600 text-base sm:text-lg">Manage roles and permissions for your loan application</p>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{roles.length}</div>
              <div className="text-sm text-gray-500">Total Roles</div>
            </div>
            <button
              onClick={handleAddRole}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl 
              hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Add New Role
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg text-lg sm:text-2xl">👥</div>
            <div className="ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{roles.length}</div>
              <div className="text-gray-500 text-sm sm:text-base">Active Roles</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg text-lg sm:text-2xl">🔐</div>
            <div className="ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{roles.reduce((total, role) => total + role.allowedPage.length, 0)}</div>
              <div className="text-gray-500 text-sm sm:text-base">Total Permissions</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg text-lg sm:text-2xl">⚡</div>
            <div className="ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{roles.filter((role) => role.allowedPage.length > 2).length}</div>
              <div className="text-gray-500 text-sm sm:text-base">Admin Roles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Table (unchanged) */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Role Management</h2>
          <p className="text-gray-600 text-sm">Manage user roles and their access permissions</p>
        </div>

        {/* Table kept as-is */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Access Permissions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-6xl mb-4">📋</div>
                      <div className="text-xl font-semibold text-gray-800 mb-2">No roles found</div>
                      <div className="text-gray-500 mb-4">Create your first role to get started</div>
                      <button onClick={handleAddRole} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Create First Role
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center text-white font-semibold">{role.role.charAt(0).toUpperCase()}</div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{role.role}</div>
                          <div className="text-sm text-gray-500">Role ID: {role._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {role.allowedPage.map((page) => (
                          <span key={page._id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {page.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role._id, role.role)}
                          disabled={isDeleting}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <span className="mr-1">🗑️</span>
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && <RolesModal onClose={handleModalClose} editData={editData} />}
    </div>
  );
}
