import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, Folder, FolderOpen, File, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface TreeNode {
  id: string;
  label: string;
  icon?: Icon;
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
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedId?: string;
  expandedIds: string[];
  onSelect?: (node: TreeNode) => void;
  onExpand: (nodeId: string) => void;
  showIcons: boolean;
  indentSize: number;
  theme: any;
}

// Memoized tree node component
const MemoizedTreeNode = React.memo<TreeNodeProps>(({
  node,
  level,
  selectedId,
  expandedIds,
  onSelect,
  onExpand,
  showIcons,
  indentSize,
  theme,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;

  const getDefaultIcon = useCallback(() => {
    if (hasChildren) {
      return isExpanded ? FolderOpen : Folder;
    }
    return File;
  }, [hasChildren, isExpanded]);

  const Icon = node.icon || getDefaultIcon();

  const styles = useMemo(() => StyleSheet.create({
    nodeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      paddingLeft: level * indentSize + 12,
      backgroundColor: isSelected
        ? theme.colors.primary + '15'
        : 'transparent',
      borderRadius: 8,
      gap: 8,
    },
    chevronContainer: {
      width: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nodeLabel: {
      flex: 1,
      fontSize: 14,
      color: isSelected ? theme.colors.primary : theme.colors.text,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor: theme.colors.border,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    childrenContainer: {
      overflow: 'hidden',
    },
  }), [level, indentSize, isSelected, theme]);

  const handlePress = useCallback(() => {
    if (hasChildren) {
      onExpand(node.id);
    }
    if (onSelect) {
      onSelect(node);
    }
  }, [hasChildren, onExpand, onSelect, node]);

  const chevronRotation = useMemo(
    () => ({ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }),
    [isExpanded]
  );

  const iconColor = useMemo(
    () => isSelected ? theme.colors.primary : theme.colors.textSecondary,
    [isSelected, theme]
  );

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.nodeButton}
        activeOpacity={0.7}
      >
        <View style={styles.chevronContainer}>
          {hasChildren && (
            <ChevronRight
              size={16}
              color={theme.colors.textSecondary}
              style={chevronRotation}
            />
          )}
        </View>

        {showIcons && <Icon size={18} color={iconColor} />}

        <Text style={styles.nodeLabel} numberOfLines={1}>
          {node.label}
        </Text>

        {node.metadata?.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{node.metadata.badge}</Text>
          </View>
        )}
      </TouchableOpacity>

      {hasChildren && isExpanded && (
        <View style={styles.childrenContainer}>
          {node.children!.map((child) => (
            <MemoizedTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onExpand={onExpand}
              showIcons={showIcons}
              indentSize={indentSize}
              theme={theme}
            />
          ))}
        </View>
      )}
    </View>
  );
});

MemoizedTreeNode.displayName = 'TreeNode';

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onSelect,
  selectedId,
  expandedIds: controlledExpandedIds,
  onExpand,
  showIcons = true,
  indentSize = 20,
}) => {
  const { theme } = useAppearance();
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>([]);

  const expandedIds = controlledExpandedIds !== undefined
    ? controlledExpandedIds
    : internalExpandedIds;

  const handleExpand = useCallback((nodeId: string) => {
    const newExpandedIds = expandedIds.includes(nodeId)
      ? expandedIds.filter((id) => id !== nodeId)
      : [...expandedIds, nodeId];

    if (onExpand) {
      onExpand(newExpandedIds);
    } else {
      setInternalExpandedIds(newExpandedIds);
    }
  }, [expandedIds, onExpand]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
  }), [theme]);

  const renderNode = useCallback((node: TreeNode) => (
    <MemoizedTreeNode
      key={node.id}
      node={node}
      level={0}
      selectedId={selectedId}
      expandedIds={expandedIds}
      onSelect={onSelect}
      onExpand={handleExpand}
      showIcons={showIcons}
      indentSize={indentSize}
      theme={theme}
    />
  ), [selectedId, expandedIds, onSelect, handleExpand, showIcons, indentSize, theme]);

  return (
    <View style={styles.container}>
      {data.map(renderNode)}
    </View>
  );
};
