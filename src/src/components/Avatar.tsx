import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  fallback?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  fallback,
  status,
  className = '',
  onClick,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      );
    }

    if (fallback) {
      return <div className="w-full h-full flex items-center justify-center">{fallback}</div>;
    }

    if (name) {
      return (
        <div className="w-full h-full flex items-center justify-center font-semibold bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          {getInitials(name)}
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
        <User className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
      </div>
    );
  };

  return (
    <div
      className={`
        relative inline-flex shrink-0
        ${sizes[size]}
        ${shapes[shape]}
        overflow-hidden
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {renderContent()}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            ${shape === 'circle' ? 'rounded-full' : 'rounded-sm'}
            ring-2 ring-white dark:ring-gray-900
          `}
        />
      )}
    </div>
  );
}

// Avatar Group Component
export interface AvatarGroupProps {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({
  children,
  max = 5,
  size = 'md',
  className = '',
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children) as React.ReactElement<AvatarProps>[];
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, index) =>
        React.cloneElement(avatar, {
          key: index,
          size: avatar.props.size || size,
          className: `ring-2 ring-white dark:ring-gray-900 ${avatar.props.className || ''}`,
        })
      )}
      {remaining > 0 && (
        <div
          className={`
            ${sizes[size]}
            rounded-full
            bg-gray-200 dark:bg-gray-700
            ring-2 ring-white dark:ring-gray-900
            flex items-center justify-center
            font-semibold text-gray-600 dark:text-gray-300
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
