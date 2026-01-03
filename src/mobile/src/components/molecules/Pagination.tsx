import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5, // Fewer on mobile
  disabled = false,
  size = 'md',
}: PaginationProps) {
  const { theme, isDarkMode } = useAppearance();

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    if (currentPage <= halfVisible + 1) {
      endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
    }

    if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    if (startPage > 2) {
      pages.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('ellipsis');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  };

  const sizes = {
    sm: { padding: 6, fontSize: 12, iconSize: 14, minWidth: 28 },
    md: { padding: 8, fontSize: 14, iconSize: 18, minWidth: 32 },
    lg: { padding: 10, fontSize: 16, iconSize: 20, minWidth: 36 },
  };

  const currentSize = sizes[size];
  const visiblePages = getVisiblePages();

  const isDisabled = (page?: number) => {
    if (disabled) return true;
    if (page === 1 && currentPage === 1) return true;
    if (page === totalPages && currentPage === totalPages) return true;
    return false;
  };

  const getButtonStyle = (isActive: boolean = false, pageDisabled: boolean = false) => [
    styles.button,
    {
      padding: currentSize.padding,
      minWidth: currentSize.minWidth,
      backgroundColor: isActive
        ? theme.colors.primary
        : isDarkMode
        ? theme.colors.gray[800]
        : '#FFFFFF',
      borderColor: isActive
        ? theme.colors.primary
        : isDarkMode
        ? theme.colors.border
        : theme.colors.gray[300],
      opacity: pageDisabled ? 0.5 : 1,
    },
  ];

  const getTextStyle = (isActive: boolean = false) => [
    styles.buttonText,
    {
      fontSize: currentSize.fontSize,
      color: isActive
        ? '#FFFFFF'
        : isDarkMode
        ? theme.colors.text.primary
        : theme.colors.gray[700],
    },
  ];

  return (
    <View style={styles.container}>
      {/* First Page */}
      {showFirstLast && (
        <TouchableOpacity
          onPress={() => handlePageChange(1)}
          disabled={isDisabled(1)}
          style={getButtonStyle(false, isDisabled(1))}
          activeOpacity={0.7}
        >
          <ChevronsLeft
            size={currentSize.iconSize}
            color={
              isDisabled(1)
                ? isDarkMode
                  ? theme.colors.gray[600]
                  : theme.colors.gray[400]
                : isDarkMode
                ? theme.colors.text.primary
                : theme.colors.gray[700]
            }
          />
        </TouchableOpacity>
      )}

      {/* Previous Page */}
      {showPrevNext && (
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          style={getButtonStyle(false, currentPage === 1 || disabled)}
          activeOpacity={0.7}
        >
          <ChevronLeft
            size={currentSize.iconSize}
            color={
              currentPage === 1 || disabled
                ? isDarkMode
                  ? theme.colors.gray[600]
                  : theme.colors.gray[400]
                : isDarkMode
                ? theme.colors.text.primary
                : theme.colors.gray[700]
            }
          />
        </TouchableOpacity>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <View
              key={`ellipsis-${index}`}
              style={[
                styles.button,
                {
                  padding: currentSize.padding,
                  minWidth: currentSize.minWidth,
                  borderColor: 'transparent',
                },
              ]}
            >
              <MoreHorizontal
                size={currentSize.iconSize}
                color={
                  isDarkMode ? theme.colors.gray[600] : theme.colors.gray[400]
                }
              />
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={page}
            onPress={() => handlePageChange(page)}
            disabled={disabled}
            style={getButtonStyle(page === currentPage, disabled)}
            activeOpacity={0.7}
          >
            <Text style={getTextStyle(page === currentPage)}>{page}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Next Page */}
      {showPrevNext && (
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          style={getButtonStyle(false, currentPage === totalPages || disabled)}
          activeOpacity={0.7}
        >
          <ChevronRight
            size={currentSize.iconSize}
            color={
              currentPage === totalPages || disabled
                ? isDarkMode
                  ? theme.colors.gray[600]
                  : theme.colors.gray[400]
                : isDarkMode
                ? theme.colors.text.primary
                : theme.colors.gray[700]
            }
          />
        </TouchableOpacity>
      )}

      {/* Last Page */}
      {showFirstLast && (
        <TouchableOpacity
          onPress={() => handlePageChange(totalPages)}
          disabled={isDisabled(totalPages)}
          style={getButtonStyle(false, isDisabled(totalPages))}
          activeOpacity={0.7}
        >
          <ChevronsRight
            size={currentSize.iconSize}
            color={
              isDisabled(totalPages)
                ? isDarkMode
                  ? theme.colors.gray[600]
                  : theme.colors.gray[400]
                : isDarkMode
                ? theme.colors.text.primary
                : theme.colors.gray[700]
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Simple pagination with page info
export function SimplePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  disabled = false,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  const { theme, isDarkMode } = useAppearance();

  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <View style={styles.simpleContainer}>
      <Text
        style={[
          styles.infoText,
          {
            color: isDarkMode
              ? theme.colors.text.secondary
              : theme.colors.gray[600],
          },
        ]}
      >
        {totalItems && startItem && endItem ? (
          <>
            Showing <Text style={styles.bold}>{startItem}</Text> to{' '}
            <Text style={styles.bold}>{endItem}</Text> of{' '}
            <Text style={styles.bold}>{totalItems}</Text> results
          </>
        ) : (
          <>
            Page <Text style={styles.bold}>{currentPage}</Text> of{' '}
            <Text style={styles.bold}>{totalPages}</Text>
          </>
        )}
      </Text>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={disabled}
        showFirstLast={false}
        maxVisiblePages={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '500',
  },
  simpleContainer: {
    gap: 12,
  },
  infoText: {
    fontSize: 13,
  },
  bold: {
    fontWeight: '600',
  },
});
