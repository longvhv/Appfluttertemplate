import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  onChange?: (index: number) => void;
  className?: string;
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 3000,
  showArrows = true,
  showDots = true,
  loop = true,
  onChange,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  const goToSlide = (index: number, dir: number = 0) => {
    setDirection(dir);
    setCurrentIndex(index);
    onChange?.(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? (loop ? items.length - 1 : 0) : currentIndex - 1;
    goToSlide(newIndex, -1);
  };

  const goToNext = () => {
    const newIndex = currentIndex === items.length - 1 ? (loop ? 0 : currentIndex) : currentIndex + 1;
    goToSlide(newIndex, 1);
  };

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, interval);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [autoPlay, interval, currentIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Slides */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {items[currentIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!loop && currentIndex === 0}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 z-10
              p-2 bg-white/80 dark:bg-gray-900/80 rounded-full
              hover:bg-white dark:hover:bg-gray-900 transition-colors
              shadow-lg
              ${!loop && currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <button
            onClick={goToNext}
            disabled={!loop && currentIndex === items.length - 1}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 z-10
              p-2 bg-white/80 dark:bg-gray-900/80 rounded-full
              hover:bg-white dark:hover:bg-gray-900 transition-colors
              shadow-lg
              ${!loop && currentIndex === items.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Image Carousel variant
export interface ImageCarouselProps {
  images: Array<{
    id: string | number;
    src: string;
    alt: string;
    caption?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export function ImageCarousel({
  images,
  autoPlay = true,
  interval = 5000,
  aspectRatio = 'video',
}: ImageCarouselProps) {
  const aspectRatioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  const items = images.map((image) => ({
    id: image.id,
    content: (
      <div className="relative w-full h-full">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-lg font-medium">{image.caption}</p>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className={`w-full rounded-2xl overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
      <Carousel
        items={items}
        autoPlay={autoPlay}
        interval={interval}
        showArrows
        showDots
        loop
      />
    </div>
  );
}

// Card Carousel variant
export interface CardCarouselProps {
  cards: Array<{
    id: string | number;
    content: React.ReactNode;
  }>;
  visibleCards?: 1 | 2 | 3;
  gap?: number;
}

export function CardCarousel({
  cards,
  visibleCards = 3,
  gap = 16,
}: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < cards.length - visibleCards;

  const goToPrevious = () => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const cardWidth = `calc((100% - ${gap * (visibleCards - 1)}px) / ${visibleCards})`;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: `${gap}px` }}
          animate={{ x: `-${currentIndex * (100 / visibleCards + gap)}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
            >
              {card.content}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={goToPrevious}
          disabled={!canGoPrev}
          className={`
            p-2 rounded-lg bg-muted dark:bg-muted
            hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors
            ${!canGoPrev ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={goToNext}
          disabled={!canGoNext}
          className={`
            p-2 rounded-lg bg-muted dark:bg-muted
            hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors
            ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
