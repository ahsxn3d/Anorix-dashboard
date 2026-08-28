'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, ShieldCheck, Database, Cpu, Activity, RefreshCw } from 'lucide-react';
import { BounceRotateText } from './BounceRotateText';
import { TextHackerScramble } from './TextHackerScramble';

interface DashboardLoadingScreenProps {
  isLoading: boolean;
  onFinished?: () => void;
  title?: string;
  subtitle?: string;
}

export const DashboardLoadingScreen: React.FC<DashboardLoadingScreenProps> = ({
  isLoading,
  onFinished,
  title = "CMS ADMIN PANEL",
  subtitle = "ANORIX STUDIO COCKPIT v3.0"
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const logs = [
    { text: "INITIALIZING SECURE SESSION HANDSHAKE...", tag: "SYS" },
    { text: "AUTHENTICATING WORKSPACE...", tag: "AUTH" },
    { text: "FETCHING CMS DATA...", tag: "CMS" },
    { text: "SYNCHRONIZING GRAPHQL ENDPOINTS...", tag: "GRAPH" },
    { text: "DEPLOYMENTS & INQUIRIES BOARD READY.", tag: "OK" }
  ];

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      return;
    }

    setProgress(0);
    setCurrentStepIndex(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onFinished) {
            setTimeout(() => onFinished(), 300);
          }
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 12) + 6;
        if (next > 20 && next <= 45) setCurrentStepIndex(1);
        else if (next > 45 && next <= 70) setCurrentStepIndex(2);
        else if (next > 70 && next <= 90) setCurrentStepIndex(3);
        else if (next > 90) setCurrentStepIndex(4);

        return next > 100 ? 100 : next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isLoading, onFinished]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="cms-loading-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 bg-[#0a0514] text-slate-100 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Background Glow Spotlights */}
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#a855f7]/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#06b6d4]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Background Grid Lines Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          {/* Central Technical Loading Container */}
          <div className="w-full max-w-2xl bg-[#0d061e]/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-3xl relative z-10 space-y-6">
            
            {/* Top Brand Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] via-[#7c3aed] to-[#06b6d4] p-[1px] shadow-lg shadow-[#a855f7]/30">
                  <div className="w-full h-full bg-[#0a0514] rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#a855f7] animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold tracking-wider text-white uppercase font-mono">
                      <TextHackerScramble 
                        text={title} 
                        scrambleSpeed={32} 
                        resolveSpeed={3}
                        highlightClass="text-purple-400"
                        hoverToScramble={false}
                        scrollTrigger={false}
                        autoStart={true}
                      />
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#a855f7]/20 text-[#e9d5ff] border border-[#a855f7]/30 animate-bounce-rotate">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#a393eb]/70 mt-0.5">
                    <TextHackerScramble 
                      text={subtitle} 
                      scrambleSpeed={28} 
                      resolveSpeed={3}
                      highlightClass="text-cyan-400"
                      hoverToScramble={false}
                      scrollTrigger={false}
                      autoStart={true}
                    />
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#130728] border border-white/10 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-[#06b6d4] animate-spin" />
                <span className="text-[#a393eb] font-bold">{progress}%</span>
              </div>
            </div>

            {/* Typography Log Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#a855f7]" />
                  <TextHackerScramble 
                    text="AUTHENTICATING WORKSPACE..." 
                    scrambleSpeed={20}
                    hoverToScramble={false}
                    scrollTrigger={false}
                    autoStart={true}
                  />
                </span>
                <span className="text-[#06b6d4] animate-pulse">
                  <TextHackerScramble 
                    text="FETCHING CMS DATA..." 
                    scrambleSpeed={22}
                    hoverToScramble={false}
                    scrollTrigger={false}
                    autoStart={true}
                  />
                </span>
              </div>

              {/* Staggered Linear Progress Bar */}
              <div className="relative w-full h-3 bg-[#0a0514] rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                {/* Track ticks */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(255,255,255,0.05)_100%)] bg-[length:12px_100%] pointer-events-none" />
                
                {/* Active Bar */}
                <motion.div
                  className="h-full bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#06b6d4] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <div className="absolute top-0 bottom-0 right-0 w-2 bg-white rounded-full animate-ping" />
                </motion.div>
              </div>
            </div>

            {/* Technical Console Log Box */}
            <div className="bg-[#0a0514]/90 rounded-2xl p-4 border border-white/10 font-mono text-xs space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-[#a393eb]/50 pb-1.5 border-b border-white/5">
                <span>TELEMETRY CONSOLE FEED</span>
                <span>NODE ID: EU-CMS-09</span>
              </div>

              <div className="space-y-1.5 min-h-[96px] flex flex-col justify-end">
                {logs.slice(0, currentStepIndex + 1).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-[#a393eb] border border-white/10 shrink-0">
                      [{log.tag}]
                    </span>
                    <TextHackerScramble
                      text={log.text}
                      scrambleSpeed={24}
                      resolveSpeed={2}
                      hoverToScramble={false}
                      scrollTrigger={false}
                      autoStart={true}
                      restartKey={`log-${index}`}
                      highlightClass="text-[#c084fc]"
                      className={index === currentStepIndex ? "text-white font-bold" : "text-slate-400"}
                    />
                    {index === currentStepIndex && (
                      <span className="w-1.5 h-3 bg-[#a855f7] inline-block animate-pulse ml-auto shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Skeleton Loading Grid Visualizer */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#a393eb]/60">
                <span>STRUCTURE PREVIEW SKELETON</span>
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#a855f7]" /> HYDRATING DOM
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Skeleton Card 1 */}
                <div className="p-3 rounded-xl bg-[#130728]/80 border border-white/5 space-y-2 animate-pulse">
                  <div className="w-8 h-2 bg-white/10 rounded" />
                  <div className="w-full h-3 bg-[#a855f7]/20 rounded" />
                  <div className="w-2/3 h-2 bg-white/5 rounded" />
                </div>

                {/* Skeleton Card 2 */}
                <div className="p-3 rounded-xl bg-[#130728]/80 border border-white/5 space-y-2 animate-pulse delay-100">
                  <div className="w-12 h-2 bg-white/10 rounded" />
                  <div className="w-full h-3 bg-[#06b6d4]/20 rounded" />
                  <div className="w-3/4 h-2 bg-white/5 rounded" />
                </div>

                {/* Skeleton Card 3 */}
                <div className="p-3 rounded-xl bg-[#130728]/80 border border-white/5 space-y-2 animate-pulse delay-200">
                  <div className="w-10 h-2 bg-white/10 rounded" />
                  <div className="w-full h-3 bg-white/20 rounded" />
                  <div className="w-1/2 h-2 bg-white/5 rounded" />
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#a393eb]/60 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#06b6d4]" /> Encrypted Session Active
              </span>
              <span className="text-[10px]">ANORIX DARK PRISMATIC ENGINE</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
