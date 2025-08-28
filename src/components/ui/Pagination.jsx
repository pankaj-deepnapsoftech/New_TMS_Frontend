// src/components/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 0) return null;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageButton = (page) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      aria-current={page === currentPage ? "page" : undefined}
      className={`px-3 py-1.5 rounded-full border font-medium transition-all
        ${page === currentPage
          ? "bg-blue-600 text-white border-blue-600 shadow-md"
          : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
        }`}
    >
      {page}
    </button>
  );

  const pagesToShow = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    pagesToShow.push(1);

    if (currentPage > 4) {
      pagesToShow.push("ellipsis-prev");
    }

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) pagesToShow.push(i);
    }

    if (currentPage < totalPages - 3) {
      pagesToShow.push("ellipsis-next");
    }

    pagesToShow.push(totalPages);
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex items-center justify-center space-x-3 mt-8"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className={`flex items-center justify-center p-2 rounded-full border transition
          ${currentPage === 1
            ? "cursor-not-allowed opacity-50 bg-white border-gray-300 text-gray-400"
            : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
          }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Buttons */}
      {pagesToShow.map((page, idx) =>
        typeof page === "number" ? (
          renderPageButton(page)
        ) : (
          <span
            key={page + idx}
            className="px-3 text-gray-400 select-none"
          >
            …
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className={`flex items-center justify-center p-2 rounded-full border transition
          ${currentPage === totalPages
            ? "cursor-not-allowed opacity-50 bg-white border-gray-300 text-gray-400"
            : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
          }`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
