'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { InquiriesSection } from '@/components/InquiriesSection';
import { DeploymentsSection } from '@/components/DeploymentsSection';
import { CmsSection } from '@/components/CmsSection';
import { SettingsSection } from '@/components/SettingsSection';
import { RightAiAssistant } from '@/components/RightAiAssistant';
import { DashboardLoadingScreen } from '@/components/DashboardLoadingScreen';
import { GoogleSignInModal } from '@/components/GoogleSignInModal';
import { KineticTitle } from '@/components/KineticTitle';
import { TextHackerScramble } from '@/components/TextHackerScramble';
import { DashboardHoloCard } from '@/components/DashboardHoloCard';
import { StatusRadarPulse } from '@/components/StatusRadarPulse';
import { CyberButton } from '@/components/CyberButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AUTHORIZED_EMAIL } from '@/lib/constants';
import { sound } from '@/lib/sound';
import { Cpu, Lock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { NavTab } from '@/lib/types';

interface AdminDashboardProps {
  sessionUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminDashboard({ sessionUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('inquiries');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30 Days');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  
  // Cinematic Dashboard Loading Screen on Initial Mount
  const [isCmsLoading, setIsCmsLoading] = useState(true);
  const [reloadCounter, setReloadCounter] = useState(0);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Ahsan',
    email: AUTHORIZED_EMAIL,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Sync session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check URL parameters returned from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const name = urlParams.get('user_name');
    const email = urlParams.get('user_email');
    const avatar = urlParams.get('user_avatar');

    if (authSuccess === 'true' && email) {
      if (email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
        const user = {
          name: name || 'Ahsan',
          email,
          avatar: avatar || currentUser.avatar,
        };
        handleLoginSuccess(user);
      }
      // Clean URL parameters without reloading
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      return;
    }

    // 2. Check props session
    if (sessionUser?.email && sessionUser.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
      setIsLoggedIn(true);
      setCurrentUser({
        name: sessionUser.name || 'Ahsan',
        email: sessionUser.email,
        avatar: sessionUser.image || currentUser.avatar,
      });
      localStorage.setItem('anorent_admin_logged_in', 'true');
      return;
    }

    // 3. Check persistent localStorage
    const storedLoggedIn = localStorage.getItem('anorent_admin_logged_in');
    const storedEmail = localStorage.getItem('anorent_admin_user_email');
    const storedName = localStorage.getItem('anorent_admin_user_name');
    const storedAvatar = localStorage.getItem('anorent_admin_user_avatar');

    if (storedLoggedIn === 'true' && storedEmail?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
      setIsLoggedIn(true);
      setCurrentUser({
        name: storedName || 'Ahsan',
        email: storedEmail,
        avatar: storedAvatar || currentUser.avatar,
      });
    } else {
      setIsLoggedIn(false);
    }
  }, [sessionUser]);

  const handleLoginSuccess = (user: { name: string; email: string; avatar: string }) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('anorent_admin_logged_in', 'true');
    localStorage.setItem('anorent_admin_user_name', user.name);
    localStorage.setItem('anorent_admin_user_email', user.email);
    localStorage.setItem('anorent_admin_user_avatar', user.avatar);
    setIsSignInModalOpen(false);
    sound.playSuccess();
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.setItem('anorent_admin_logged_in', 'false');
    localStorage.removeItem('anorent_session_user');
    // Clear cookie
    document.cookie = 'anorent_session_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    sound.playHoverTick();
  };

  const handleTriggerCmsReload = () => {
    setReloadCounter((prev) => prev + 1);
    setIsCmsLoading(true);
  };

  return (
    <div className="min-h-screen bg-[#06010F] text-slate-100 flex overflow-hidden font-sans selection:bg-[#8B00EE] selection:text-white relative">
      {/* 0. TECHNICAL FULL-SCREEN CMS DASHBOARD LOADING OVERLAY */}
      <DashboardLoadingScreen
        isLoading={isCmsLoading}
        onFinished={() => setIsCmsLoading(false)}
        title="CMS ADMIN PANEL"
        subtitle="ANORENT STUDIO COCKPIT v3.0"
      />

      {/* Google Workspace Sign-In Modal */}
      <GoogleSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* 1. LEFT SIDEBAR PANEL (Desktop fixed, Mobile Drawer) */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          user={currentUser}
          onOpenSignIn={() => setIsSignInModalOpen(true)}
        />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            isLoggedIn={isLoggedIn}
            user={currentUser}
            onOpenSignIn={() => setIsSignInModalOpen(true)}
          />
          <div
            className="flex-1"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* 2. CENTER WORKSPACE CANVAS */}
      <main
        className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-[#06010F] relative bg-grid-pattern bg-grid-glow transition-all"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
        }}
      >
        {/* Floating background ambient lights */}
        <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-[#8B00EE]/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        {/* Top Sticky Compact Header */}
        <Header
          activeTab={activeTab}
          onSearchChange={setSearchQuery}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleAiSidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
          isAiSidebarOpen={aiSidebarOpen}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          onTriggerCmsReload={handleTriggerCmsReload}
        />

        {/* Content Body based on Active Nav Tab */}
        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto relative z-10">
          {/* Dashboard Welcome Banner */}
          <DashboardHoloCard
            className="p-0 rounded-2xl bg-gradient-to-r from-[#130722]/95 via-[#0D041A]/95 to-[#06010F]/95 border border-purple-500/30 shadow-2xl relative overflow-hidden"
            glowColor="rgba(139, 0, 238, 0.45)"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30">
                    STUDiO COCKPiT v3.0
                  </span>
                  <StatusRadarPulse
                    status={isLoggedIn ? 'OPTIMAL' : 'MAINTENANCE'}
                    label={isLoggedIn ? 'AUTHENTICATED' : 'LOCKED ACCESS'}
                    size="sm"
                    className="bg-transparent border-none p-0 shadow-none"
                  />
                </div>
                <div className="pt-1">
                  <KineticTitle
                    text={isLoggedIn ? `WELCOME, ${currentUser.name.toUpperCase()}` : 'ANORENT COCKPiT // LOCKED'}
                    size="md"
                    className="font-black"
                    restartKey={reloadCounter}
                  />
                </div>
                <p className="text-xs text-[#a393eb]/80 max-w-xl font-mono">
                  <TextHackerScramble
                    text={
                      isLoggedIn
                        ? 'Bespoke cybernetic digital systems, real-time escrow pipelines, and synchronized PostgreSQL CMS architecture.'
                        : 'Security protocol active. Sign in with the whitelisted Google Workspace account to decrypt live data.'
                    }
                    scrambleSpeed={18}
                    resolveSpeed={1.5}
                    restartKey={reloadCounter}
                  />
                </p>
              </div>

              {/* Quick Telemetry Status Badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-[#130722] border border-white/5 flex items-center gap-2.5 shadow-md">
                  <Cpu className="w-4 h-4 text-[#8B00EE]" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Engine Status</div>
                    <div className="text-xs font-bold text-slate-100">
                      {isLoggedIn ? 'Prisma Synced' : 'Protected'}
                    </div>
                  </div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-[#130722] border border-white/5 flex items-center gap-2.5 shadow-md">
                  <StatusRadarPulse
                    status={isLoggedIn ? 'OPTIMAL' : 'MAINTENANCE'}
                    label={isLoggedIn ? '60 FPS Locked' : 'Auth Required'}
                    sublabel="Edge Nodes"
                    size="sm"
                    className="bg-transparent border-none p-0 shadow-none"
                  />
                </div>
              </div>
            </div>
          </DashboardHoloCard>

          {/* Locked State Security Shield Fallback when unauthenticated */}
          {!isLoggedIn ? (
            <div className="relative rounded-3xl bg-[#0a0316]/95 border border-purple-500/30 p-8 md:p-14 text-center shadow-[0_0_80px_rgba(139,0,238,0.2)] backdrop-blur-2xl space-y-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-black/60 pointer-events-none" />

              <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-3xl bg-[#14072b] border border-purple-500/50 shadow-[0_0_40px_rgba(139,0,238,0.5)]">
                <Lock className="w-9 h-9 text-[#8B00EE] animate-pulse" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#38bdf8] font-mono text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SINGLE-USER SECURITY LOCK</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide font-mono">
                  SECURITY SHiELD ACTiVE
                </h3>
                <p className="text-xs font-mono text-purple-200/80 leading-relaxed">
                  Database transmissions, client inquiries, deployments, and CMS editors are locked. Sign in with the registered Google Workspace account (<span className="text-cyan-300 font-bold">{AUTHORIZED_EMAIL}</span>) to unlock the workspace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
                <CyberButton
                  variant="primary"
                  size="md"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={() => {
                    sound.playChime();
                    setIsSignInModalOpen(true);
                  }}
                >
                  Sign In with Google Account
                </CyberButton>
              </div>
            </div>
          ) : (
            <ErrorBoundary fallbackTitle="Dashboard Workspace View Error">
              {activeTab === 'inquiries' && <InquiriesSection />}
              {activeTab === 'deployments' && <DeploymentsSection />}
              {activeTab === 'cms' && <CmsSection onTriggerReload={handleTriggerCmsReload} />}
              {activeTab === 'settings' && (
                <SettingsSection
                  isLoggedIn={isLoggedIn}
                  onSignOut={handleSignOut}
                  onOpenSignIn={() => setIsSignInModalOpen(true)}
                />
              )}
            </ErrorBoundary>
          )}
        </div>
      </main>

      {/* 3. TOGGLEABLE RIGHT AI ASSISTANT OVERLAY DRAWER */}
      {aiSidebarOpen && (
        <div className="fixed inset-y-0 right-0 z-50 bg-black/60 backdrop-blur-md flex justify-end animate-in slide-in-from-right duration-300 shadow-2xl">
          <RightAiAssistant onClose={() => setAiSidebarOpen(false)} />
        </div>
      )}
    </div>
  );
}
