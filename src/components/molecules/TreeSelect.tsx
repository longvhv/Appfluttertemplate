import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check, Folder, File } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeSelectProps {
  data: TreeNode[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function TreeSelect({
  data,
  value = [],
  onChange,
  placeholder = 'Select...',
  multiple = false,
  searchable = false,
  disabled = false,
  className = '',
  label,
}: TreeSelectProps) {
  const [selected, setSelected] = useState<string[]>(value);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpanded(newExpanded);
  };

  const handleSelect = (nodeId: string) => {
    let newSelected: string[];
    
    if (multiple) {
      if (selected.includes(nodeId)) {
        newSelected = selected.filter((id) => id !== nodeId);
      } else {
        newSelected = [...selected, nodeId];
      }
    } else {
      newSelected = [nodeId];
      setIsOpen(false);
    }

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const getNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = getNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getSelectedLabels = () => {
    return selected
      .map((id) => getNodeById(data, id))
      .filter(Boolean)
      .map((node) => node!.label);
  };

  const filterNodes = (nodes: TreeNode[], query: string): TreeNode[] => {
    if (!query) return nodes;

    return nodes.reduce((acc: TreeNode[], node) => {
      const matchesQuery = node.label.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = node.children ? filterNodes(node.children, query) : [];

      if (matchesQuery || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }

      return acc;
    }, []);
  };

  const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
    const isExpanded = expanded.has(node.id);
    const isSelected = selected.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!node.disabled) {
              handleSelect(node.id);
            }
          }}
          disabled={node.disabled}
          className={`
            w-full flex items-center gap-2 px-3 py-2 text-left transition-colors
            ${isSelected
              ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
              : 'hover:bg-muted/50 dark:hover:bg-muted/50 text-foreground'
            }
            ${node.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="p-0.5 hover:bg-muted dark:hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Node Icon */}
          {hasChildren ? (
            <Folder className={`w-4 h-4 ${isExpanded ? 'text-indigo-600' : 'text-muted-foreground'}`} />
          ) : (
            <File className="w-4 h-4 text-muted-foreground" />
          )}

          {/* Label */}
          <span className="flex-1 text-sm">{node.label}</span>

          {/* Check Icon */}
          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {node.children!.map((child) => (
                <TreeNodeComponent key={child.id} node={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const displayText = selected.length > 0
    ? getSelectedLabels().join(', ')
    : placeholder;

  const filteredData = searchQuery ? filterNodes(data, searchQuery) : data;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl
          border-2 transition-all bg-card dark:bg-card
          ${isOpen
            ? 'border-indigo-600 ring-4 ring-indigo-600/20'
            : 'border-border dark:border-border hover:border-indigo-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`truncate ${selected.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search */}
            {searchable && (
              <div className="p-2 border-b border-border dark:border-border">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            )}

            {/* Tree */}
            <div className="max-h-64 overflow-y-auto">
              {filteredData.length > 0 ? (
                filteredData.map((node) => (
                  <TreeNodeComponent key={node.id} node={node} />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
