import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  size: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

export interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  spread?: number;
  origin?: { x: number; y: number };
  onComplete?: () => void;
}

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C4A1',
];

export function ConfettiEffect({
  active,
  duration = 3000,
  particleCount = 50,
  colors = defaultColors,
  spread = 360,
  origin = { x: 50, y: 50 },
  onComplete,
}: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (spread / particleCount) * i - (spread / 2);
        const velocity = 5 + Math.random() * 10;
        const rad = (angle * Math.PI) / 180;

        newParticles.push({
          id: i,
          x: origin.x,
          y: origin.y,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
          size: 8 + Math.random() * 8,
          velocityX: Math.cos(rad) * velocity,
          velocityY: Math.sin(rad) * velocity,
          rotationSpeed: (Math.random() - 0.5) * 20,
        });
      }

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, particleCount, spread, origin.x, origin.y, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              rotate: particle.rotation,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: `calc(${particle.x}% + ${particle.velocityX * 100}px)`,
              y: `calc(${particle.y}% + ${particle.velocityY * 100 + 500}px)`,
              rotate: particle.rotation + particle.rotationSpeed * 360,
              opacity: 0,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.shape === 'circle' ? '50%' : '0',
              clipPath: particle.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Success Confetti (shoots from bottom)
export function SuccessConfetti({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete?: () => void;
}) {
  return (
    <ConfettiEffect
      active={active}
      duration={3000}
      particleCount={60}
      spread={90}
      origin={{ x: 50, y: 100 }}
      colors={['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']}
      onComplete={onComplete}
    />
  );
}

// Fireworks (bursts from center)
export function FireworksEffect({
  active,
  burstCount = 3,
  onComplete,
}: {
  active: boolean;
  burstCount?: number;
  onComplete?: () => void;
}) {
  const [bursts, setBursts] = useState<number[]>([]);

  useEffect(() => {
    if (active) {
      const burstIds: number[] = [];
      
      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          burstIds.push(i);
          setBursts([...burstIds]);
        }, i * 500);
      }

      setTimeout(() => {
        setBursts([]);
        onComplete?.();
      }, burstCount * 500 + 3000);
    } else {
      setBursts([]);
    }
  }, [active, burstCount]);

  return (
    <>
      {bursts.map((id) => (
        <ConfettiEffect
          key={id}
          active
          duration={2000}
          particleCount={40}
          spread={360}
          origin={{
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
          }}
        />
      ))}
    </>
  );
}

// Emoji Rain
export function EmojiRain({
  active,
  emojis = ['🎉', '🎊', '🎈', '✨', '⭐'],
  count = 30,
  duration = 4000,
}: {
  active: boolean;
  emojis?: string[];
  count?: number;
  duration?: number;
}) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    emoji: string;
    x: number;
    delay: number;
    duration: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 1000,
        duration: 3000 + Math.random() * 2000,
        rotation: Math.random() * 360,
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, count, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: '-10%',
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: '110%',
              rotate: particle.rotation,
              opacity: [1, 1, 0.5, 0],
            }}
            transition={{
              duration: particle.duration / 1000,
              delay: particle.delay / 1000,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              fontSize: '2rem',
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Celebration Hook
export function useCelebration() {
  const [isActive, setIsActive] = useState(false);

  const celebrate = () => {
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  return {
    isActive,
    celebrate,
    stop,
    ConfettiComponent: (
      <ConfettiEffect
        active={isActive}
        onComplete={stop}
      />
    ),
  };
}
