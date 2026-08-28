'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TextHackerScrambleProps {
  text: string;
  className?: string;
  scrambleSpeed?: number; // ms between character iterations
  resolveSpeed?: number; // iterations before resolving each character
  characters?: string;
  autoStart?: boolean;
  scrollTrigger?: boolean; // Trigger scramble on scroll into viewport
  triggerOnce?: boolean;
  hoverToScramble?: boolean;
  restartKey?: string | number;
  highlightClass?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  onComplete?: () => void;
}

const DEFAULT_GLYPHS = 'ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~_010101XYZΔΨΩ⬡✦❖';

export const TextHackerScramble: React.FC<TextHackerScrambleProps> = ({
  text,
  className = '',
  scrambleSpeed = 18,
  resolveSpeed = 1.5,
  characters = DEFAULT_GLYPHS,
  autoStart = true,
  scrollTrigger = false,
  triggerOnce = false,
  hoverToScramble = true,
  restartKey,
  highlightClass = 'text-[#c084fc]',
  as: Component = 'span',
  onComplete,
}) => {
  const prevTextRef = useRef(text);
  // Hydration-safe initial state: always starts with static text
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const iterationRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const failsafeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef(false);

  const startScramble = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (failsafeTimerRef.current) {
      clearTimeout(failsafeTimerRef.current);
    }

    setIsScrambling(true);
    iterationRef.current = 0;

    const targetLength = text.length;
    // Compute step to ensure full resolution within <= 320ms
    const stepRatio = Math.max(1, targetLength / 12);

    intervalRef.current = setInterval(() => {
      iterationRef.current += 1;
      const currentIteration = iterationRef.current;

      // First 2 iterations: brief wild randomize
      if (currentIteration < 2) {
        setDisplayText(
          text
            .split('')
            .map((char) => {
              if (char === ' ') return ' ';
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('')
        );
        return;
      }

      // Progressive left-to-right decoding
      const solvedThreshold = Math.floor((currentIteration - 2) * stepRatio);

      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < solvedThreshold) {
            return text[index];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (solvedThreshold >= targetLength) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
        setIsScrambling(false);
        if (onComplete) {
          onComplete();
        }
      }
    }, scrambleSpeed);

    // Hard failsafe: guarantee text restores within 400ms
    failsafeTimerRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayText(text);
      setIsScrambling(false);
      if (onComplete) {
        onComplete();
      }
    }, 400);
  }, [text, characters, scrambleSpeed, onComplete]);

  // Sync when text changes
  useEffect(() => {
    if (prevTextRef.current !== text) {
      prevTextRef.current = text;
      setDisplayText(text);
      if (autoStart) {
        startScramble();
      }
    }
  }, [text, autoStart, startScramble]);

  // Handle external restartKey trigger
  useEffect(() => {
    if (restartKey !== undefined) {
      startScramble();
    }
  }, [restartKey, startScramble]);

  // Trigger on initial client mount safely
  useEffect(() => {
    if (autoStart && !scrollTrigger) {
      const timer = setTimeout(() => {
        startScramble();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoStart, scrollTrigger, startScramble]);

  // IntersectionObserver for scroll-triggered scramble
  useEffect(() => {
    if (!scrollTrigger || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!triggerOnce || !hasTriggeredRef.current) {
              startScramble();
              hasTriggeredRef.current = true;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [scrollTrigger, triggerOnce, startScramble]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverToScramble && !isScrambling) {
      startScramble();
    }
  };

  return (
    <Component
      ref={elementRef as unknown as React.Ref<never>}
      onMouseEnter={handleMouseEnter}
      suppressHydrationWarning
      className={`font-mono transition-colors duration-200 inline-block select-none ${
        isScrambling ? `${highlightClass} drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]` : ''
      } ${className}`}
    >
      {displayText}
    </Component>
  );
};

export default TextHackerScramble;
