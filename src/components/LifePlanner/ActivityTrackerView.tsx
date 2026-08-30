import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  PieChart,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MASTER_30_DAY_PLAN } from '../../data/lifePlannerData';

type StatusType = 'COMPLETED' | 'PARTIAL' | 'NOT_COMPLETED' | 'OFF';

const STATUS_ICONS: Record<
  StatusType,
  { label: string; symbol: string; bg: string; text: string; border: string }
> = {
  COMPLETED: {
    label: 'Completed',
    symbol: '✅',
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    border: 'border-[#86EFAC]',
  },
  PARTIAL: {
    label: 'Partial',
    symbol: '🟡',
    bg: 'bg-[#FEF9C3]',
    text: 'text-[#854D0E]',
    border: 'border-[#FDE047]',
  },
  NOT_COMPLETED: {
    label: 'Not Completed',
    symbol: '❌',
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#991B1B]',
    border: 'border-[#FCA5A5]',
  },
  OFF: {
    label: 'Scheduled Off',
    symbol: '—',
    bg: 'bg-[#F3F4F6]',
    text: 'text-[#9CA3AF]',
    border: 'border-[#E5E5E5]',
  },
};

const TRACKER_COLUMNS = [
  { key: 'java', label: 'Java', phaseRange: [1, 10] },
  { key: 'python', label: 'Python', phaseRange: [11, 20] },
  { key: 'ai', label: 'AI Auto', phaseRange: [21, 30] },
  { key: 'maths', label: 'Maths', phaseRange: [1, 30] },
  { key: 'college', label: 'College', phaseRange: [1, 30] },
  { key: 'restaurant', label: 'Restaurant', phaseRange: [1, 30] },
  { key: 'marketing', label: 'Marketing', phaseRange: [1, 30] },
  { key: 'youtube', label: 'YouTube', phaseRange: [1, 30] },
  { key: 'fitness', label: 'Fitness', phaseRange: [1, 30] },
  { key: 'trading', label: 'Trading', phaseRange: [1, 30] },
];

export const ActivityTrackerView: React.FC = () => {
  // Tracker State matrix: Record<dayNum, Record<colKey, StatusType>>
  const [matrix, setMatrix] = useState<Record<number, Record<string, StatusType>>>(() => {
    try {
      const saved = localStorage.getItem('klu_30day_activity_tracker');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Default initialization
    const initial: Record<number, Record<string, StatusType>> = {};
    MASTER_30_DAY_PLAN.forEach((d) => {
      const isSunday = d.dayOfWeek === 'Sunday';
      initial[d.dayNum] = {
        java: d.dayNum <= 10 ? (d.dayNum === 1 ? 'COMPLETED' : 'NOT_COMPLETED') : 'OFF',
        python: d.dayNum >= 11 && d.dayNum <= 20 ? 'NOT_COMPLETED' : 'OFF',
        ai: d.dayNum >= 21 ? 'NOT_COMPLETED' : 'OFF',
        maths: 'COMPLETED',
        college: isSunday ? 'OFF' : 'COMPLETED',
        restaurant: isSunday ? 'OFF' : 'COMPLETED',
        marketing: isSunday || d.dayOfWeek === 'Tuesday' || d.dayOfWeek === 'Thursday' ? 'COMPLETED' : 'OFF',
        youtube: d.dayOfWeek === 'Tuesday' || d.dayOfWeek === 'Thursday' || d.dayOfWeek === 'Saturday' ? 'COMPLETED' : 'OFF',
        fitness: d.dayOfWeek === 'Tuesday' || d.dayOfWeek === 'Thursday' ? 'OFF' : 'COMPLETED',
        trading: isSunday || d.dayOfWeek === 'Tuesday' || d.dayOfWeek === 'Thursday' ? 'COMPLETED' : 'OFF',
      };
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem('klu_30day_activity_tracker', JSON.stringify(matrix));
    } catch (err) {
      console.warn('Could not persist tracker matrix:', err);
    }
  }, [matrix]);

  const cycleStatus = (dayNum: number, colKey: string) => {
    const current = matrix[dayNum]?.[colKey] || 'NOT_COMPLETED';
    let next: StatusType = 'COMPLETED';

    if (current === 'COMPLETED') next = 'PARTIAL';
    else if (current === 'PARTIAL') next = 'NOT_COMPLETED';
    else if (current === 'NOT_COMPLETED') next = 'OFF';
    else if (current === 'OFF') next = 'COMPLETED';

    setMatrix((prev) => ({
      ...prev,
      [dayNum]: {
        ...(prev[dayNum] || {}),
        [colKey]: next,
      },
    }));
  };

  // Overall statistics calculation
  let totalTasks = 0;
  let completedTasks = 0;
  let partialTasks = 0;

  Object.values(matrix).forEach((dayObj) => {
    Object.values(dayObj).forEach((status) => {
      if (status !== 'OFF') {
        totalTasks++;
        if (status === 'COMPLETED') completedTasks++;
        if (status === 'PARTIAL') partialTasks++;
      }
    });
  });

  const completionPercent = totalTasks > 0 ? Math.round(((completedTasks + partialTasks * 0.5) / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* SUMMARY STATS BANNER */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#B8FF00] flex items-center justify-center font-bold text-xl font-display">
            {completionPercent}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111111] font-display uppercase tracking-wide">
              30-DAY HABIT & COMMITMENT SCORE
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              {completedTasks} completed · {partialTasks} partial · {totalTasks} total planned
              actions
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono-code">
          <span className="flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] px-2.5 py-1 rounded-lg border border-[#86EFAC]">
            ✅ Completed
          </span>
          <span className="flex items-center gap-1 bg-[#FEF9C3] text-[#854D0E] px-2.5 py-1 rounded-lg border border-[#FDE047]">
            🟡 Partial
          </span>
          <span className="flex items-center gap-1 bg-[#FEE2E2] text-[#991B1B] px-2.5 py-1 rounded-lg border border-[#FCA5A5]">
            ❌ Not Done
          </span>
          <span className="flex items-center gap-1 bg-[#F3F4F6] text-[#666666] px-2 py-1 rounded-lg border border-[#E5E5E5]">
            — Scheduled Off
          </span>
        </div>
      </div>

      {/* 30-DAY INTERACTIVE MATRIX */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#111111]" />
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#111111]">
              DAILY ACTIVITY TRACKING MATRIX (CLICK ANY CELL TO TOGGLE)
            </h4>
          </div>
          <span className="text-[11px] font-mono-code text-[#666666]">
            30 August 2026 – 28 September 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-center text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] font-mono-code font-bold uppercase text-[11px]">
                <th className="py-2.5 px-2 w-14 text-center">Day</th>
                <th className="py-2.5 px-3 w-28 text-left">Date</th>
                {TRACKER_COLUMNS.map((col) => (
                  <th key={col.key} className="py-2.5 px-2">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {MASTER_30_DAY_PLAN.map((item) => {
                const dayStatuses = matrix[item.dayNum] || {};
                const isSunday = item.dayOfWeek === 'Sunday';

                return (
                  <tr
                    key={item.dayNum}
                    className={`hover:bg-[#F9FAFB] transition-colors ${
                      isSunday ? 'bg-[#FFFBEB]/30' : ''
                    }`}
                  >
                    {/* Day Number */}
                    <td className="py-2 px-2 font-mono-code font-bold text-xs text-[#111111]">
                      D{item.dayNum}
                    </td>

                    {/* Date */}
                    <td className="py-2 px-3 text-left font-mono-code text-[11px]">
                      <span className="font-bold text-[#111111]">{item.date}</span>
                      <span className="text-[#888888] ml-1.5">{item.dayOfWeek.substring(0, 3)}</span>
                    </td>

                    {/* Activity Cells */}
                    {TRACKER_COLUMNS.map((col) => {
                      const status = dayStatuses[col.key] || 'OFF';
                      const config = STATUS_ICONS[status];

                      return (
                        <td key={col.key} className="py-1.5 px-1.5">
                          <button
                            type="button"
                            onClick={() => cycleStatus(item.dayNum, col.key)}
                            className={`w-full py-1 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer border ${config.bg} ${config.text} ${config.border} hover:opacity-80 active:scale-95`}
                            title={`${item.date} - ${col.label}: ${config.label} (Click to toggle)`}
                          >
                            {config.symbol}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
