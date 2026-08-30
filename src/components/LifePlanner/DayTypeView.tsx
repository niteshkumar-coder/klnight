import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  GraduationCap,
  Heart,
  Laptop,
  Moon,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { DAY_TYPE_SCHEDULES, DayScheduleBlock } from '../../data/lifePlannerData';

interface DayTypeViewProps {
  currentDayName?: string;
  isMinimumDayActive?: boolean;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  health: {
    label: 'Health & Sleep (P1)',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#047857]',
    border: 'border-[#A7F3D0]',
    icon: Heart,
  },
  college: {
    label: 'College & Maths (P2)',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    icon: GraduationCap,
  },
  technical: {
    label: 'Tech Learning (P3)',
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#6D28D9]',
    border: 'border-[#DDD6FE]',
    icon: Laptop,
  },
  work: {
    label: 'Job & Business (P4)',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    icon: Briefcase,
  },
  learning: {
    label: 'Long-Term (P5)',
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#C2410C]',
    border: 'border-[#FFEDD5]',
    icon: Sparkles,
  },
  rest: {
    label: 'Family & Rest (P1/P6)',
    bg: 'bg-[#FDF2F8]',
    text: 'text-[#BE185D]',
    border: 'border-[#FBCFE8]',
    icon: Users,
  },
};

const PRIORITY_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  P1: { label: 'P1 · Top Priority', bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
  P2: { label: 'P2 · College', bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
  P3: { label: 'P3 · Tech Skills', bg: 'bg-[#EDE9FE]', text: 'text-[#5B21B6]' },
  P4: { label: 'P4 · Income/Job', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  P5: { label: 'P5 · Long-Term', bg: 'bg-[#FFEDD5]', text: 'text-[#9A3412]' },
  P6: { label: 'P6 · Leisure', bg: 'bg-[#FCE7F3]', text: 'text-[#9D174D]' },
};

const DAYS_LIST = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DayTypeView: React.FC<DayTypeViewProps> = ({
  currentDayName = 'Sunday',
  isMinimumDayActive = false,
}) => {
  const [activeDay, setActiveDay] = useState<string>(currentDayName || 'Monday');

  const currentSchedule = DAY_TYPE_SCHEDULES[activeDay] || DAY_TYPE_SCHEDULES['Monday'];

  return (
    <div className="space-y-6">
      {/* DAY TYPE SELECTOR TABS */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#111111]" />
            <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#111111]">
              SELECT DAY-TYPE ROUTINE
            </h3>
          </div>
          <span className="text-[11px] text-[#666666] font-mono-code">
            Realistic exact-hour schedules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAYS_LIST.map((day) => {
            const isSelected = activeDay === day;
            const isRealToday = day.toLowerCase() === currentDayName.toLowerCase();
            const isSun = day === 'Sunday';

            return (
              <button
                key={day}
                id={`btn-life-day-${day.toLowerCase()}`}
                type="button"
                onClick={() => setActiveDay(day)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-mono-code transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#111111] text-[#FFFFFF] font-bold border-[#111111] shadow-xs'
                    : isSun
                    ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] hover:bg-[#FEF3C7]'
                    : 'bg-[#FFFFFF] text-[#666666] border-[#E5E5E5] hover:border-[#CCCCCC] hover:text-[#111111] hover:bg-[#F9FAFB]'
                }`}
              >
                {isRealToday ? (
                  <span
                    className={`text-[8.5px] font-bold uppercase px-1.5 py-0.2 rounded mb-0.5 tracking-wider ${
                      isSelected ? 'bg-[#FFFFFF] text-[#111111]' : 'bg-[#111111] text-[#FFFFFF]'
                    }`}
                  >
                    TODAY
                  </span>
                ) : isSun ? (
                  <span className="text-[8.5px] font-bold uppercase px-1 py-0.2 rounded mb-0.5 tracking-wider bg-[#FEF3C7] text-[#B45309]">
                    RELAXED
                  </span>
                ) : (
                  <span className="text-[8.5px] text-[#9CA3AF] mb-0.5">ROUTINE</span>
                )}
                <span className="font-bold text-xs uppercase tracking-wide">{day.substring(0, 3)}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#D1D5DB]' : 'text-[#888888]'}`}>
                  {day === 'Monday' && 'Gym + Job'}
                  {day === 'Tuesday' && 'Marketing + Job'}
                  {day === 'Wednesday' && 'Swim + Job'}
                  {day === 'Thursday' && 'Ads/Ecom + Job'}
                  {day === 'Friday' && 'Gym + Job'}
                  {day === 'Saturday' && 'YouTube + Job'}
                  {day === 'Sunday' && 'Review & Rest'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY HEADER CARD */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-[#111111] font-display uppercase tracking-wide">
                {currentSchedule.dayType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#F3F4F6] text-[#111111] border border-[#E5E5E5]">
                {currentSchedule.title}
              </span>
              {activeDay === 'Sunday' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  🏖️ COLLEGE HOLIDAY
                </span>
              )}
            </div>
            <p className="text-xs text-[#666666] mt-1">{currentSchedule.focusSummary}</p>
          </div>

          {/* Core Fixed Times Summary */}
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#444444] bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E5E5]">
            <Clock className="w-4 h-4 text-[#111111]" />
            <div>
              <span className="font-bold text-[#111111]">College:</span>{' '}
              {activeDay === 'Sunday' ? 'Off' : '07:00 AM – 01:00 PM'} ·{' '}
              <span className="font-bold text-[#111111]">Job:</span>{' '}
              {activeDay === 'Sunday' ? 'Off' : '05:00 PM – 10:00 PM'}
            </div>
          </div>
        </div>

        {/* MINIMUM DAY BANNER IF ACTIVE */}
        {isMinimumDayActive && (
          <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Minimum-Day Mode is Active</div>
              <p className="mt-0.5 text-[11px] text-[#78350F]">
                Optional items marked with <span className="font-bold">[CAN SKIP]</span> are safely
                postponed to protect your sleep (7–8 hrs), college, food, and recovery.
              </p>
            </div>
          </div>
        )}

        {/* TIMELINE BLOCKS */}
        <div className="space-y-3 pt-2">
          {currentSchedule.blocks.map((block: DayScheduleBlock, idx: number) => {
            const catConfig = CATEGORY_CONFIG[block.category] || CATEGORY_CONFIG.health;
            const priorityBadge = PRIORITY_BADGES[block.priority] || PRIORITY_BADGES.P1;
            const Icon = catConfig.icon;
            const isSkippedOnMinDay = isMinimumDayActive && block.isOptionalOnMinimumDay;

            return (
              <div
                key={`${block.time}-${idx}`}
                className={`relative rounded-xl border p-4 transition-all ${
                  isSkippedOnMinDay
                    ? 'bg-[#F9FAFB] border-[#E5E5E5] opacity-60'
                    : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#D1D5DB] hover:shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  {/* Left: Time & Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 font-mono-code font-black text-xs sm:text-sm text-[#111111] bg-[#F3F4F6] px-3 py-1.5 rounded-xl border border-[#D1D5DB] shadow-2xs">
                      <Clock className="w-4 h-4 text-[#111111]" />
                      <span className="tracking-wide">{block.time}</span>
                    </div>

                    <span className="text-xs font-mono-code font-bold text-[#444444] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E5E5E5] shadow-2xs">
                      {block.duration}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[11px] font-mono-code font-extrabold px-2.5 py-1 rounded-full ${priorityBadge.bg} ${priorityBadge.text} shadow-2xs`}
                    >
                      {priorityBadge.label}
                    </span>

                    {/* Category Tag */}
                    <span
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full border flex items-center gap-1 ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span>{catConfig.label}</span>
                    </span>

                    {block.isOptionalOnMinimumDay && (
                      <span className="text-[9.5px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
                        OPTIONAL ON TIRED DAYS
                      </span>
                    )}
                  </div>

                  {/* Right Status */}
                  {isSkippedOnMinDay && (
                    <span className="text-[11px] font-mono-code font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                      SKIPPED (RECOVERY PROTECTED)
                    </span>
                  )}
                </div>

                {/* Title & Details */}
                <div className="mt-2.5">
                  <h4 className="text-sm font-bold text-[#111111] font-display flex items-center gap-2">
                    <span>{block.title}</span>
                  </h4>
                  <p className="text-xs text-[#555555] mt-1 leading-relaxed">{block.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
