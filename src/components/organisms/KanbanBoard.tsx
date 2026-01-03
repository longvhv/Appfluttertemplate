import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import { DropdownMenu } from '../molecules/DropdownMenu';

export interface KanbanCard {
  id: string | number;
  title: string;
  description?: string;
  labels?: Array<{ id: string | number; text: string; color: string }>;
  assignees?: Array<{ id: string | number; name: string; avatar?: string }>;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  metadata?: any;
}

export interface KanbanColumn {
  id: string | number;
  title: string;
  cards: KanbanCard[];
  color?: string;
  limit?: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string | number, fromColumn: string | number, toColumn: string | number, newIndex: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onCardAdd?: (columnId: string | number) => void;
  onCardDelete?: (cardId: string | number, columnId: string | number) => void;
  onColumnAdd?: () => void;
  onColumnDelete?: (columnId: string | number) => void;
  className?: string;
}

export function KanbanBoard({
  columns: initialColumns,
  onCardMove,
  onCardClick,
  onCardAdd,
  onCardDelete,
  onColumnAdd,
  onColumnDelete,
  className = '',
}: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedCard, setDraggedCard] = useState<string | number | null>(null);

  const handleCardReorder = (columnId: string | number, newCards: KanbanCard[]) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: newCards } : col
      )
    );
  };

  const handleCardDragEnd = (
    card: KanbanCard,
    fromColumnId: string | number,
    toColumnId: string | number
  ) => {
    if (fromColumnId !== toColumnId) {
      setColumns((prev) => {
        const newColumns = prev.map((col) => {
          if (col.id === fromColumnId) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== card.id),
            };
          }
          if (col.id === toColumnId) {
            return {
              ...col,
              cards: [...col.cards, card],
            };
          }
          return col;
        });
        
        const toColumn = newColumns.find((c) => c.id === toColumnId);
        if (toColumn && onCardMove) {
          onCardMove(card.id, fromColumnId, toColumnId, toColumn.cards.length - 1);
        }
        
        return newColumns;
      });
    }
    setDraggedCard(null);
  };

  const priorityColors = {
    low: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
    high: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  };

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-muted/30 dark:bg-muted/30 rounded-xl p-4"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {column.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
              )}
              <h3 className="font-semibold text-foreground">
                {column.title}
              </h3>
              <span className="text-xs text-muted-foreground bg-muted dark:bg-muted px-2 py-0.5 rounded-full">
                {column.cards.length}
                {column.limit && `/${column.limit}`}
              </span>
            </div>

            <DropdownMenu
              items={[
                {
                  id: 'add',
                  label: 'Add Card',
                  icon: Plus,
                  onClick: () => onCardAdd?.(column.id),
                },
                {
                  id: 'delete',
                  label: 'Delete Column',
                  icon: Trash2,
                  onClick: () => onColumnDelete?.(column.id),
                  variant: 'danger',
                },
              ]}
              trigger={
                <button className="p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              }
            />
          </div>

          {/* Cards */}
          <Reorder.Group
            axis="y"
            values={column.cards}
            onReorder={(newCards) => handleCardReorder(column.id, newCards)}
            className="space-y-3 min-h-[200px]"
          >
            {column.cards.map((card) => (
              <Reorder.Item
                key={card.id}
                value={card}
                dragListener={true}
                onDragStart={() => setDraggedCard(card.id)}
                onDragEnd={() => handleCardDragEnd(card, column.id, column.id)}
              >
                <motion.div
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                  onClick={() => onCardClick?.(card)}
                  className={`
                    bg-card dark:bg-card border border-border dark:border-border
                    rounded-xl p-4 cursor-pointer
                    hover:shadow-md transition-shadow
                    ${draggedCard === card.id ? 'opacity-50' : ''}
                  `}
                >
                  {/* Card Priority */}
                  {card.priority && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium mb-2 ${priorityColors[card.priority]}`}>
                      {card.priority}
                    </div>
                  )}

                  {/* Card Title */}
                  <h4 className="font-medium text-foreground mb-1">
                    {card.title}
                  </h4>

                  {/* Card Description */}
                  {card.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  {/* Card Labels */}
                  {card.labels && card.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.labels.map((label) => (
                        <span
                          key={label.id}
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: label.color + '20',
                            color: label.color,
                          }}
                        >
                          {label.text}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    {/* Assignees */}
                    {card.assignees && card.assignees.length > 0 && (
                      <div className="flex -space-x-2">
                        {card.assignees.slice(0, 3).map((assignee) => (
                          <div
                            key={assignee.id}
                            className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-card dark:border-card flex items-center justify-center text-white text-xs font-medium"
                            title={assignee.name}
                          >
                            {assignee.avatar ? (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-full h-full rounded-full"
                              />
                            ) : (
                              assignee.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        ))}
                        {card.assignees.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-muted dark:bg-muted border-2 border-card dark:border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{card.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Due Date */}
                    {card.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        {card.dueDate}
                      </span>
                    )}
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Add Card Button */}
          {onCardAdd && (
            <button
              onClick={() => onCardAdd(column.id)}
              className="w-full mt-3 p-2 border-2 border-dashed border-border dark:border-border rounded-xl hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium"
            >
              + Add Card
            </button>
          )}
        </div>
      ))}

      {/* Add Column Button */}
      {onColumnAdd && (
        <div className="flex-shrink-0 w-80">
          <button
            onClick={onColumnAdd}
            className="w-full h-full min-h-[200px] border-2 border-dashed border-border dark:border-border rounded-xl hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Column
          </button>
        </div>
      )}
    </div>
  );
}
