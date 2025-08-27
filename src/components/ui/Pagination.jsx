// src/components/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react"; 

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; 

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
     
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>

      
      <button
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded-lg border ${currentPage === 1
            ? "bg-blue-600 text-white border-blue-600"
            : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        1
      </button>

    
      {currentPage > 4 && <span className="px-2">...</span>}

     
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (page) =>
            page !== 1 &&
            page !== totalPages &&
            page >= currentPage - 1 &&
            page <= currentPage + 1
        )
        .map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg border ${page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        ))}

      
      {currentPage < totalPages - 3 && <span className="px-2">...</span>}

      {totalPages > 1 && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-lg border ${currentPage === totalPages
              ? "bg-blue-600 text-white border-blue-600"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          {totalPages}
        </button>
      )}

    
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>

  );
}
