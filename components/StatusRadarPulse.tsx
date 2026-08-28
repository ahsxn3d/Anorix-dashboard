'use client'

import React from 'react';
import { motion } from 'motion/react';

export interface StatusRadarPulseProps {
  status: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE' | 'LIVE' | 'SYNCING';
  label?: string;
  sublabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusRadarPulse: React.FC<StatusRadarPulseProps> = ({
  status,
  label,
  sublabel,
  className = '',
  size = 'md',
}) => {
  const colorMap = {
    OPTIMAL: { bg: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.5)', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    LIVE: { bg: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.5)', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    SYNCING: { bg: 'bg-cyan-500', glow: 'rgba(6, 182, 212, 0.5)', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    DEGRADED: { bg: 'bg-amber-500', glow: 'rgba(245, 158, 11, 0.5)', text: 'text-amber-400', border: 'border-amber-500/30' },
    MAINTENANCE: { bg: 'bg-rose-500', glow: 'rgba(244, 63, 94, 0.5)', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  const current = colorMap[status] || colorMap.OPTIMAL;

  const sizeClasses = {
    sm: 'px-2 py-1 gap-2 text-[10px]',
    md: 'px-3 py-1.5 gap-2.5 text-[11px]',
    lg: 'px-3.5 py-2 gap-3 text-xs',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-[#0D041A] border border-purple-500/20 shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {/* Concentric Radar Rings */}
      <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
        <motion.span
          animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute w-full h-full rounded-full ${current.bg} opacity-75`}
        />
        <span
          className={`relative w-2 h-2 rounded-full ${current.bg}`}
          style={{ boxShadow: `0 0 8px ${current.glow}` }}
        />
      </div>

      <div className="flex flex-col min-w-0">
        <span className={`font-mono font-bold tracking-wider uppercase truncate ${current.text}`}>
          {label || status}
        </span>
        {sublabel && (
          <span className="text-[9px] font-mono text-slate-400 leading-none truncate">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
