import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DepartmentTable() {
  const [departments, setDepartments] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setDepartments([...departments, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDelete = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full px-10 mt-12">
      {/* Heading + Tagline */}
      <div className=" mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add, manage, and organize all your departments in one place.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white w-full shadow-lg rounded-lg border mt-20 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
        </div>

        {/* Input Row */}
        <div className="px-6 py-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Add department"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Department List */}
        <div>
          {departments.map((dept, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50"
            >
              <span className="text-gray-700">{dept}</span>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {departments.length === 0 && (
            <div className="px-6 py-6 text-center text-gray-400 text-sm">
              No departments added yet. Start by typing above and pressing Enter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
