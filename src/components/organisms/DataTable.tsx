import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedRows?: Set<T[keyof T]>;
  onSelectionChange?: (selected: Set<T[keyof T]>) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search
  const filteredData = searchable
    ? data.filter((item) =>
        columns.some((col) => {
          const value = item[col.key as keyof T];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      )
    : data;

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn as keyof T];
        const bVal = b[sortColumn as keyof T];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      onSelectionChange?.(new Set());
    } else {
      const allKeys = new Set(sortedData.map((item) => item[keyField]));
      onSelectionChange?.(allKeys);
    }
  };

  const handleSelectRow = (key: T[keyof T]) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    onSelectionChange?.(newSelected);
  };

  const isAllSelected = sortedData.length > 0 && selectedRows.size === sortedData.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  return (
    <div className={className}>
      {/* Search Bar */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-foreground"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card dark:bg-card border border-border dark:border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 dark:bg-muted/50 border-b border-border dark:border-border">
              <tr>
                {selectable && (
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isSomeSelected;
                        }
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-border dark:border-border text-indigo-600 focus:ring-2 focus:ring-indigo-600"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-3 text-sm font-medium text-muted-foreground ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(String(column.key))}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        <span>{column.header}</span>
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 opacity-30" />
                        )}
                      </button>
                    ) : (
                      <span>{column.header}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border">
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => {
                  const rowKey = item[keyField];
                  const isSelected = selectedRows.has(rowKey);

                  return (
                    <tr
                      key={String(rowKey)}
                      onClick={() => onRowClick?.(item)}
                      className={`
                        transition-colors
                        ${onRowClick ? 'cursor-pointer hover:bg-muted/30 dark:hover:bg-muted/30' : ''}
                        ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''}
                      `}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(rowKey);
                            }}
                            className="w-4 h-4 rounded border-border dark:border-border text-indigo-600 focus:ring-2 focus:ring-indigo-600"
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-4 py-3 text-sm text-foreground ${
                            column.align === 'center'
                              ? 'text-center'
                              : column.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {column.render
                            ? column.render(item, index)
                            : String(item[column.key as keyof T] || '')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      {sortedData.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {sortedData.length} {sortedData.length === 1 ? 'row' : 'rows'}
            {searchQuery && ` (filtered from ${data.length} total)`}
          </span>
          {selectable && selectedRows.size > 0 && (
            <span>
              {selectedRows.size} {selectedRows.size === 1 ? 'row' : 'rows'} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Simple Table variant (no sorting, searching)
export interface SimpleTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  className?: string;
}

export function SimpleTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  className = '',
}: SimpleTableProps<T>) {
  return <DataTable data={data} columns={columns} keyField={keyField} className={className} />;
}
