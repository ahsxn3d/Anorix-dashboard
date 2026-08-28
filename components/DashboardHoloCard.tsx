'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';

interface DashboardHoloCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
  onClick?: () => void;
}

export const DashboardHoloCard: React.FC<DashboardHoloCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glowColor = 'rgba(139, 0, 238, 0.35)',
  onClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setSupportsFinePointer(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setSupportsFinePointer(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!supportsFinePointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = -yPct * maxTilt;
    const rotY = xPct * maxTilt;
    const gX = (xPct + 0.5) * 100;
    const gY = (yPct + 0.5) * 100;

    setTilt({ rotateX: rotX, rotateY: rotY, glareX: gX, glareY: gY });
  }, [maxTilt, supportsFinePointer]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (supportsFinePointer) setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
      }}
      onClick={onClick}
      style={{ perspective: supportsFinePointer ? 1000 : undefined }}
      className="relative w-full select-none"
    >
      <motion.div
        animate={{
          rotateX: supportsFinePointer && isHovered ? tilt.rotateX : 0,
          rotateY: supportsFinePointer && isHovered ? tilt.rotateY : 0,
          scale: supportsFinePointer && isHovered ? 1.012 : 1,
          y: supportsFinePointer && isHovered ? -2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full rounded-xl sm:rounded-2xl border bg-[#0D041A] transition-colors duration-200 ${
          supportsFinePointer ? '[transform-style:preserve-3d]' : ''
        } ${
          isHovered
            ? 'border-purple-500/80 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(139,0,238,0.35)]'
            : 'border-purple-500/20 shadow-[0_6px_20px_rgba(0,0,0,0.6)]'
        } ${className}`}
      >
        {/* Specular Glare */}
        {supportsFinePointer && isHovered && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 mix-blend-overlay transition-opacity duration-200"
            style={{
              opacity: 0.5,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.3) 0%, ${glowColor} 30%, transparent 65%)`,
            }}
          />
        )}

        <div className={`relative z-10 w-full h-full p-4 sm:p-5 ${supportsFinePointer ? '[transform-style:preserve-3d]' : ''}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
