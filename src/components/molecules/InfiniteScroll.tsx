import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Spinner } from '../atoms/Spinner';
import { motion } from 'motion/react';

export interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number; // pixels from bottom to trigger load
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  scrollableTarget?: string; // ID of scrollable element
  className?: string;
  itemClassName?: string;
  gap?: number;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading = false,
  threshold = 300,
  loader,
  endMessage,
  scrollableTarget,
  className = '',
  itemClassName = '',
  gap = 16,
}: InfiniteScrollProps<T>) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      await loadMore();
    } finally {
      setIsLoading(false);
    }
  }, [loadMore, hasMore, isLoading]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: scrollableTarget ? document.getElementById(scrollableTarget) : null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        handleLoadMore();
      }
    }, options);

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, handleLoadMore, threshold, scrollableTarget]);

  return (
    <div className={className}>
      <div style={{ gap: `${gap}px` }} className="flex flex-col">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>

      {/* Loading Trigger */}
      <div ref={loadMoreRef} className="py-4">
        {(loading || isLoading) && hasMore && (
          <div className="flex justify-center">
            {loader || (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Spinner size="sm" />
                <span className="text-sm">Loading more...</span>
              </div>
            )}
          </div>
        )}

        {/* End Message */}
        {!hasMore && items.length > 0 && (
          <div className="flex justify-center">
            {endMessage || (
              <p className="text-sm text-muted-foreground py-4">
                No more items to load
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Grid variant for infinite scroll
export interface InfiniteGridProps<T> extends Omit<InfiniteScrollProps<T>, 'itemClassName'> {
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: number;
}

export function InfiniteGrid<T>({
  columns = 3,
  gap = 16,
  ...props
}: InfiniteGridProps<T>) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
  };

  return (
    <div className={props.className}>
      <div className={`grid ${gridCols[columns]}`} style={{ gap: `${gap}px` }}>
        {props.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            {props.renderItem(item, index)}
          </motion.div>
        ))}
      </div>

      {/* Loading/End Messages */}
      <div className="py-4">
        {(props.loading || props.hasMore) && (
          <div className="flex justify-center">
            {props.loader || (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Spinner size="sm" />
                <span className="text-sm">Loading more...</span>
              </div>
            )}
          </div>
        )}

        {!props.hasMore && props.items.length > 0 && (
          <div className="flex justify-center">
            {props.endMessage || (
              <p className="text-sm text-muted-foreground py-4">
                No more items to load
              </p>
            )}
          </div>
        )}
      </div>

      {/* Intersection observer target */}
      <div ref={(ref) => {
        if (ref && props.hasMore && !props.loading) {
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                props.loadMore();
              }
            },
            { threshold: 0, rootMargin: '300px' }
          );
          observer.observe(ref);
          return () => observer.disconnect();
        }
      }} />
    </div>
  );
}

// Virtual scroll hook
export function useInfiniteScroll(callback: () => void, deps: React.DependencyList = []) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, ...deps]);
}
