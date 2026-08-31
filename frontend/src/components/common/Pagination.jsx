import React from 'react';

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const pages = [];
  
  // Generate page numbers
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  // Show limited pages with ellipsis
  const getVisiblePages = () => {
    if (lastPage <= 5) return pages;
    
    if (currentPage <= 3) {
      return [1, 2, 3, '...', lastPage];
    }
    
    if (currentPage >= lastPage - 2) {
      return [1, '...', lastPage - 2, lastPage - 1, lastPage];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination">
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <li 
            key={index} 
            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
          >
            <button 
              className="page-link" 
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;