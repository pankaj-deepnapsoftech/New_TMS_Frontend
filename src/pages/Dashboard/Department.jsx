import React, { useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  useCreateMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentQuery,
  useUpdateDapartmentMutation,
} from '../../services/Department.service';
import LoadingPage from '@/components/Loading/Loading';
import Pagination from '@components/ui/Pagination';

export default function DepartmentTable() {
  const [inputValue, setInputValue] = useState('');
  const [clickInput, setClickInput] = useState(false);
  const [ClickId, setClickId] = useState('');
  const [upddatDepart, setUpdateDepart] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [create] = useCreateMutation();
  const { data, isLoading, refetch } = useGetDepartmentQuery({ page, limit });
  const [deleteDepartment, { isLoading: DepDeleteLoad }] = useDeleteDepartmentMutation();
  const [updateDapartment] = useUpdateDapartmentMutation();

  const [localDepartments, setLocalDepartments] = useState([]);

  // Keep local state in sync with API data
  React.useEffect(() => {
    if (data?.data) setLocalDepartments(data.data);
  }, [data]);

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

  // ✅ Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return; // dropped outside list

    const items = Array.from(localDepartments);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setLocalDepartments(items);

    // You can call an API to save the new order here
    console.log('New order:', items.map((i) => i._id));
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full h-screen px-4 md:px-10 mt-12">
      {/* Heading + Total Departments */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Department Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create, edit, and organize your departments with ease.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 shadow-sm flex items-center gap-3">
            <p className="text-sm text-blue-700 whitespace-nowrap">Total Departments:</p>
            <h3 className="text-xl font-semibold text-blue-900">{data?.total || 0}</h3>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Departments</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Add new department..."
              className="flex-1 sm:w-[220px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={createHandler}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm"
            >
              <Plus size={16} /> Add
            </button>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 bg-gray-50/80 rounded-xl px-4 py-2.5 pl-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all duration-300 shadow-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Department List with Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="departments">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {localDepartments?.map((dept, index) => (
                  <Draggable key={dept._id} draggableId={dept._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
                      >
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
                            className="text-red-500 w-20 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Pagination */}
      <div className="mt-6 mb-4">
        <Pagination currentPage={page} onPageChange={setPage} totalPages={data?.totalPage} />
      </div>
    </div>
  );
}
