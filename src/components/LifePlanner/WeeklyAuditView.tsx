import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import { WEEKLY_HOURS_AUDIT, WeeklyAuditHour } from '../../data/lifePlannerData';

export const WeeklyAuditView: React.FC = () => {
  // Weekly Review checklist items
  const [completedReviews, setCompletedReviews] = useState<Record<string, boolean>>({
    w1_college: true,
    w1_maths: true,
    w1_tech: true,
    w1_job: true,
    w1_marketing: true,
    w1_youtube: true,
    w1_fitness: true,
    w1_sleep: true,
    w1_income: true,
  });

  const toggleReview = (key: string) => {
    setCompletedReviews((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const REVIEW_ITEMS = [
    { key: 'w1_sleep', label: 'Sleep & Health (7–8 hrs average/night)' },
    { key: 'w1_college', label: 'College Attendance (6 days, 07:00 AM – 01:00 PM)' },
    { key: 'w1_maths', label: 'Mathematics Problem Sets & Homework' },
    { key: 'w1_tech', label: 'Technical Milestones (Java / Python / AI Roadmaps)' },
    { key: 'w1_job', label: 'Restaurant Job Shifts (5:00 PM – 10:00 PM)' },
    { key: 'w1_marketing', label: 'Digital Marketing Client Tasks & Team Oversight' },
    { key: 'w1_youtube', label: 'YouTube / PCM USA Project (3 sessions/week)' },
    { key: 'w1_fitness', label: 'Fitness Rotation (Mon Gym, Wed Swim, Fri Gym, Sun Walk)' },
    { key: 'w1_income', label: 'Income & Budget Review (Restaurant + Marketing Earnings)' },
    { key: 'w1_trading', label: 'Trading Education Notes (Theory only, No gambling)' },
    { key: 'w1_family', label: 'Daily Family Time (20 mins evening + Sunday lunch)' },
    { key: 'w1_buffer', label: 'Sunday Recovery, Mental Disconnect & Entertainment' },
  ];

  const checkedCount = REVIEW_ITEMS.filter((item) => completedReviews[item.key]).length;
  const reviewScore = Math.round((checkedCount / REVIEW_ITEMS.length) * 100);

  const totalWeeklyHours = WEEKLY_HOURS_AUDIT.reduce((acc, curr) => acc + curr.hoursPerWeek, 0);

  return (
    <div className="space-y-6">
      {/* 168-HOUR REALISTIC WEEKLY AUDIT */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-[10px] font-mono-code font-bold uppercase text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
              MATHEMATICALLY BALANCED
            </span>
            <h3 className="text-lg font-bold text-[#111111] font-display mt-1">
              WEEKLY 168-HOUR TIME AUDIT
            </h3>
            <p className="text-xs text-[#666666]">
              Every single hour of your 7-day week (24h × 7 = 168h) is accounted for with zero
              burnout.
            </p>
          </div>

          <div className="text-right font-mono-code">
            <span className="text-2xl font-bold text-[#111111]">{totalWeeklyHours.toFixed(1)}</span>
            <span className="text-xs text-[#666666] ml-1">/ 168.0 hrs</span>
          </div>
        </div>

        {/* Audit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WEEKLY_HOURS_AUDIT.map((item: WeeklyAuditHour) => (
            <div
              key={item.category}
              className="p-3.5 rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] hover:bg-[#FFFFFF] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111]">{item.category}</span>
                <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111]">
                  {item.hoursPerWeek}h / week
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-mono-code text-[#666666]">
                <span className="font-semibold text-[#111111]">{item.priority}</span>
              </div>
              <p className="mt-1.5 text-[11px] text-[#555555] leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HONEST SUSTAINABILITY VERDICT & RULES */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center text-xl shrink-0">
            ⚖️
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111111] font-display">
              "Is this timetable realistically sustainable for a college student?"
            </h3>
            <p className="text-xs text-[#15803D] font-bold mt-0.5 font-mono-code">
              VERDICT: YES — Because it relies on ROTATION, not simultaneous overloading.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
            <h4 className="font-bold text-[#166534] font-display text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Why It Actually Works:
            </h4>
            <ul className="space-y-1.5 text-[#14532D] leading-relaxed list-disc list-inside">
              <li>
                <strong>Protected Sleep:</strong> 52.5 hours/week of solid 7–8 hour rest every
                single night.
              </li>
              <li>
                <strong>Focused Rotation:</strong> Gym (Mon, Fri) vs Swim (Wed) vs Rest (Tue, Thu).
                Never everything on one day.
              </li>
              <li>
                <strong>Rotating Income Blocks:</strong> Digital marketing on Tue/Thu, YouTube on
                Tue/Thu/Sat, E-commerce on Sun.
              </li>
              <li>
                <strong>Sunday Sanctuary:</strong> No regular college, relaxed rhythm, family time
                and movie.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
            <h4 className="font-bold text-[#92400E] font-display text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Anti-Overload Safety Valves:
            </h4>
            <ul className="space-y-1.5 text-[#78350F] leading-relaxed list-disc list-inside">
              <li>
                <strong>Rule 1:</strong> If tired, activate the <em>Minimum-Day System</em>. Never
                cut sleep.
              </li>
              <li>
                <strong>Rule 2:</strong> Delegate repetitive marketing/dev tasks to your student
                team.
              </li>
              <li>
                <strong>Rule 3:</strong> Keep Trading strictly to 20 mins educational reading.
              </li>
              <li>
                <strong>Rule 4:</strong> Protect 20 minutes daily family time after restaurant job.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SUNDAY WEEKLY 20–30 MIN REVIEW CALCULATOR */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#111111] font-display flex items-center gap-2">
              <span>SUNDAY WEEKLY REVIEW CALCULATOR</span>
              <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-[#111111] text-[#FFFFFF]">
                20–30 MIN AUDIT
              </span>
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Weekly Completion % = (Completed Planned Tasks ÷ Total Planned Tasks) × 100
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-mono-code text-[#666666]">Weekly Score</div>
              <div className="text-xl font-bold font-mono-code text-[#16A34A]">{reviewScore}%</div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {REVIEW_ITEMS.map((item) => {
            const isChecked = completedReviews[item.key] || false;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleReview(item.key)}
                className={`p-3 rounded-xl border text-left text-xs font-mono-code transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#15803D] font-bold'
                    : 'bg-[#FFFFFF] border-[#E5E5E5] text-[#666666] hover:border-[#CCCCCC]'
                }`}
              >
                <span>{item.label}</span>
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${isChecked ? 'text-[#16A34A]' : 'text-[#D1D5DB]'}`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
