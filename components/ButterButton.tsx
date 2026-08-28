'use client'

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { sound } from '@/lib/sound';

interface ButterButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'emerald' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  isMagnetic?: boolean;
  enableSound?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  id?: string;
  'aria-label'?: string;
}

export const ButterButton: React.FC<ButterButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isMagnetic = true,
  enableSound = true,
  children,
  onClick,
  onMouseEnter,
  className = '',
  disabled,
  type,
  title,
  id,
  'aria-label': ariaLabel,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMagnetic || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.28;
    const distanceY = (e.clientY - centerY) * 0.28;
    setOffset({ x: distanceX, y: distanceY });
  }, [isMagnetic]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    if (enableSound) {
      sound.playHoverTick();
    }
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound) {
      sound.playChime();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary: 'bg-[#8B00EE] hover:bg-[#9d1af7] text-white shadow-[0_0_20px_rgba(139,0,238,0.4)] border border-purple-400/40',
    purple: 'bg-[#8B00EE]/80 hover:bg-[#8B00EE] text-white shadow-[0_0_15px_rgba(139,0,238,0.35)] border border-purple-400/30',
    secondary: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 hover:border-purple-500/40',
    emerald: 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    cyan: 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl font-bold tracking-wide',
    lg: 'px-7 py-3.5 text-base rounded-2xl font-black tracking-wider'
  };

  return (
    <motion.button
      ref={btnRef}
      animate={{ x: isHovered ? offset.x : 0, y: isHovered ? offset.y : 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ 
        scale: 0.94, 
        transition: { type: 'spring', stiffness: 500, damping: 15 } 
      }}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      title={title}
      id={id}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center font-mono select-none cursor-pointer transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {/* Dynamic Glow Aura */}
      {isHovered && (
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur-sm pointer-events-none transition-opacity duration-200" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
