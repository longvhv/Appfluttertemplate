import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  height: number;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  height,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Grid Virtual List
export interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  columns: number;
  height: number;
  gap?: number;
  overscan?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  itemHeight,
  columns,
  height,
  gap = 16,
  overscan = 2,
  className = '',
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + height) / rowHeight) + overscan
  );

  const visibleRows: T[][] = [];
  for (let row = startRow; row < endRow; row++) {
    const rowItems: T[] = [];
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      if (index < items.length) {
        rowItems.push(items[index]);
      }
    }
    visibleRows.push(rowItems);
  }

  const offsetY = startRow * rowHeight;

  return (
    <div
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleRows.map((rowItems, rowIndex) => {
            const actualRow = startRow + rowIndex;
            return (
              <div
                key={actualRow}
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gap}px`,
                  marginBottom: `${gap}px`,
                }}
              >
                {rowItems.map((item, colIndex) => {
                  const index = actualRow * columns + colIndex;
                  return (
                    <div key={index} style={{ height: itemHeight }}>
                      {renderItem(item, index)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Dynamic height virtual list (more complex)
export interface DynamicVirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimatedItemHeight: number;
  height: number;
  overscan?: number;
  className?: string;
}

export function DynamicVirtualList<T>({
  items,
  renderItem,
  estimatedItemHeight,
  height,
  overscan = 3,
  className = '',
}: DynamicVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Measure actual heights
    const newHeights = new Map(itemHeights);
    let changed = false;

    itemRefs.current.forEach((element, index) => {
      const height = element.offsetHeight;
      if (itemHeights.get(index) !== height) {
        newHeights.set(index, height);
        changed = true;
      }
    });

    if (changed) {
      setItemHeights(newHeights);
    }
  });

  const getItemHeight = (index: number) => {
    return itemHeights.get(index) || estimatedItemHeight;
  };

  const getItemOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  };

  const getTotalHeight = () => {
    return items.reduce((total, _, index) => total + getItemHeight(index), 0);
  };

  const findStartIndex = () => {
    let offset = 0;
    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i);
      if (offset + height > scrollTop) {
        return Math.max(0, i - overscan);
      }
      offset += height;
    }
    return 0;
  };

  const findEndIndex = (startIndex: number) => {
    let offset = getItemOffset(startIndex);
    for (let i = startIndex; i < items.length; i++) {
      const height = getItemHeight(i);
      if (offset > scrollTop + height + overscan * estimatedItemHeight) {
        return i;
      }
      offset += height;
    }
    return items.length;
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = findStartIndex();
  const endIndex = findEndIndex(startIndex);
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = getItemOffset(startIndex);
  const totalHeight = getTotalHeight();

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => {
            const index = startIndex + i;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(index, el);
                  } else {
                    itemRefs.current.delete(index);
                  }
                }}
              >
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
