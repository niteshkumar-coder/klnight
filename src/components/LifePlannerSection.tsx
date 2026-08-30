import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Download,
  Flame,
  LayoutGrid,
  ListTodo,
  PieChart,
  Printer,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import React, { useState } from 'react';
import { ActivityTrackerView } from './LifePlanner/ActivityTrackerView';
import { DayTypeView } from './LifePlanner/DayTypeView';
import { EvaluationReportView } from './LifePlanner/EvaluationReportView';
import { MasterCalendarView } from './LifePlanner/MasterCalendarView';
import { MinimumDayView } from './LifePlanner/MinimumDayView';
import { TechnicalRoadmapView } from './LifePlanner/TechnicalRoadmapView';
import { WeeklyAuditView } from './LifePlanner/WeeklyAuditView';

export type PlannerSubTab =
  | 'day_types'
  | '30day_calendar'
  | 'tech_roadmap'
  | 'tracker'
  | 'weekly_audit'
  | 'minimum_day'
  | 'evaluation';

interface LifePlannerSectionProps {
  currentDayName?: string;
  currentDateRaw?: string; // '2026-08-30'
}

export const LifePlannerSection: React.FC<LifePlannerSectionProps> = ({
  currentDayName = 'Sunday',
  currentDateRaw = '2026-08-30',
}) => {
  const [activeTab, setActiveTab] = useState<PlannerSubTab>('day_types');
  const [isMinimumDayActive, setIsMinimumDayActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('klu_min_day_active') === 'true';
    } catch {
      return false;
    }
  });

  const toggleMinimumDay = () => {
    setIsMinimumDayActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('klu_min_day_active', String(next));
      } catch (err) {
        console.warn('Failed to save minimum day state:', err);
      }
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & QUICK OVERVIEW */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#111111] text-[#B8FF00]">
                30-DAY MASTER TIMETABLE
              </span>
              <span className="text-xs font-mono-code text-[#666666]">
                30 Aug 2026 – 28 Sep 2026
              </span>
              {isMinimumDayActive && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                  🛡️ MINIMUM-DAY MODE ACTIVE
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display tracking-tight">
              B.Tech CSE Life, Study & Work Timetable
            </h1>

            <p className="text-xs sm:text-sm text-[#666666] max-w-2xl leading-relaxed">
              Balanced daily routine integrating{' '}
              <strong className="text-[#111111]">College (7 AM – 1 PM)</strong>,{' '}
              <strong className="text-[#111111]">Technical Mastery (Java → Python → AI)</strong>,{' '}
              <strong className="text-[#111111]">Restaurant Job (5 PM – 10 PM)</strong>, Gym &
              Swimming, Digital Marketing, YouTube/PCM, Family Time, and 7–8h protected sleep.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E5E5] text-xs font-mono-code font-bold text-[#111111] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Print Timetable"
            >
              <Printer className="w-3.5 h-3.5 text-[#666666]" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={toggleMinimumDay}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                isMinimumDayActive
                  ? 'bg-[#DC2626] text-[#FFFFFF] hover:bg-[#B91C1C]'
                  : 'bg-[#111111] text-[#FFFFFF] hover:bg-black'
              }`}
              title="Toggle emergency low-energy mode"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isMinimumDayActive ? 'Exit Min-Day' : 'Min-Day Mode'}</span>
            </button>
          </div>
        </div>

        {/* PRIORITY ORDER MINI PILLS */}
        <div className="mt-5 pt-4 border-t border-[#E5E5E5] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono-code">
          <span className="text-[#888888] font-bold text-[10px] shrink-0">PRIORITIES:</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] shrink-0">
            P1 Health & Sleep
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#DBEAFE] text-[#1E40AF] border border-[#93C5FD] shrink-0">
            P2 College & Maths
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#5B21B6] border border-[#C4B5FD] shrink-0">
            P3 Technical (Java→Python→AI)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shrink-0">
            P4 Income & Restaurant
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FFEDD5] text-[#9A3412] border border-[#FDBA74] shrink-0">
            P5 Trading & Long-Term
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FCE7F3] text-[#9D174D] border border-[#F472B6] shrink-0">
            P6 Entertainment & Buffer
          </span>
        </div>
      </div>

      {/* PLANNER SUB-NAVIGATION TABS */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            id="tab-btn-daytypes"
            onClick={() => setActiveTab('day_types')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'day_types'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Routines (Mon–Sun)</span>
          </button>

          <button
            type="button"
            id="tab-btn-calendar"
            onClick={() => setActiveTab('30day_calendar')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === '30day_calendar'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Day Master Plan</span>
          </button>

          <button
            type="button"
            id="tab-btn-tech"
            onClick={() => setActiveTab('tech_roadmap')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tech_roadmap'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Technical Roadmap (Java→Python→AI)</span>
          </button>

          <button
            type="button"
            id="tab-btn-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tracker'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>30-Day Activity Tracker</span>
          </button>

          <button
            type="button"
            id="tab-btn-weekly"
            onClick={() => setActiveTab('weekly_audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'weekly_audit'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Weekly 168h Time Audit</span>
          </button>

          <button
            type="button"
            id="tab-btn-minimum"
            onClick={() => setActiveTab('minimum_day')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'minimum_day'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Minimum-Day Backup</span>
          </button>

          <button
            type="button"
            id="tab-btn-eval"
            onClick={() => setActiveTab('evaluation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'evaluation'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#666666] hover:text-[#111111] hover:bg-[#F9FAFB]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>30-Day Evaluation</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SUB-TAB VIEW */}
      <div>
        {activeTab === 'day_types' && (
          <DayTypeView
            currentDayName={currentDayName}
            isMinimumDayActive={isMinimumDayActive}
          />
        )}

        {activeTab === '30day_calendar' && (
          <MasterCalendarView currentDateRaw={currentDateRaw} />
        )}

        {activeTab === 'tech_roadmap' && <TechnicalRoadmapView />}

        {activeTab === 'tracker' && <ActivityTrackerView />}

        {activeTab === 'weekly_audit' && <WeeklyAuditView />}

        {activeTab === 'minimum_day' && (
          <MinimumDayView
            isMinimumDayActive={isMinimumDayActive}
            onToggleMinimumDay={toggleMinimumDay}
          />
        )}

        {activeTab === 'evaluation' && <EvaluationReportView />}
      </div>
    </div>
  );
};
