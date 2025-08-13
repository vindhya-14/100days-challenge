export default function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  const getPageRange = () => {
    const range = [];
    const maxVisible = 5; // Maximum number of visible page buttons
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6" role="navigation" aria-label="Pagination">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === 1 ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50 focus:z-20'}`}
              aria-label="First page"
            >
              <span className="sr-only">First</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zM6.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L2.832 10l3.938 3.71a.75.75 0 01.02 1.06z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === 1 ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50 focus:z-20'}`}
              aria-label="Previous page"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Show first page and ellipsis if needed */}
            {pageRange[0] > 1 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === 1 ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'}`}
                >
                  1
                </button>
                {pageRange[0] > 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Page numbers */}
            {pageRange.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pageNumber ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'}`}
                aria-current={page === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            ))}

            {/* Show last page and ellipsis if needed */}
            {pageRange[pageRange.length - 1] < totalPages && (
              <>
                {pageRange[pageRange.length - 1] < totalPages - 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                )}
                <button
                  onClick={() => setPage(totalPages)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === totalPages ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'}`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === totalPages ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50 focus:z-20'}`}
              aria-label="Next page"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l4.5 4.25a.75.75 0 11-1.04 1.08L11.168 10l3.938 3.71a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === totalPages ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50 focus:z-20'}`}
              aria-label="Last page"
            >
              <span className="sr-only">Last</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.21 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08L8.168 10 4.23 6.29a.75.75 0 01-.02-1.06zM11.79 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08L15.668 10l-3.938-3.71a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}