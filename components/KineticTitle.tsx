'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface KineticTitleProps {
  text: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  scrambleOnMount?: boolean;
  scrollTrigger?: boolean;
  triggerOnce?: boolean;
  restartKey?: string | number;
}

const HACKER_GLYPHS = 'ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~_0101XYZΔΨΩ';

export const KineticTitle: React.FC<KineticTitleProps> = ({
  text = '',
  className = '',
  size = 'lg',
  scrambleOnMount = true,
  scrollTrigger = true,
  triggerOnce = false, // Allow re-scrambling on section entry
  restartKey,
}) => {
  const safeText = text || '';
  const [displayedChars, setDisplayedChars] = useState<string[]>(() => safeText.split(''));
  const [isScrambling, setIsScrambling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iterationRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const startHackingMachine = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsScrambling(true);
    iterationRef.current = 0;

    intervalRef.current = window.setInterval(() => {
      setDisplayedChars(() => {
        const solvedThreshold = Math.floor(iterationRef.current / 2.0);

        const next = safeText.split('').map((char, index) => {
          if (char === ' ') return ' ';
          if (index < solvedThreshold) {
            return safeText[index];
          }
          return HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)];
        });

        if (solvedThreshold >= safeText.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsScrambling(false);
          return safeText.split('');
        }

        iterationRef.current += 1;
        return next;
      });
    }, 28);
  }, [text]);

  // Scroll Trigger via IntersectionObserver
  useEffect(() => {
    if (!scrollTrigger || !containerRef.current) {
      if (scrambleOnMount) startHackingMachine();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!triggerOnce || !hasTriggeredRef.current) {
              hasTriggeredRef.current = true;
              startHackingMachine();
            }
          } else if (!triggerOnce) {
            hasTriggeredRef.current = false;
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [scrollTrigger, triggerOnce, scrambleOnMount, startHackingMachine]);

  // Support explicit restartKey or text updates
  useEffect(() => {
    if (restartKey !== undefined) {
      hasTriggeredRef.current = true;
      startHackingMachine();
    }
  }, [restartKey, startHackingMachine]);

  const sizeClasses = {
    xs: 'text-sm sm:text-base font-bold tracking-tight',
    sm: 'text-base sm:text-lg font-bold tracking-tight',
    md: 'text-xl sm:text-2xl font-black tracking-tight',
    lg: 'text-2xl sm:text-4xl font-black uppercase tracking-tighter',
    xl: 'text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter',
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (!isScrambling) startHackingMachine();
      }}
      className={`flex flex-wrap items-center select-none font-mono ${sizeClasses[size]} ${className}`}
    >
      {displayedChars.map((char, i) => {
        if (char === ' ') {
          return <span key={i} className="inline-block w-2 sm:w-3">&nbsp;</span>;
        }

        const isSpecial = char === 'i' || char === 'T' || char === '.' || char === '/' || char === '2' || char === '4';
        const isSolved = char === text[i];

        return (
          <span
            key={i}
            className={`inline-block transition-colors duration-75 ${
              !isSolved
                ? 'text-[#c084fc] animate-pulse drop-shadow-[0_0_8px_rgba(139,0,238,0.8)]'
                : isSpecial
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500'
                : 'text-white'
            }`}
            style={{
              textShadow: !isSolved ? '0 0 10px rgba(139, 0, 238, 0.75)' : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
