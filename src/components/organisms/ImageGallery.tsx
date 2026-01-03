import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react';

export interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  caption?: string;
  thumbnail?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4 | 5;
  gap?: 2 | 4 | 6 | 8;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  onImageClick?: (image: GalleryImage, index: number) => void;
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 4,
  aspectRatio = 'square',
  onImageClick,
  className = '',
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} ${gapClasses[gap]} ${className}`}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-muted dark:bg-muted"
            onClick={() => handleImageClick(image, index)}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt}
              className={`
                w-full h-full object-cover transition-transform
                group-hover:scale-110
                ${aspectRatioClasses[aspectRatio]}
              `}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={images}
        isOpen={lightboxOpen}
        selectedIndex={selectedIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setSelectedIndex}
      />
    </>
  );
}

// Lightbox Component
interface LightboxProps {
  images: GalleryImage[];
  isOpen: boolean;
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ images, isOpen, selectedIndex, onClose, onNavigate }: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const selectedImage = images[selectedIndex];

  const handlePrevious = () => {
    onNavigate(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
    setZoom(1);
  };

  const handleNext = () => {
    onNavigate(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
    setZoom(1);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedImage.src;
    link.download = `image-${selectedImage.id}`;
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(Math.max(0.5, zoom - 0.25));
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(Math.min(3, zoom + 0.25));
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: zoom }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>

          {/* Caption */}
          {selectedImage.caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="text-white text-center">{selectedImage.caption}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Masonry Gallery variant
export function MasonryGallery({
  images,
  columns = 3,
  gap = 4,
}: Omit<ImageGalleryProps, 'aspectRatio'>) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap * 4}px`,
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative cursor-pointer overflow-hidden rounded-xl"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt}
              className="w-full h-auto transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={images}
        isOpen={lightboxOpen}
        selectedIndex={selectedIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setSelectedIndex}
      />
    </>
  );
}
