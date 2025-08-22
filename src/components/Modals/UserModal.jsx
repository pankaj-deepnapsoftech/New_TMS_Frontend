import { useState } from 'react';
import { useAllRolesQuery } from '../../services/Roles.service';
import { useAllDepartmentsQuery } from '../../services/Department.service';
import { useUpdateUserMutation } from '../../services/Auth.service';
import { toast } from 'react-toastify';

export function UserModal({ onClose, id }) {
  // eslint-disable-next-line no-unused-vars
  const [roleName, setRoleName] = useState('');

  console.log(id)

  const { data: role, isLoading: roleLoad } = useAllRolesQuery();
  const {data:department,isLoading:departmentLoading} = useAllDepartmentsQuery();
  const [UpdateUser,{isLoading:userUpdateLoading}] = useUpdateUserMutation();
  const [tag, setTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      role:tag,
      department:roleName
    }
    try {
      const res = await UpdateUser({id,data}).unwrap();
      toast.success(res.message);
      onClose()
    } catch (error) {
      console.log(error);
    }
   console.log(data)
  };

  if (roleLoad || departmentLoading) {
    return <div>
      loging....
    </div>
  }

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
            <select value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">-- Select a department --</option>
              {department?.data?.map((item)=><option key={item?._id} value={item?._id} >{item?.name}</option>)}
            </select>
          </div>

          {/* Select Tag */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">-- Select a role --</option>
            { role?.data?.map((item)=> <option key={item?._id} value={item?._id}>{item?.role}</option>)}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button disabled={userUpdateLoading} type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
