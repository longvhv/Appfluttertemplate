import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, GripHorizontal } from 'lucide-react';

export interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: 'horizontal' | 'vertical';
  initialSize?: number; // percentage (0-100)
  minSize?: number; // percentage
  maxSize?: number; // percentage
  onResize?: (size: number) => void;
  className?: string;
}

export function SplitPane({
  children,
  direction = 'horizontal',
  initialSize = 50,
  minSize = 10,
  maxSize = 90,
  onResize,
  className = '',
}: SplitPaneProps) {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        const x = e.clientX - container.left;
        newSize = (x / container.width) * 100;
      } else {
        const y = e.clientY - container.top;
        newSize = (y / container.height) * 100;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
      onResize?.(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, direction, minSize, maxSize, onResize]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} w-full h-full ${className}`}
    >
      {/* First Pane */}
      <div
        style={{
          [direction === 'horizontal' ? 'width' : 'height']: `${size}%`,
        }}
        className="overflow-auto"
      >
        {children[0]}
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          flex items-center justify-center flex-shrink-0
          bg-border dark:bg-border hover:bg-indigo-600 dark:hover:bg-indigo-600
          transition-colors group
          ${direction === 'horizontal'
            ? 'w-1 cursor-col-resize hover:w-1.5'
            : 'h-1 cursor-row-resize hover:h-1.5'
          }
          ${isDragging ? 'bg-indigo-600' : ''}
        `}
      >
        <div className={`
          ${direction === 'horizontal' ? 'rotate-0' : 'rotate-90'}
          opacity-0 group-hover:opacity-100 transition-opacity
          text-white
        `}>
          {direction === 'horizontal' ? (
            <GripVertical className="w-4 h-4" />
          ) : (
            <GripHorizontal className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Second Pane */}
      <div
        style={{
          [direction === 'horizontal' ? 'width' : 'height']: `${100 - size}%`,
        }}
        className="overflow-auto"
      >
        {children[1]}
      </div>
    </div>
  );
}

// Three-pane layout
export interface ThreePaneProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  leftSize?: number;
  rightSize?: number;
}

export function ThreePane({
  left,
  center,
  right,
  leftSize = 20,
  rightSize = 20,
}: ThreePaneProps) {
  const [leftWidth, setLeftWidth] = useState(leftSize);
  const [rightWidth, setRightWidth] = useState(rightSize);

  return (
    <SplitPane
      direction="horizontal"
      initialSize={leftWidth}
      onResize={setLeftWidth}
    >
      {left}
      <SplitPane
        direction="horizontal"
        initialSize={(100 - leftWidth - rightWidth) / (100 - leftWidth) * 100}
        onResize={(size) => {
          setRightWidth((100 - leftWidth) * (100 - size) / 100);
        }}
      >
        {center}
        {right}
      </SplitPane>
    </SplitPane>
  );
}
