import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCreateMutation, useDeleteDepartmentMutation, useGetDepartmentQuery, useUpdateDapartmentMutation } from '../../services/Department.service';

export default function DepartmentTable() {
  const [inputValue, setInputValue] = useState('');
  const [clickInput, setClickInput] = useState(false);
  const [ClickId, setClickId] = useState('');
  const [create] = useCreateMutation();
  const { data, isLoading, refetch } = useGetDepartmentQuery();
  const [upddatDepart, setUpdateDepart] = useState('');

  const [deleteDepartment, { isLoading: DepDeleteLoad }] = useDeleteDepartmentMutation();
  const [updateDapartment] = useUpdateDapartmentMutation();

  const createHandler = async () => {
    try {
      const res = await create({ name: inputValue }).unwrap();

      console.log(res);
      setInputValue('');
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandle = async (id) => {
    try {
      const res = await deleteDepartment(id).unwrap();

      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const updateHandler = async (id, data) => {
    try {
      const res = await updateDapartment({ id, data }).unwrap();

      console.log(res);
      setClickInput(false);
      setClickId('');
      setUpdateDepart('');
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      createHandler(inputValue.trim());
      setInputValue('');
    }

    if (e.key === 'Enter' && upddatDepart.trim() !== '') {
      updateHandler(ClickId, { name: upddatDepart.trim() });
      setInputValue('');
    }
  };

  if (isLoading) {
    return <div>loading .....</div>;
  }

  return (
    <div className="w-full px-10 mt-12">
      {/* Heading + Tagline */}
      <div className=" mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
        <p className="text-gray-500 text-sm mt-1">Add, manage, and organize all your departments in one place.</p>
      </div>

      {/* Table Container */}
      <div className="bg-white w-full shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
        </div>

        {/* Input Row */}
        <div className="px-6 py-4 border-b border-gray-200">
          <input type="text" placeholder="Add department" className="w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
        </div>

        {/* Department List */}
        <div>
          {data?.data?.map((dept, index) => (
            <div key={index} className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50">
              <div className="px-6 py-4 border-b border-gray-200">
                {clickInput && ClickId === dept._id ? (
                  <input
                    type="text"
                    placeholder="Add department"
                    className="w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={upddatDepart ? upddatDepart : dept.name}
                    onChange={(e) => setUpdateDepart(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <span
                    onClick={() => {
                      setClickId(dept._id);
                      setClickInput(true);
                    }}
                    className="text-gray-700"
                  >
                    {dept.name}
                  </span>
                )}
              </div>
              <button
                disabled={DepDeleteLoad}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this department?')) {
                    deleteHandle(dept._id);
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {data?.data?.length === 0 && <div className="px-6 py-6 text-center text-gray-400 text-sm">No departments added yet. Start by typing above and pressing Enter.</div>}
        </div>
      </div>
    </div>
  );
}
