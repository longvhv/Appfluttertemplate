import React from 'react';
import { Avatar } from '../atoms/Avatar';
import { Tooltip } from '../atoms/Tooltip';

export interface AvatarGroupProps {
  avatars: Array<{
    id: string | number;
    name: string;
    src?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'loose';
  showTooltip?: boolean;
  onClick?: (id: string | number) => void;
  className?: string;
}

const spacingStyles = {
  tight: '-space-x-2',
  normal: '-space-x-3',
  loose: '-space-x-1',
};

export function AvatarGroup({
  avatars,
  max = 5,
  size = 'md',
  spacing = 'normal',
  showTooltip = true,
  onClick,
  className = '',
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className={`flex items-center ${spacingStyles[spacing]} ${className}`}>
      {visibleAvatars.map((avatar, index) => {
        const AvatarComponent = (
          <div
            key={avatar.id}
            onClick={() => onClick?.(avatar.id)}
            className={`
              relative border-2 border-card dark:border-card rounded-full
              transition-transform hover:scale-110 hover:z-10
              ${onClick ? 'cursor-pointer' : ''}
            `}
            style={{ zIndex: visibleAvatars.length - index }}
          >
            <Avatar
              name={avatar.name}
              src={avatar.src}
              size={size}
              status={avatar.status}
            />
          </div>
        );

        if (showTooltip) {
          return (
            <Tooltip key={avatar.id} content={avatar.name}>
              {AvatarComponent}
            </Tooltip>
          );
        }

        return AvatarComponent;
      })}

      {remainingCount > 0 && (
        <div
          className={`
            relative flex items-center justify-center
            rounded-full bg-muted dark:bg-muted
            text-muted-foreground font-medium
            border-2 border-card dark:border-card
            ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
            ${size === 'sm' ? 'w-8 h-8 text-xs' : ''}
            ${size === 'md' ? 'w-10 h-10 text-sm' : ''}
            ${size === 'lg' ? 'w-12 h-12 text-base' : ''}
            ${size === 'xl' ? 'w-16 h-16 text-lg' : ''}
          `}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

// Stacked Avatar Group (vertical)
export interface StackedAvatarGroupProps {
  avatars: AvatarGroupProps['avatars'];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function StackedAvatarGroup({
  avatars,
  max = 3,
  size = 'md',
}: StackedAvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className="flex flex-col -space-y-2">
      {visibleAvatars.map((avatar, index) => (
        <div
          key={avatar.id}
          className="relative border-2 border-card dark:border-card rounded-full"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar
            name={avatar.name}
            src={avatar.src}
            size={size}
            status={avatar.status}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`
            relative flex items-center justify-center
            rounded-full bg-muted dark:bg-muted
            text-muted-foreground font-medium
            border-2 border-card dark:border-card
            ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
            ${size === 'sm' ? 'w-8 h-8 text-xs' : ''}
            ${size === 'md' ? 'w-10 h-10 text-sm' : ''}
            ${size === 'lg' ? 'w-12 h-12 text-base' : ''}
            ${size === 'xl' ? 'w-16 h-16 text-lg' : ''}
          `}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
