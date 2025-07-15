import React from 'react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  className?: string;
  currentPage?: number;
  lastPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({ links, className = '', currentPage, lastPage }) => {
  // If there are no links or only 3 or fewer (prev, current, next), don't show pagination
  if (!links || links.length <= 3) {
    return null;
  }

  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <nav className="flex items-center justify-between w-full">
        {/* Mobile pagination */}
        <div className="flex-1 flex justify-between sm:hidden">
          {links.length > 0 && currentPage && currentPage > 1 && (
            <a
              href={links[0].url || '#'}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </a>
          )}
          {links.length > 0 && currentPage && lastPage && currentPage < lastPage && (
            <a
              href={links[links.length - 1].url || '#'}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </a>
          )}
        </div>

        {/* Desktop pagination */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            {currentPage && lastPage && (
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{lastPage}</span>
              </p>
            )}
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {/* Render all pagination links */}
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url || '#'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${link.active
                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
                    ${i === 0 ? 'rounded-l-md' : ''}
                    ${i === links.length - 1 ? 'rounded-r-md' : ''}
                  `}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  aria-current={link.active ? 'page' : undefined}
                />
              ))}
            </nav>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
