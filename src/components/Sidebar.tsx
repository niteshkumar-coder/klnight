import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Home,
  Linkedin,
  Settings,
  User,
} from 'lucide-react';
import React from 'react';

export type NavTab = 'home' | 'timetable' | 'attendance' | 'courses' | 'profile' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  attendancePercent?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  attendancePercent = 86.4,
}) => {
  const navItems = [
    {
      id: 'home' as NavTab,
      label: 'HOME',
      sub: 'Overview & Schedule',
      icon: Home,
    },
    {
      id: 'timetable' as NavTab,
      label: 'TIMETABLE',
      sub: 'Day-wise & Week',
      icon: Calendar,
      badge: 'MON–SAT',
    },
    {
      id: 'attendance' as NavTab,
      label: 'ATTENDANCE',
      sub: 'Subject % & Stats',
      icon: CheckCircle2,
      badge: `${attendancePercent}%`,
      badgeColor: attendancePercent >= 85 ? 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]' : 'text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]',
    },
    {
      id: 'courses' as NavTab,
      label: 'MY COURSES',
      sub: 'Registered Subjects',
      icon: BookOpen,
    },
    {
      id: 'profile' as NavTab,
      label: 'PROFILE',
      sub: 'Student Details',
      icon: User,
    },
    {
      id: 'settings' as NavTab,
      label: 'SETTINGS',
      sub: 'Preferences',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-[#E5E5E5] bg-[#FFFFFF] p-4 lg:p-6 space-y-5">
      {/* Brand Header */}
      <div className="pb-3 border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between">
          <img
            src="https://i.ibb.co/XrWyDBV0/image.png"
            alt="Logo"
            className="h-7 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <a
            href="https://www.linkedin.com/in/nitesh-kumar-27428a397?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-[10px] font-mono-code font-bold transition-all border border-[#0A66C2]/20"
            title="LinkedIn Profile (Nitesh Kumar)"
          >
            <Linkedin className="w-3 h-3" />
            <span>LinkedIn</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
        <p className="text-[11px] text-[#666666] font-medium mt-0.5">
          Student Timetable & Attendance
        </p>
      </div>

      {/* Navigation section */}
      <div className="space-y-1">
        <div className="text-[11px] font-mono-code text-[#888888] uppercase px-3 mb-2 tracking-wider font-bold">
          MENU
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left border ${
                  isActive
                    ? 'bg-[#111111] border-[#111111] text-[#FFFFFF] shadow-2xs'
                    : 'bg-[#FFFFFF] border-transparent text-[#666666] hover:bg-[#F9FAFB] hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-[#FFFFFF] text-[#111111]' : 'bg-[#F3F4F6] text-[#666666]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold tracking-wide font-display ${
                        isActive ? 'text-[#FFFFFF]' : 'text-[#111111]'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] ${
                        isActive ? 'text-[#D1D5DB]' : 'text-[#888888]'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-md border ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#111111] border-[#FFFFFF]'
                        : item.badgeColor || 'bg-[#F3F4F6] text-[#666666] border-[#E5E5E5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Academic Term Info */}
      <div className="mt-auto pt-4 border-t border-[#E5E5E5] space-y-2">
        <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-[10px] text-[#666666] font-mono-code font-bold mb-1">
            <span>ACADEMIC STATUS</span>
            <span className="text-[#16A34A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> ACTIVE
            </span>
          </div>
          <div className="text-xs font-bold text-[#111111]">ODD SEMESTER 2026-27</div>
          <div className="text-[11px] text-[#666666] mt-0.5">Section S-1-A · FEDEX Block</div>
        </div>

        <a
          href="https://www.linkedin.com/in/nitesh-kumar-27428a397?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10 border border-[#0A66C2]/15 text-[#0A66C2] text-xs font-mono-code transition-colors"
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Linkedin className="w-3.5 h-3.5" />
            <span>Nitesh Kumar</span>
          </span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>
    </aside>
  );
};
