import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    className?: string;
  };
  emptyText?: string;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  className?: string;
}

export function Table<T = any>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  onRow,
  emptyText = 'No data available',
  size = 'md',
  striped = false,
  hoverable = true,
  bordered = true,
  stickyHeader = false,
  className = '',
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const paddings = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record as any)[rowKey] || index.toString();
  };

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((prev) => ({
      key: columnKey,
      direction:
        prev.key === columnKey
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
            ? null
            : 'asc'
          : 'asc',
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.direction) return data;

    const column = columns.find((col) => col.key === sortConfig.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = column.dataIndex ? (a as any)[column.dataIndex] : a;
      const bValue = column.dataIndex ? (b as any)[column.dataIndex] : b;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, columns]);

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        {/* Header */}
        <thead
          className={`
            bg-gray-50 dark:bg-gray-800
            ${stickyHeader ? 'sticky top-0 z-10' : ''}
          `}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                className={`
                  ${paddings[size]}
                  ${alignmentClasses[column.align || 'left']}
                  font-semibold text-gray-900 dark:text-white
                  ${bordered ? 'border-b-2 border-gray-200 dark:border-gray-700' : ''}
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                  whitespace-nowrap
                `}
                style={{ width: column.width }}
              >
                <div className="flex items-center gap-2 justify-between">
                  <span>{column.title}</span>
                  {column.sortable && (
                    <span className="text-gray-400">
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : sortConfig.direction === 'desc' ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{emptyText}</p>
              </td>
            </tr>
          ) : (
            sortedData.map((record, index) => {
              const rowProps = onRow?.(record, index) || {};
              return (
                <tr
                  key={getRowKey(record, index)}
                  onClick={rowProps.onClick}
                  className={`
                    ${sizes[size]}
                    ${striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                    ${hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                    ${rowProps.onClick ? 'cursor-pointer' : ''}
                    ${bordered ? 'border-b border-gray-200 dark:border-gray-700' : ''}
                    transition-colors
                    ${rowProps.className || ''}
                  `}
                >
                  {columns.map((column) => {
                    const value = column.dataIndex
                      ? (record as any)[column.dataIndex]
                      : record;
                    const content = column.render
                      ? column.render(value, record, index)
                      : value;

                    return (
                      <td
                        key={column.key}
                        className={`
                          ${paddings[size]}
                          ${alignmentClasses[column.align || 'left']}
                          text-gray-900 dark:text-white
                        `}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
