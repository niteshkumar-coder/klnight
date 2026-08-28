import {
  Clock,
  Download,
  ExternalLink,
  Linkedin,
  LogOut,
  RefreshCw,
  SlidersHorizontal,
  Smartphone,
  Terminal,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StudentProfile } from '../types';

interface HeaderProps {
  student: StudentProfile;
  lastSyncTime?: string;
  isSyncing: boolean;
  onSync: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenDebug: () => void;
  onOpenProfile?: () => void;
  onOpenInstall?: () => void;
  isInstalled?: boolean;
  isMockMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  lastSyncTime,
  isSyncing,
  onSync,
  onLogout,
  onOpenSettings,
  onOpenDebug,
  onOpenProfile,
  onOpenInstall,
  isInstalled = false,
  isMockMode = true,
}) => {
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Good morning');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) {
        setGreeting('Good morning');
      } else if (hours < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }

      setCurrentTimeFormatted(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const actualUniversityId = student.universityId || student.studentId;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E5E5E5] px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand & Student Greeting */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <img
                src="https://i.ibb.co/XrWyDBV0/image.png"
                alt="Logo"
                className="h-7 sm:h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <a
                href="https://www.linkedin.com/in/nitesh-kumar-27428a397?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-[11px] font-mono-code font-bold transition-all border border-[#0A66C2]/20 hover:border-[#0A66C2]/40"
                title="Connect on LinkedIn (Nitesh Kumar)"
              >
                <Linkedin className="w-3 h-3 shrink-0" />
                <span>LinkedIn</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-75" />
              </a>
            </div>
            <div className="text-xs text-[#666666] font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>{greeting}, <strong className="text-[#111111]">{student.name}</strong> 👋</span>
              <span className="text-[#CCCCCC]">·</span>
              <span className="font-mono-code text-[#111111] font-semibold">ID: {actualUniversityId}</span>
            </div>
          </div>

          {/* Mobile Clock */}
          <div className="md:hidden flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5] text-[11px] font-mono-code text-[#111111] font-bold">
              {currentTimeFormatted}
            </div>
          </div>
        </div>

        {/* Center: REAL-TIME CURRENT TIME CLOCK (updates every second) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
            <span className="text-[#666666] font-medium">CURRENT TIME:</span>
            <span className="font-bold text-[#111111] tracking-wide">
              {currentTimeFormatted || '12:00:00 PM'}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Online/Offline status pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-bold border ${
              isOnline
                ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                : 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
            }`}
            title={isOnline ? 'Online - Connected' : 'Offline - Using cached data'}
          >
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-[#DC2626]" />
                <span>OFFLINE</span>
              </>
            )}
          </div>

          {/* Download / Install App button */}
          {onOpenInstall && (
            <button
              id="btn-header-install-app"
              type="button"
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold font-mono-code transition-all shadow-xs cursor-pointer active:scale-95"
              title="Download & Install Mobile App (Add to Home Screen)"
            >
              <Download className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span className="hidden sm:inline">{isInstalled ? 'APP INSTALLED' : 'GET APP'}</span>
              <span className="sm:hidden">APP</span>
            </button>
          )}

          {/* Sync Button */}
          <button
            id="btn-sync-timetable"
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E5E5E5] text-xs text-[#111111] font-bold font-mono-code transition-colors cursor-pointer disabled:opacity-50"
            title="Sync timetable"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#666666] ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'SYNC'}</span>
          </button>

          {/* Settings Trigger */}
          <button
            id="btn-open-settings"
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E5E5E5] text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
            title="Settings & Preferences"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Profile link */}
          <button
            type="button"
            onClick={onOpenProfile || onOpenSettings}
            className="flex items-center gap-2 pl-2 border-l border-[#E5E5E5] cursor-pointer hover:opacity-80 text-left transition-opacity"
            title="View Student Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#111111] text-[#FFFFFF] flex items-center justify-center text-xs font-bold shrink-0">
              {student.avatar || (actualUniversityId ? actualUniversityId.charAt(0).toUpperCase() : 'S')}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <div className="text-xs font-bold text-[#111111] font-mono-code">{actualUniversityId}</div>
              <div className="text-[10px] text-[#666666] font-mono-code">{student.section}</div>
            </div>
          </button>

          {/* Log Out */}
          <button
            id="btn-logout"
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-xs font-bold text-[#DC2626] transition-colors cursor-pointer font-mono-code ml-1"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOG OUT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
