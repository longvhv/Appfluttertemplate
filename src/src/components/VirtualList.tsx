import React, { useRef, CSSProperties } from 'react';
import { useVirtualScroll } from '../hooks/usePerformance';

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  width?: string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  overscan?: number;
  className?: string;
  itemClassName?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  estimatedItemHeight?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  width = '100%',
  renderItem,
  keyExtractor,
  overscan = 3,
  className = '',
  itemClassName = '',
  onEndReached,
  onEndReachedThreshold = 0.8,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    onScroll,
  } = useVirtualScroll(items, itemHeight, height, overscan);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    onScroll(e);

    // Check if user scrolled to bottom
    if (onEndReached) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Only trigger when scrolling down
      if (scrollTop > lastScrollTop.current && scrollPercentage >= onEndReachedThreshold) {
        onEndReached();
      }

      lastScrollTop.current = scrollTop;
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{
        height,
        width,
      }}
    >
      {/* Spacer for total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, idx) => {
            const actualIndex = startIndex + idx;
            return (
              <div
                key={keyExtractor(item, actualIndex)}
                className={itemClassName}
                style={{
                  height: itemHeight,
                }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Grid version for virtual scrolling in 2D
export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  columns: number;
  height: number;
  width?: string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  gap?: number;
  overscan?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  columns,
  height,
  width = '100%',
  renderItem,
  keyExtractor,
  gap = 0,
  overscan = 1,
  className = '',
}: VirtualGridProps<T>) {
  const rowHeight = itemHeight + gap;
  const rows = Math.ceil(items.length / columns);

  const {
    visibleItems: visibleRows,
    totalHeight,
    offsetY,
    startIndex: startRow,
    onScroll,
  } = useVirtualScroll(
    Array.from({ length: rows }, (_, i) => i),
    rowHeight,
    height,
    overscan
  );

  return (
    <div
      onScroll={onScroll}
      className={`overflow-auto ${className}`}
      style={{
        height,
        width,
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleRows.map((rowIndex) => {
            const startIdx = rowIndex * columns;
            const endIdx = Math.min(startIdx + columns, items.length);
            const rowItems = items.slice(startIdx, endIdx);

            return (
              <div
                key={rowIndex}
                style={{
                  display: 'flex',
                  gap,
                  height: itemHeight,
                  marginBottom: gap,
                }}
              >
                {rowItems.map((item, colIdx) => {
                  const actualIndex = startIdx + colIdx;
                  return (
                    <div
                      key={keyExtractor(item, actualIndex)}
                      style={{
                        width: itemWidth,
                        height: itemHeight,
                      }}
                    >
                      {renderItem(item, actualIndex)}
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

// Infinite scroll list
export interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  keyExtractor,
  loadMore,
  hasMore,
  loading = false,
  loader = <div className="text-center py-4">Loading...</div>,
  endMessage = <div className="text-center py-4 text-gray-500">No more items</div>,
  threshold = 0.8,
  className = '',
}: InfiniteScrollListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || loading || isLoadingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= threshold) {
      isLoadingRef.current = true;
      try {
        await loadMore();
      } finally {
        isLoadingRef.current = false;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
    >
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {loading && loader}
      {!loading && !hasMore && endMessage}
    </div>
  );
}
