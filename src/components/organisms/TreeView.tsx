import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Folder, FolderOpen, File, type LucideIcon } from 'lucide-react';

export interface TreeNode {
  id: string;
  label: string;
  icon?: LucideIcon;
  children?: TreeNode[];
  metadata?: any;
}

export interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  selectedId?: string;
  expandedIds?: string[];
  onExpand?: (ids: string[]) => void;
  showIcons?: boolean;
  indentSize?: number;
  className?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onSelect,
  selectedId,
  expandedIds: controlledExpandedIds,
  onExpand,
  showIcons = true,
  indentSize = 20,
  className = '',
}) => {
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>([]);

  const expandedIds = controlledExpandedIds !== undefined
    ? controlledExpandedIds
    : internalExpandedIds;

  const handleExpand = (nodeId: string) => {
    const newExpandedIds = expandedIds.includes(nodeId)
      ? expandedIds.filter((id) => id !== nodeId)
      : [...expandedIds, nodeId];

    if (onExpand) {
      onExpand(newExpandedIds);
    } else {
      setInternalExpandedIds(newExpandedIds);
    }
  };

  return (
    <div className={`select-none ${className}`}>
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onExpand={handleExpand}
          showIcons={showIcons}
          indentSize={indentSize}
        />
      ))}
    </div>
  );
};

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedId?: string;
  expandedIds: string[];
  onSelect?: (node: TreeNode) => void;
  onExpand: (nodeId: string) => void;
  showIcons: boolean;
  indentSize: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  selectedId,
  expandedIds,
  onSelect,
  onExpand,
  showIcons,
  indentSize,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;

  const getDefaultIcon = () => {
    if (hasChildren) {
      return isExpanded ? FolderOpen : Folder;
    }
    return File;
  };

  const Icon = node.icon || getDefaultIcon();

  return (
    <div>
      {/* Node Item */}
      <motion.button
        onClick={() => {
          if (hasChildren) {
            onExpand(node.id);
          }
          if (onSelect) {
            onSelect(node);
          }
        }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
        className={`
          w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-lg transition-colors
          ${isSelected
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        style={{ paddingLeft: `${level * indentSize + 8}px` }}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        ) : (
          <div className="w-4" />
        )}

        {/* Node Icon */}
        {showIcons && (
          <Icon className="w-4 h-4 flex-shrink-0" />
        )}

        {/* Label */}
        <span className="flex-1 truncate text-sm">{node.label}</span>

        {/* Metadata Badge */}
        {node.metadata?.badge && (
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {node.metadata.badge}
          </span>
        )}
      </motion.button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={onSelect}
                onExpand={onExpand}
                showIcons={showIcons}
                indentSize={indentSize}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
