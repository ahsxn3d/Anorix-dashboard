'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';

interface CyberScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;        // Interval speed per iteration in ms (default: 20ms)
  cycles?: number;               // Number of glyph cycles per character (default: 2)
  characters?: string;           // Custom glyph pool
  triggerOnMount?: boolean;      // Trigger immediately when rendered (default: true)
  triggerOnView?: boolean;       // Trigger when scrolled into view (default: true)
  triggerOnHover?: boolean;      // Trigger when hovered (default: true)
  triggerKey?: string | number;  // External key change (e.g. currentPage) to re-trigger
  onComplete?: () => void;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';

export const CyberScrambleText: React.FC<CyberScrambleTextProps> = ({
  text,
  className = '',
  scrambleSpeed = 20,
  cycles = 2,
  characters = DEFAULT_CHARS,
  triggerOnMount = true,
  triggerOnView = true,
  triggerOnHover = true,
  triggerKey,
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-20px' });
  const hasTriggeredOnView = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const failsafeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync displayText when text prop changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const startScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);

    setIsScrambling(true);

    let iteration = 0;
    const targetLength = text.length;
    // Guarantee resolution within <= 320ms: dynamically scale step
    const stepIncrement = Math.max(0.5, targetLength / 14);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += stepIncrement;

      if (iteration >= targetLength) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
        setIsScrambling(false);
        if (onComplete) onComplete();
      }
    }, Math.min(scrambleSpeed, 20));

    // Hard failsafe: guarantee 100% resolution to clean plain English text within 380ms
    failsafeTimerRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayText(text);
      setIsScrambling(false);
      if (onComplete) onComplete();
    }, 380);
  }, [text, characters, scrambleSpeed, onComplete]);

  // 1. Trigger on Mount
  useEffect(() => {
    if (triggerOnMount) {
      startScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    };
  }, [triggerOnMount, startScramble]);

  // 2. Trigger on Page Shift / Trigger Key Change
  useEffect(() => {
    if (triggerKey !== undefined) {
      startScramble();
    }
  }, [triggerKey, startScramble]);

  // 3. Trigger on Scroll / Viewport Entry
  useEffect(() => {
    if (triggerOnView && isInView && !hasTriggeredOnView.current) {
      hasTriggeredOnView.current = true;
      startScramble();
    } else if (triggerOnView && !isInView) {
      hasTriggeredOnView.current = false;
    }
  }, [isInView, triggerOnView, startScramble]);

  return (
    <motion.span
      ref={containerRef}
      onMouseEnter={() => {
        if (triggerOnHover && !isScrambling) {
          startScramble();
        }
      }}
      className={`inline-block font-mono select-none ${isScrambling ? 'text-[#C084FC] drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]' : ''} ${className}`}
    >
      {displayText}
    </motion.span>
  );
};
