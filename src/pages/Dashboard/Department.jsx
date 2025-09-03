import { useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { useCreateMutation, useDeleteDepartmentMutation, useGetDepartmentQuery, useUpdateDapartmentMutation } from '../../services/Department.service';
import LoadingPage from '@/components/Loading/Loading';
import Pagination from '@components/ui/Pagination';

export default function DepartmentTable() {
  const [inputValue, setInputValue] = useState('');
  const [clickInput, setClickInput] = useState(false);
  const [ClickId, setClickId] = useState('');
  const [upddatDepart, setUpdateDepart] = useState('');
  const [page, setPage] = useState(1);

  const [create] = useCreateMutation();
  const { data, isLoading, refetch } = useGetDepartmentQuery(page);
  const [deleteDepartment, { isLoading: DepDeleteLoad }] = useDeleteDepartmentMutation();
  const [updateDapartment] = useUpdateDapartmentMutation();

  const createHandler = async () => {
    if (!inputValue.trim()) return;
    try {
      await create({ name: inputValue.trim() }).unwrap();
      setInputValue('');
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandle = async (id) => {
    try {
      await deleteDepartment(id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const updateHandler = async (id, data) => {
    try {
      await updateDapartment({ id, data }).unwrap();
      resetEdit();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      createHandler();
    }

    if (e.key === 'Enter' && upddatDepart.trim() !== '') {
      updateHandler(ClickId, { name: upddatDepart.trim() });
    }
  };

  const resetEdit = () => {
    setClickInput(false);
    setClickId('');
    setUpdateDepart('');
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full h-screen px-4 md:px-10 mt-12">
      {/* Heading */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Department Management</h1>
        <p className="text-gray-500 text-sm mt-1">Create, edit, and organize your departments with ease.</p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Departments</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <input type="text" placeholder="Add new department..." className="flex-1 sm:w-[220px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
            <button onClick={createHandler} className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Department List */}
        <div>
          {data?.data?.map((dept) => (
            <div key={dept._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition">
              {/* Editable Department Name */}
              <div className="w-full sm:w-auto">
                {clickInput && ClickId === dept._id ? (
                  <input
                    type="text"
                    className="w-full sm:w-[220px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={upddatDepart}
                    onChange={(e) => setUpdateDepart(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (upddatDepart.trim()) {
                        updateHandler(ClickId, { name: upddatDepart.trim() });
                      } else {
                        resetEdit();
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => {
                      setClickId(dept._id);
                      setClickInput(true);
                      setUpdateDepart(dept.name);
                    }}
                    className="text-gray-800 font-medium cursor-pointer hover:text-blue-600 break-words"
                  >
                    {dept.name}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {!clickInput && (
                  <button
                    onClick={() => {
                      setClickId(dept._id);
                      setClickInput(true);
                      setUpdateDepart(dept.name);
                    }}
                    className="text-blue-500 hover:text-blue-800 transition"
                  >
                    <Pencil size={18} />
                  </button>
                )}
                <button
                  disabled={DepDeleteLoad}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this department?')) {
                      deleteHandle(dept._id);
                    }
                  }}
                  className="text-red-500 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {data?.data?.length === 0 && <div className="px-6 py-6 text-center text-gray-400 text-sm">No departments added yet. Start by typing a name above.</div>}
        </div>
      </div>
      {/* Pagination */}
      <div className="mt-6 mb-4">
        <Pagination currentPage={page} onPageChange={setPage} totalPages={data?.totalPage} />
      </div>
    </div>
  );
}
