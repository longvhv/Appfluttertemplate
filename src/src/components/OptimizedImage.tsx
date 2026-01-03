import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/usePerformance';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  quality?: 'low' | 'medium' | 'high';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  lazy = true,
  placeholder,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E',
  quality = 'medium',
  onLoad,
  onError,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder || fallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { isIntersecting, hasIntersected } = useIntersectionObserver(imgRef, {
    rootMargin: '50px',
  });

  // Quality presets
  const qualitySettings = {
    low: { blur: 20, scale: 0.5 },
    medium: { blur: 10, scale: 0.7 },
    high: { blur: 5, scale: 1 },
  };

  useEffect(() => {
    if (!lazy || hasIntersected) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setHasError(false);
        onLoad?.();
      };
      
      img.onerror = () => {
        setImageSrc(fallback);
        setHasError(true);
        onError?.();
      };
      
      img.src = src;
    }
  }, [src, lazy, hasIntersected, fallback, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      className={`
        transition-all duration-300
        ${!isLoaded && !hasError ? 'blur-sm scale-105' : 'blur-0 scale-100'}
        ${hasError ? 'opacity-50' : 'opacity-100'}
        ${className}
      `}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        objectFit: 'cover',
      }}
      {...props}
    />
  );
}

// Progressive Image component with low-quality placeholder
export interface ProgressiveImageProps extends OptimizedImageProps {
  lowQualitySrc?: string;
}

export function ProgressiveImage({
  lowQualitySrc,
  ...props
}: ProgressiveImageProps) {
  return <OptimizedImage placeholder={lowQualitySrc} {...props} />;
}

// Background Image component (optimized)
export interface BackgroundImageProps {
  src: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  lazy?: boolean;
}

export function BackgroundImage({
  src,
  alt = '',
  children,
  className = '',
  overlay = false,
  overlayOpacity = 0.5,
  lazy = true,
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const { hasIntersected } = useIntersectionObserver(divRef);

  useEffect(() => {
    if (!lazy || hasIntersected) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [src, lazy, hasIntersected]);

  return (
    <div
      ref={divRef}
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      {/* Background Image */}
      <div
        className={`
          absolute inset-0 bg-cover bg-center bg-no-repeat
          transition-all duration-500
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
        `}
        style={{
          backgroundImage: isLoaded ? `url(${src})` : undefined,
        }}
      />
      
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
