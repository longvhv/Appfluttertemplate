import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GripVertical } from 'lucide-react';

export interface SplitPanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  initialSize?: number; // Percentage (0-100)
  minSize?: number; // Percentage
  maxSize?: number; // Percentage
  collapsible?: boolean;
  showHandle?: boolean;
  onResize?: (size: number) => void;
  className?: string;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  leftPanel,
  rightPanel,
  orientation = 'vertical',
  initialSize = 50,
  minSize = 20,
  maxSize = 80,
  collapsible = false,
  showHandle = true,
  onResize,
  className = '',
}) => {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        let newSize: number;

        if (orientation === 'vertical') {
          newSize = ((e.clientX - rect.left) / rect.width) * 100;
        } else {
          newSize = ((e.clientY - rect.top) / rect.height) * 100;
        }

        newSize = Math.max(minSize, Math.min(maxSize, newSize));
        setSize(newSize);

        if (onResize) {
          onResize(newSize);
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, orientation, minSize, maxSize, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDoubleClick = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const containerStyle = orientation === 'vertical'
    ? { flexDirection: 'row' as const }
    : { flexDirection: 'column' as const };

  const panelSize = isCollapsed ? 0 : size;
  const panel2Size = 100 - panelSize;

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full ${className}`}
      style={containerStyle}
    >
      {/* Left/Top Panel */}
      <motion.div
        animate={{
          [orientation === 'vertical' ? 'width' : 'height']: `${panelSize}%`,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-auto"
      >
        {leftPanel}
      </motion.div>

      {/* Resizer Handle */}
      {showHandle && (
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          className={`
            flex items-center justify-center flex-shrink-0 group
            ${orientation === 'vertical'
              ? 'w-1 cursor-col-resize hover:w-2'
              : 'h-1 cursor-row-resize hover:h-2'
            }
            ${isDragging
              ? 'bg-blue-500'
              : 'bg-gray-200 dark:bg-gray-800 hover:bg-blue-400'
            }
            transition-all
          `}
        >
          {orientation === 'vertical' ? (
            <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
          )}
        </div>
      )}

      {/* Right/Bottom Panel */}
      <motion.div
        animate={{
          [orientation === 'vertical' ? 'width' : 'height']: `${panel2Size}%`,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-auto flex-1"
      >
        {rightPanel}
      </motion.div>

      {/* Overlay when dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
};

// Preset layouts
export const SidebarLayout: React.FC<Omit<SplitPanelProps, 'orientation' | 'initialSize'>> = (props) => (
  <SplitPanel
    {...props}
    orientation="vertical"
    initialSize={20}
    minSize={15}
    maxSize={40}
  />
);

export const EditorLayout: React.FC<Omit<SplitPanelProps, 'orientation' | 'initialSize'>> = (props) => (
  <SplitPanel
    {...props}
    orientation="vertical"
    initialSize={60}
    minSize={30}
    maxSize={80}
  />
);

export const PreviewLayout: React.FC<Omit<SplitPanelProps, 'orientation' | 'initialSize'>> = (props) => (
  <SplitPanel
    {...props}
    orientation="horizontal"
    initialSize={50}
    minSize={20}
    maxSize={80}
  />
);
