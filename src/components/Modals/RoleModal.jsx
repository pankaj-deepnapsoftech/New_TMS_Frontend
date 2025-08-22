import { useState, useEffect, useRef } from 'react';
import { DashbaordNavLinks } from '@/constant/dashboardNavigation';
import { useCreateRoleMutation, useUpdateRoleMutation } from '@/services/Roles.service';
import { toast } from 'react-toastify';

export function RolesModal({ onClose, editData = null }) {
  const [roleName, setRoleName] = useState('');
  const [selectedPages, setSelectedPages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  
  const isLoading = isCreating || isUpdating;
  const isEditMode = !!editData;

  // Pre-fill form data when editing
  useEffect(() => {
    if (editData) {
      setRoleName(editData.role);
      setSelectedPages(editData.allowedPage);
    }
  }, [editData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (page) => {
    const isSelected = selectedPages.some(selected => selected.value === page.value);
    
    if (isSelected) {
      // Remove from selection
      setSelectedPages(selectedPages.filter(selected => selected.value !== page.value));
    } else {
      // Add to selection
      setSelectedPages([...selectedPages, page]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedPages.length === DashbaordNavLinks.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(DashbaordNavLinks.map(item => ({ label: item.label, value: item.value })));
    }
  };

  console.log(selectedPages);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Selected pages before sending:', selectedPages);
      
      // Ensure selectedPages contains the correct structure
      const formattedPages = selectedPages.map(page => {
        if (typeof page === 'string') {
          // If it's just a string, find the corresponding page object
          const pageObj = DashbaordNavLinks.find(item => item.value === page);
          return { label: pageObj.label, value: pageObj.value };
        }
        return page; // If it's already an object, return as is
      });
      
      if (isEditMode) {
        // Update existing role
        const updateData = {
          role: roleName,
          allowedPage: formattedPages
        };
        
        console.log('Role data being updated:', updateData);
        await updateRole({ id: editData._id, data: updateData }).unwrap();
        console.log('Role updated successfully');
        toast.success('Role updated successfully! 🎉', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Create new role
        const roleData = {
          role: roleName,
          allowedPage: formattedPages
        };
        
        console.log('Role data being sent:', roleData);
        await createRole(roleData).unwrap();
        console.log('Role created successfully');
        toast.success('Role created successfully! 🎉', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
    onClose();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role. Please try again! ❌', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-sky-700 rounded-t-3xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                {isEditMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditMode ? 'Edit Role' : 'Create New Role'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isEditMode ? 'Update role permissions and access rights' : 'Define a new role with specific permissions'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/20 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Name Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
          <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500">Enter a descriptive name for this role</p>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="e.g., Loan Manager, Credit Analyst, Admin" 
                value={roleName} 
                onChange={(e) => setRoleName(e.target.value)} 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white" 
                required 
              />
          </div>

            {/* Permissions Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Access Permissions <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500">Select the modules this role can access</p>
                </div>
              </div>
              
              {/* Custom Multi-Select Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left flex items-center justify-between"
                >
                  <div className="flex flex-wrap gap-1 min-h-[20px]">
                    {selectedPages.length === 0 ? (
                      <span className="text-gray-500">Choose permissions...</span>
                    ) : (
                      selectedPages.map((page, index) => (
                        <span
                          key={page.value}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {page.label}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange(page);
                            }}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {/* Select All Option */}
                    <div className="p-3 border-b border-gray-100">
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPages.length === DashbaordNavLinks.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="font-semibold text-gray-700">Select All</span>
                      </label>
                    </div>

                    {/* Individual Options */}
                    <div className="p-2">
                      {DashbaordNavLinks.map((page) => {
                        const isSelected = selectedPages.some(selected => selected.value === page.value);
                        return (
                          <label
                            key={page.value}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(page)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div className="flex items-center space-x-2">
                              <page.icon className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{page.label}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Selected Permissions Display */}
              {selectedPages.length > 0 && (
                <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Selected Permissions:</span>
                  </div>
                  <div className="space-y-2">
                    {selectedPages.map((page, index) => (
                      <div key={page.value || index} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-800">{page.label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPages = selectedPages.filter((_, i) => i !== index);
                            setSelectedPages(updatedPages);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Selected {selectedPages.length} permission(s)</span>
              </div>
            </div>

            {/* Current Role Info (Edit Mode) */}
            {isEditMode && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-800">Current Role Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Role ID:</span>
                    <span className="ml-2 font-mono text-blue-700">{editData._id.slice(-8)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 text-blue-700">Recently</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg> */}
                <span>Cancel</span>
            </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-700 text-white hover:from-blue-700 hover:to-sky-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Update Role</span>
                      </>
                    ) : (
                      <>
                        {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg> */}
                        <span>Create Role</span>
                      </>
                    )}
                  </>
                )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
