'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

interface PlayfulLogoProps {
  onClick?: () => void;
  className?: string;
  brandText?: string;
  autoPlay?: boolean;
  interval?: number;
}

type HoverEffect =
  | 'hourglass-morph'
  | 'clover-bloom'
  | 'folded-prism'
  | 'kinetic-hyphen'
  | 'barrel-roll'
  | 'matrix-scramble'
  | 'jelly-squash'
  | 'diamond-spin';

const EFFECTS: HoverEffect[] = [
  'hourglass-morph',
  'clover-bloom',
  'folded-prism',
  'kinetic-hyphen',
  'barrel-roll',
  'matrix-scramble',
  'jelly-squash',
  'diamond-spin',
];

const CYBER_GLYPHS = ['∆', '⬡', '◊', '✦', '❖', '∑', '0', '1', '7', 'X', 'Ø', 'Ξ'];
const DEFAULT_CHARS = ['A', 'N', 'O', 'R', 'I', 'X'];

export const PlayfulLogo: React.FC<PlayfulLogoProps> = ({ 
  onClick, 
  className = '',
  brandText = 'ANORIX',
  autoPlay = false,
  interval = 4500,
}) => {
  const originalChars = brandText.split('');
  const [isHovered, setIsHovered] = useState(false);
  const [activeEffect, setActiveEffect] = useState<HoverEffect | null>(null);
  const [scrambledChars, setScrambledChars] = useState<string[]>(originalChars);
  const [effectTargetIndex, setEffectTargetIndex] = useState<number>(0);
  
  const effectIndexRef = useRef<number>(0);
  const lastTargetIdxRef = useRef<number>(-1);
  const scrambleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoLoopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all running animation timers
  const clearAllTimers = useCallback(() => {
    if (scrambleTimerRef.current) {
      clearInterval(scrambleTimerRef.current);
      scrambleTimerRef.current = null;
    }
    if (autoLoopTimerRef.current) {
      clearInterval(autoLoopTimerRef.current);
      autoLoopTimerRef.current = null;
    }
    if (hoverCycleTimerRef.current) {
      clearInterval(hoverCycleTimerRef.current);
      hoverCycleTimerRef.current = null;
    }
  }, []);

  // Trigger a specific or next kinetic effect from the 8 effects
  const triggerNextEffect = useCallback(() => {
    const chosenEffect = EFFECTS[effectIndexRef.current % EFFECTS.length];
    effectIndexRef.current += 1;
    setActiveEffect(chosenEffect);

    // Pick a truly randomized target letter position across characters (A, N, O, R, E, N, T)
    let nextTargetIdx = Math.floor(Math.random() * originalChars.length);
    if (originalChars.length > 1 && nextTargetIdx === lastTargetIdxRef.current) {
      // Pick any different random index
      const otherIndices = originalChars.map((_, i) => i).filter((i) => i !== lastTargetIdxRef.current);
      nextTargetIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)] ?? 0;
    }
    lastTargetIdxRef.current = nextTargetIdx;
    setEffectTargetIndex(nextTargetIdx);

    // If matrix scramble effect chosen, run rapid character cycle
    if (chosenEffect === 'matrix-scramble') {
      if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
      let step = 0;
      const maxSteps = 9;

      scrambleTimerRef.current = setInterval(() => {
        step++;
        if (step >= maxSteps) {
          if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
          setScrambledChars(originalChars);
        } else {
          setScrambledChars(
            originalChars.map((orig) => {
              if (Math.random() > 0.3) {
                return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
              }
              return orig;
            })
          );
        }
      }, 65);
    } else {
      setScrambledChars(originalChars);
    }
  }, [originalChars]);

  // Clean reset back to original state
  const resetToDefault = useCallback(() => {
    clearAllTimers();
    setActiveEffect(null);
    setScrambledChars(originalChars);
  }, [clearAllTimers, originalChars]);

  // Optional autoPlay loop (only if autoPlay is explicitly true)
  useEffect(() => {
    if (!autoPlay) return;

    const runRandomizedLoop = () => {
      triggerNextEffect();
      const nextDelay = interval + (Math.random() * 2000 - 1000); // randomize interval between cycles
      autoLoopTimerRef.current = setTimeout(runRandomizedLoop, Math.max(2500, nextDelay));
    };

    const initialTimer = setTimeout(() => {
      runRandomizedLoop();
    }, 1200);

    return () => {
      clearTimeout(initialTimer);
      clearAllTimers();
    };
  }, [autoPlay, interval, triggerNextEffect, clearAllTimers]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Handle Hover In: immediately start the effect and cycle smoothly if held
  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerNextEffect();

    // If the user remains hovered, cycle to next effect smoothly
    if (hoverCycleTimerRef.current) clearInterval(hoverCycleTimerRef.current);
    hoverCycleTimerRef.current = setInterval(() => {
      triggerNextEffect();
    }, 1900);
  };

  // Handle Hover Out: immediately stop all effects and reset to default
  const handleMouseLeave = () => {
    setIsHovered(false);
    resetToDefault();
  };

  const handleClick = () => {
    triggerNextEffect();
    if (onClick) onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id="dashboard-brand-btn"
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-[#1c0c32]/85 backdrop-blur-xl border border-purple-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(139,0,238,0.3)] hover:bg-[#281147] hover:shadow-[0_0_30px_rgba(139,0,238,0.6)] hover:border-purple-300/80 transition-all duration-300 cursor-pointer select-none relative group overflow-hidden ${className}`}
    >
      {/* Ambient Specular Sheen Sweep */}
      <motion.div
        animate={{
          x: ['-120%', '220%'],
          opacity: isHovered ? [0, 0.6, 0] : [0, 0.25, 0],
        }}
        transition={{
          duration: isHovered ? 2.5 : 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: isHovered ? 1 : 4,
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Dynamic Characters Container */}
      <div className="flex items-center tracking-tight font-display text-lg sm:text-2xl font-black text-white">
        <div className="flex items-center">
          {originalChars.map((char, index) => {
            const isTargetChar = index === effectTargetIndex;

            // Render Hyphen Split (e.g. ANO-RENT)
            const hyphenSplitIndex = Math.max(1, Math.floor(originalChars.length / 2));
            if (activeEffect === 'kinetic-hyphen' && index === hyphenSplitIndex) {
              return (
                <React.Fragment key={`char-fragment-${index}`}>
                  <motion.span
                    initial={{ scale: 0, width: 0, opacity: 0 }}
                    animate={{ scale: 1, width: 'auto', opacity: 1 }}
                    exit={{ scale: 0, width: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                    className="inline-flex items-center justify-center px-0.5 text-[#C084FC] font-black text-sm sm:text-lg"
                  >
                    -
                  </motion.span>
                  <CharItem
                    char={char}
                    index={index}
                    activeEffect={activeEffect}
                    isTargetChar={isTargetChar}
                    scrambledChar={scrambledChars[index] || char}
                  />
                </React.Fragment>
              );
            }

            return (
              <CharItem
                key={`char-${index}`}
                char={char}
                index={index}
                activeEffect={activeEffect}
                isTargetChar={isTargetChar}
                scrambledChar={scrambledChars[index] || char}
              />
            );
          })}
        </div>
      </div>

      {/* Live Glowing Status Dot */}
      <motion.span
        animate={{
          scale: isHovered ? [1, 1.45, 1.2] : [1, 1.25, 1],
          opacity: [0.85, 1, 0.85],
          boxShadow: isHovered
            ? [
                '0 0 12px #A855F7',
                '0 0 24px #C084FC, 0 0 35px #8B00EE',
                '0 0 18px #A855F7',
              ]
            : [
                '0 0 8px #A855F7',
                '0 0 14px #C084FC',
                '0 0 8px #A855F7',
              ],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#A855F7] shrink-0 ml-0.5"
      />
    </motion.button>
  );
};

// Sub-component for individual character interactions & geometric vector morphs
interface CharItemProps {
  char: string;
  index: number;
  activeEffect: HoverEffect | null;
  isTargetChar: boolean;
  scrambledChar: string;
}

const CharItem: React.FC<CharItemProps> = ({
  char,
  index,
  activeEffect,
  isTargetChar,
  scrambledChar,
}) => {
  // 1. Hourglass Morph
  if (activeEffect === 'hourglass-morph' && isTargetChar) {
    return (
      <motion.span
        key={`morph-hourglass-${index}`}
        initial={{ scale: 0.2, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 180, opacity: 1 }}
        exit={{ scale: 0.2, rotate: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="inline-flex items-center justify-center mx-0.5 w-[1.1em] h-[1.1em]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]">
          <defs>
            <linearGradient id={`hgGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#8B00EE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <polygon points="4,3 20,3 12,12" fill={`url(#hgGrad-${index})`} />
          <polygon points="4,21 20,21 12,12" fill={`url(#hgGrad-${index})`} opacity="0.9" />
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      </motion.span>
    );
  }

  // 2. Clover Bloom
  if (activeEffect === 'clover-bloom' && isTargetChar) {
    return (
      <motion.span
        key={`morph-clover-${index}`}
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{ scale: 1.15, rotate: 360, opacity: 1 }}
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="inline-flex items-center justify-center mx-0.5 w-[1.15em] h-[1.15em]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(236,72,153,0.85)]">
          <defs>
            <linearGradient id={`cloverGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#8B00EE" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="7" r="4.5" fill={`url(#cloverGrad-${index})`} />
          <circle cx="17" cy="12" r="4.5" fill={`url(#cloverGrad-${index})`} opacity="0.9" />
          <circle cx="12" cy="17" r="4.5" fill={`url(#cloverGrad-${index})`} />
          <circle cx="7" cy="12" r="4.5" fill={`url(#cloverGrad-${index})`} opacity="0.9" />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      </motion.span>
    );
  }

  // 3. Folded Prism
  if (activeEffect === 'folded-prism' && isTargetChar) {
    return (
      <motion.span
        key={`morph-prism-${index}`}
        initial={{ scale: 0.1, rotateY: 90, opacity: 0 }}
        animate={{ scale: 1.1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.1, rotateY: -90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        className="inline-flex items-center justify-center mx-0.5 w-[1.1em] h-[1.1em]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.85)]">
          <defs>
            <linearGradient id={`prismGrad1-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#8B00EE" />
            </linearGradient>
            <linearGradient id={`prismGrad2-${index}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <polygon points="12,2 22,12 12,22" fill={`url(#prismGrad1-${index})`} />
          <polygon points="12,2 2,12 12,22" fill={`url(#prismGrad2-${index})`} opacity="0.85" />
          <line x1="12" y1="2" x2="12" y2="22" stroke="#FFFFFF" strokeWidth="1" opacity="0.75" />
        </svg>
      </motion.span>
    );
  }

  // 4. Diamond Spin
  if (activeEffect === 'diamond-spin' && isTargetChar) {
    return (
      <motion.span
        key={`morph-diamond-${index}`}
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360], opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="inline-flex items-center justify-center mx-0.5 w-[1.1em] h-[1.1em]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]">
          <defs>
            <linearGradient id={`diamondGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
          <polygon points="12,2 22,12 12,22 2,12" fill={`url(#diamondGrad-${index})`} />
          <polygon points="12,6 18,12 12,18 6,12" fill="#FFFFFF" opacity="0.3" />
        </svg>
      </motion.span>
    );
  }

  // Kinetic Transformations
  let charAnimate: any = {
    rotateX: 0,
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    y: 0,
  };
  let charTransition: any = {
    duration: 0.25,
    ease: 'easeOut',
  };

  if (activeEffect === 'barrel-roll') {
    charAnimate = {
      rotateX: [0, 360],
      color: ['#FFFFFF', '#C084FC', '#38BDF8', '#FFFFFF'],
      textShadow: [
        '0 0 0px rgba(0,0,0,0)',
        '0 0 15px rgba(192,132,252,0.8)',
        '0 0 0px rgba(0,0,0,0)',
      ],
    };
    charTransition = {
      duration: 0.85,
      delay: index * 0.08,
      ease: [0.34, 1.56, 0.64, 1],
    };
  } else if (activeEffect === 'jelly-squash') {
    charAnimate = {
      scaleY: [1, 1.4, 0.85, 1.1, 1],
      scaleX: [1, 0.8, 1.2, 0.95, 1],
      y: [0, -6, 2, -1, 0],
      color: ['#FFFFFF', '#E9D5FF', '#C084FC', '#FFFFFF'],
    };
    charTransition = {
      duration: 0.9,
      delay: index * 0.06,
      ease: 'easeOut',
    };
  } else if (activeEffect === 'kinetic-hyphen') {
    charAnimate = {
      y: index % 2 === 0 ? -2 : 2,
      rotate: index % 2 === 0 ? -3 : 3,
      color: '#E9D5FF',
    };
    charTransition = {
      type: 'spring',
      stiffness: 260,
      damping: 18,
      delay: index * 0.03,
    };
  }

  return (
    <motion.span
      animate={charAnimate}
      transition={charTransition}
      className={`inline-block transition-colors duration-200 ${
        activeEffect === 'matrix-scramble'
          ? 'text-[#C084FC] drop-shadow-[0_0_8px_rgba(192,132,252,0.7)] font-mono'
          : 'hover:text-[#C084FC]'
      }`}
    >
      {activeEffect === 'matrix-scramble' ? scrambledChar : char}
    </motion.span>
  );
};

export default PlayfulLogo;
