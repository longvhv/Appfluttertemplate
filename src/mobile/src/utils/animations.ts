/**
 * Animation Utilities for React Native
 * 
 * Provides pre-built animations and animation helpers
 */

import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Common animation configs
 */
export const AnimationConfig = {
  fast: { duration: 200, useNativeDriver: true },
  normal: { duration: 300, useNativeDriver: true },
  slow: { duration: 500, useNativeDriver: true },
  spring: {
    useNativeDriver: true,
    speed: 12,
    bounciness: 8,
  },
};

/**
 * Easing presets
 */
export const EasingPresets = {
  easeInOut: Easing.inOut(Easing.ease),
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  elastic: Easing.elastic(1),
  bounce: Easing.bounce,
  linear: Easing.linear,
};

/**
 * Fade In animation hook
 */
export function useFadeIn(duration: number = 300, delay: number = 0) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [opacity, duration, delay]);

  return { opacity };
}

/**
 * Fade Out animation hook
 */
export function useFadeOut(
  trigger: boolean,
  duration: number = 300,
  onComplete?: () => void
) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.timing(opacity, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start(() => {
        onComplete?.();
      });
    }
  }, [trigger, opacity, duration, onComplete]);

  return { opacity };
}

/**
 * Slide In animation hook
 */
export function useSlideIn(
  direction: 'left' | 'right' | 'up' | 'down',
  distance: number = 100,
  duration: number = 300
) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initialValues = {
      left: { x: -distance, y: 0 },
      right: { x: distance, y: 0 },
      up: { x: 0, y: -distance },
      down: { x: 0, y: distance },
    };

    const initial = initialValues[direction];
    translateX.setValue(initial.x);
    translateY.setValue(initial.y);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [direction, distance, duration, translateX, translateY]);

  return {
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * Scale animation hook
 */
export function useScale(
  trigger: boolean,
  toValue: number = 1,
  duration: number = 300
) {
  const scale = useRef(new Animated.Value(trigger ? toValue : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: trigger ? toValue : 1,
      useNativeDriver: true,
      ...AnimationConfig.spring,
    }).start();
  }, [trigger, toValue, scale]);

  return { transform: [{ scale }] };
}

/**
 * Rotate animation hook
 */
export function useRotate(duration: number = 1000, loop: boolean = true) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(rotation, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    if (loop) {
      Animated.loop(animation).start();
    } else {
      animation.start();
    }

    return () => {
      rotation.setValue(0);
    };
  }, [duration, loop, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { transform: [{ rotate }] };
}

/**
 * Pulse animation hook
 */
export function usePulse(duration: number = 1000, minScale: number = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: minScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scale, duration, minScale]);

  return { transform: [{ scale }] };
}

/**
 * Shake animation hook
 */
export function useShake(trigger: boolean, intensity: number = 10) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: intensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -intensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: intensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [trigger, intensity, translateX]);

  return { transform: [{ translateX }] };
}

/**
 * Bounce animation hook
 */
export function useBounce(trigger: boolean, height: number = 20) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -height,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [trigger, height, translateY]);

  return { transform: [{ translateY }] };
}

/**
 * Ripple animation hook
 */
export function useRipple(trigger: boolean, duration: number = 600) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      scale.setValue(0);
      opacity.setValue(1);

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [trigger, duration, scale, opacity]);

  return { transform: [{ scale }], opacity };
}

/**
 * Progress animation hook
 */
export function useProgress(value: number, duration: number = 500) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value,
      duration,
      useNativeDriver: false, // Width requires non-native driver
      easing: EasingPresets.easeInOut,
    }).start();
  }, [value, duration, progress]);

  return progress;
}

/**
 * Stagger animation helper
 */
export function useStagger(
  items: any[],
  delay: number = 100,
  duration: number = 300
) {
  const animations = useRef(
    items.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animationSequence = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: index * delay,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animationSequence).start();
  }, [items.length, delay, duration, animations]);

  return animations.map((opacity) => ({ opacity }));
}

/**
 * Controlled animation hook
 */
export function useControlledAnimation() {
  const value = useRef(new Animated.Value(0)).current;

  const animate = useCallback(
    (
      toValue: number,
      duration: number = 300,
      onComplete?: () => void
    ) => {
      Animated.timing(value, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start(onComplete);
    },
    [value]
  );

  const spring = useCallback(
    (
      toValue: number,
      config?: Animated.SpringAnimationConfig,
      onComplete?: () => void
    ) => {
      Animated.spring(value, {
        toValue,
        useNativeDriver: true,
        ...AnimationConfig.spring,
        ...config,
      }).start(onComplete);
    },
    [value]
  );

  const reset = useCallback(() => {
    value.setValue(0);
  }, [value]);

  return { value, animate, spring, reset };
}

/**
 * Sequence animation hook
 */
export function useSequence(
  animations: Animated.CompositeAnimation[],
  loop: boolean = false
) {
  useEffect(() => {
    const sequence = Animated.sequence(animations);
    
    if (loop) {
      Animated.loop(sequence).start();
    } else {
      sequence.start();
    }
  }, [animations, loop]);
}

/**
 * Interpolate helper
 */
export function interpolate(
  value: Animated.Value,
  inputRange: number[],
  outputRange: number[] | string[]
) {
  return value.interpolate({ inputRange, outputRange });
}

/**
 * Create timing animation
 */
export function timing(
  value: Animated.Value,
  toValue: number,
  duration: number = 300,
  easing = EasingPresets.easeInOut
) {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  });
}

/**
 * Create spring animation
 */
export function spring(
  value: Animated.Value,
  toValue: number,
  config?: Animated.SpringAnimationConfig
) {
  return Animated.spring(value, {
    toValue,
    useNativeDriver: true,
    ...AnimationConfig.spring,
    ...config,
  });
}

/**
 * Parallel animations helper
 */
export function parallel(...animations: Animated.CompositeAnimation[]) {
  return Animated.parallel(animations);
}

/**
 * Sequence animations helper
 */
export function sequence(...animations: Animated.CompositeAnimation[]) {
  return Animated.sequence(animations);
}

/**
 * Delay helper
 */
export function delay(duration: number) {
  return Animated.delay(duration);
}

/**
 * Loop helper
 */
export function loop(animation: Animated.CompositeAnimation, iterations?: number) {
  return Animated.loop(animation, { iterations });
}
