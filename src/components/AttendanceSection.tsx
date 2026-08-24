import {
  AlertTriangle,
  Award,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import React from 'react';
import { AttendanceRecord, OverallAttendance } from '../types';

interface AttendanceSectionProps {
  overall: OverallAttendance;
  subjects: AttendanceRecord[];
  onSelectSubject: (subject: AttendanceRecord) => void;
  onRefresh: () => void;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  overall,
  subjects,
  onSelectSubject,
  onRefresh,
}) => {
  const getStatusBadge = (status: 'good' | 'warning' | 'low') => {
    switch (status) {
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
            <CheckCircle2 className="w-3 h-3" />
            GOOD (&gt;=85%)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <AlertTriangle className="w-3 h-3" />
            WARNING (75-84%)
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
            <ShieldAlert className="w-3 h-3" />
            CRITICAL (&lt;75%)
          </span>
        );
    }
  };

  const calculateMargin = (attended: number, total: number) => {
    if (total === 0) return { type: 'safe', count: 0 };
    const currentPercent = (attended / total) * 100;
    if (currentPercent >= 75) {
      const canMiss = Math.floor(attended / 0.75 - total);
      return { type: 'safe', count: Math.max(0, canMiss) };
    } else {
      const needAttend = Math.ceil((0.75 * total - attended) / 0.25);
      return { type: 'need', count: Math.max(1, needAttend) };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overall Attendance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Overall Percentage Card */}
        <div className="lg:col-span-1 bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-mono-code text-[#666666] uppercase tracking-wider">
              OVERALL ATTENDANCE
            </span>
            {getStatusBadge(overall.status)}
          </div>

          <div className="my-6 flex items-center justify-center">
            {/* Circular Graphic Presentation */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#F3F4F6]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={
                    overall.status === 'good'
                      ? 'stroke-[#16A34A]'
                      : overall.status === 'warning'
                      ? 'stroke-[#D97706]'
                      : 'stroke-[#DC2626]'
                  }
                  strokeWidth="8"
                  strokeDasharray={`${(overall.percentage * 251.2) / 100} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-mono-code text-[#111111] tracking-tight">
                  {overall.percentage}%
                </span>
                <span className="text-[10px] text-[#666666] font-mono-code uppercase font-semibold">
                  {overall.attended}/{overall.totalClasses} Conducted
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-mono-code text-[#666666]">
            <span>Minimum Exam Requirement:</span>
            <span className="font-bold text-[#111111]">75.0%</span>
          </div>
        </div>

        {/* Attendance Breakdown & Policy Insights */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono-code text-[#111111] uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-[#111111]" />
              EXAM ELIGIBILITY & BUFFER INSIGHTS
            </div>
            <h3 className="text-lg font-bold text-[#111111] font-display">
              {overall.percentage >= 75
                ? 'Eligible for End-Semester Examinations'
                : 'Action Required: Attendance Below Threshold'}
            </h3>
            <p className="text-xs text-[#666666] mt-1 leading-relaxed">
              University regulations require a minimum of 75% attendance in all theory lectures and laboratory sessions to sit for semester examinations without condonation penalties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <div className="text-[10px] font-mono-code font-bold uppercase text-[#666666]">
                Attended Classes
              </div>
              <div className="text-xl font-bold font-mono-code text-[#111111] mt-1">
                {overall.attended}
              </div>
              <div className="text-[10px] text-[#666666] mt-0.5">Verified sessions</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <div className="text-[10px] font-mono-code font-bold uppercase text-[#666666]">
                Total Classes
              </div>
              <div className="text-xl font-bold font-mono-code text-[#111111] mt-1">
                {overall.totalClasses}
              </div>
              <div className="text-[10px] text-[#666666] mt-0.5">Recorded by ERP</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <div className="text-[10px] font-mono-code font-bold uppercase text-[#666666]">
                Absent Classes
              </div>
              <div className="text-xl font-bold font-mono-code text-[#DC2626] mt-1">
                {overall.absent}
              </div>
              <div className="text-[10px] text-[#666666] mt-0.5">Missed slots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5E5]">
          <div>
            <h3 className="text-base font-bold text-[#111111] font-display uppercase tracking-wide flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#111111]" />
              SUBJECT-WISE ATTENDANCE BREAKDOWN
            </h3>
            <p className="text-xs text-[#666666]">
              Detailed record for every registered theory, lab, and practical course.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-mono-code font-bold text-[#111111] hover:underline self-start sm:self-auto cursor-pointer"
          >
            REFRESH FROM ERP ↻
          </button>
        </div>

        {/* List of Subjects */}
        <div className="space-y-3 pt-2">
          {subjects.map((sub) => {
            const margin = calculateMargin(sub.attended, sub.total);

            return (
              <div
                key={sub.code}
                onClick={() => onSelectSubject(sub)}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#D1D5DB] transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: Code, Name & Faculty */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code font-bold text-[#111111] px-2 py-0.5 rounded bg-[#F3F4F6] border border-[#E5E5E5]">
                        {sub.code}
                      </span>
                      <span className="text-xs text-[#666666] font-mono-code">
                        {sub.type}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#111111]">
                      {sub.name}
                    </h4>

                    <div className="text-xs text-[#666666]">
                      Faculty: <span className="text-[#111111]">{sub.faculty}</span>
                    </div>
                  </div>

                  {/* Middle: Progress bar & Ratio */}
                  <div className="flex-1 max-w-xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-[#666666]">
                        {sub.attended}/{sub.total} classes
                      </span>
                      <span className="font-bold text-[#111111]">
                        {sub.percentage}%
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          sub.percentage >= 85
                            ? 'bg-[#16A34A]'
                            : sub.percentage >= 75
                            ? 'bg-[#D97706]'
                            : 'bg-[#DC2626]'
                        }`}
                        style={{ width: `${Math.min(100, sub.percentage)}%` }}
                      />
                    </div>

                    {/* Buffer Pill */}
                    <div className="text-[11px] font-mono-code">
                      {margin.type === 'safe' ? (
                        <span className="text-[#16A34A]">
                          ✓ Can miss up to {margin.count} class{margin.count === 1 ? '' : 'es'}
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-semibold">
                          ⚠ Must attend next {margin.count} class{margin.count === 1 ? '' : 'es'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Arrow */}
                  <div className="flex items-center justify-end">
                    <ChevronRight className="w-4 h-4 text-[#888888]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
