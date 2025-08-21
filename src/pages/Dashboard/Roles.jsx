import { useState } from 'react';
import { RolesModal } from '@components/Modals/RoleModal';
import { useGetRoleQuery, useDeleteRoleMutation } from '@/services/Roles.service';
import { toast } from 'react-toastify';

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Get the current user ID (you might need to get this from your auth context)
  const currentUserId = "68a43eed18ea5481a6c68551"; // This should come from your auth state
  
  // Fetch roles data
  const { data: rolesData, isLoading, error, refetch } = useGetRoleQuery(currentUserId);
  
  // Delete role mutation
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  // Refresh data when modal closes
  const handleModalClose = () => {
    setOpen(false);
    setEditData(null); // Reset edit data
    refetch(); // Refresh the roles data
  };

  // Handle add new role
  const handleAddRole = () => {
    setEditData(null); // Ensure no edit data
    setOpen(true);
  };

  // Handle edit role
  const handleEditRole = (role) => {
    setEditData(role); // Set the role data for editing
    setOpen(true);
  };

  // Handle delete role
  const handleDeleteRole = async (roleId, roleName) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the role "${roleName}"?\n\nThis action cannot be undone.`
    );
    
    if (!isConfirmed) {
      return; // User cancelled the deletion
    }
    
    try {
      await deleteRole(roleId).unwrap();
      console.log('Role deleted successfully');
      toast.success(`Role "${roleName}" deleted successfully! 🗑️`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      refetch(); // Refresh the roles data after deletion
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role. Please try again! ❌', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4 text-lg">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <div className="text-red-500 text-xl font-semibold">Error loading roles</div>
            <div className="text-gray-500 mt-2">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  const roles = rolesData?.data || [];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🏦 Roles Management System
            </h1>
            <p className="text-gray-600 text-lg">
              Manage roles and permissions for your loan application
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{roles.length}</div>
              <div className="text-sm text-gray-500">Total Roles</div>
            </div>
            <button 
              onClick={handleAddRole} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Add New Role</span>
        </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-800">{roles.length}</div>
              <div className="text-gray-500">Active Roles</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-800">
                {roles.reduce((total, role) => total + role.allowedPage.length, 0)}
              </div>
              <div className="text-gray-500">Total Permissions</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-800">
                {roles.filter(role => role.allowedPage.length > 2).length}
              </div>
              <div className="text-gray-500">Admin Roles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Role Management</h2>
          <p className="text-gray-600 text-sm">Manage user roles and their access permissions</p>
      </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Access Permissions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
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
                      <button 
                        onClick={handleAddRole}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
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
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {role.role.charAt(0).toUpperCase()}
                          </div>
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
                          <span
                            key={page._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                          >
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
