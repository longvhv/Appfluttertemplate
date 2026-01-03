import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
  className?: string;
}

// Memoized page number generator
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): (number | string)[] {
  const pages: (number | string)[] = [];
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = maxVisible;
    }

    if (currentPage >= totalPages - halfVisible) {
      startPage = totalPages - maxVisible + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  }

  return pages;
}

// Memoized page button component
const PageButton = React.memo<{
  page: number | string;
  isActive: boolean;
  onClick: (page: number) => void;
  disabled?: boolean;
}>(({ page, isActive, onClick, disabled }) => {
  const handleClick = useCallback(() => {
    if (typeof page === 'number' && !disabled) {
      onClick(page);
    }
  }, [page, onClick, disabled]);

  if (page === '...') {
    return (
      <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
        {page}
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-3 py-2 rounded-lg transition-colors
        ${isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={`Page ${page}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  );
});

PageButton.displayName = 'PageButton';

// Memoized navigation button
const NavButton = React.memo<{
  onClick: () => void;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
}>(({ onClick, disabled, label, icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-3 py-2 rounded-lg transition-colors
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
    aria-label={label}
  >
    {icon}
  </button>
));

NavButton.displayName = 'NavButton';

export const Pagination = React.memo<PaginationProps>(({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisible = 5,
  className = '',
}) => {
  const pages = useMemo(
    () => generatePageNumbers(currentPage, totalPages, maxVisible),
    [currentPage, totalPages, maxVisible]
  );

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goToFirst = useCallback(() => goToPage(1), [goToPage]);
  const goToLast = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);
  const goToPrev = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);
  const goToNext = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Pagination">
      {/* First Page */}
      {showFirstLast && (
        <NavButton
          onClick={goToFirst}
          disabled={isFirstPage}
          label="First page"
          icon={<ChevronsLeft className="w-4 h-4" />}
        />
      )}

      {/* Previous Page */}
      {showPrevNext && (
        <NavButton
          onClick={goToPrev}
          disabled={isFirstPage}
          label="Previous page"
          icon={<ChevronLeft className="w-4 h-4" />}
        />
      )}

      {/* Page Numbers */}
      {pages.map((page) => {
        const isActive = typeof page === 'number' && page === currentPage;

        return (
          <PageButton
            key={page}
            page={page}
            isActive={isActive}
            onClick={goToPage}
            disabled={isActive}
          />
        );
      })}

      {/* Next Page */}
      {showPrevNext && (
        <NavButton
          onClick={goToNext}
          disabled={isLastPage}
          label="Next page"
          icon={<ChevronRight className="w-4 h-4" />}
        />
      )}

      {/* Last Page */}
      {showFirstLast && (
        <NavButton
          onClick={goToLast}
          disabled={isLastPage}
          label="Last page"
          icon={<ChevronsRight className="w-4 h-4" />}
        />
      )}
    </nav>
  );
});

// Simple Pagination variant
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: SimplePaginationProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-4 py-2 rounded-lg flex items-center gap-2
          text-sm font-medium transition-colors
          ${currentPage === 1
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-foreground bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-4 py-2 rounded-lg flex items-center gap-2
          text-sm font-medium transition-colors
          ${currentPage === totalPages
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-foreground bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80'
          }
        `}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Compact Pagination (for mobile)
export interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CompactPaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center
          transition-colors
          ${currentPage === 1
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-foreground bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-sm text-muted-foreground min-w-[60px] text-center">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center
          transition-colors
          ${currentPage === totalPages
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-foreground bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80'
          }
        `}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}