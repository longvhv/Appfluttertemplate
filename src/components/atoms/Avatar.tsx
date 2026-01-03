import React from 'react';
import { User } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  fallback?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; icon: number; text: string }> = {
  xs: { container: 'w-6 h-6', icon: 12, text: 'text-xs' },
  sm: { container: 'w-8 h-8', icon: 16, text: 'text-sm' },
  md: { container: 'w-10 h-10', icon: 20, text: 'text-base' },
  lg: { container: 'w-12 h-12', icon: 24, text: 'text-lg' },
  xl: { container: 'w-16 h-16', icon: 32, text: 'text-xl' },
  '2xl': { container: 'w-24 h-24', icon: 48, text: 'text-3xl' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  fallback,
  badge,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const { container, icon, text } = sizeStyles[size];

  const showImage = src && !imageError;
  const showInitials = !showImage && name;
  const showFallback = !showImage && !showInitials;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${container}
          rounded-full overflow-hidden
          bg-gradient-to-br from-indigo-500 to-purple-500
          flex items-center justify-center
        `}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        
        {showInitials && (
          <span className={`${text} font-semibold text-white`}>
            {getInitials(name)}
          </span>
        )}
        
        {showFallback && (
          fallback || <User size={icon} className="text-white" />
        )}
      </div>
      
      {badge && (
        <div className="absolute -bottom-1 -right-1">
          {badge}
        </div>
      )}
    </div>
  );
}
