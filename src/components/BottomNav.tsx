import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Home,
  Settings,
  User,
} from 'lucide-react';
import React from 'react';
import { NavTab } from './Sidebar';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  attendancePercent?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'timetable' as NavTab, label: 'Schedule', icon: Calendar },
    { id: 'attendance' as NavTab, label: 'Attendance', icon: CheckCircle2 },
    { id: 'courses' as NavTab, label: 'Courses', icon: BookOpen },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E5E5E5] px-2 py-1.5 flex items-center justify-around shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`mobile-nav-${tab.id}`}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#F3F4F6]' : 'bg-transparent'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
