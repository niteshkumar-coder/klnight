import {
  AlertCircle,
  Clock,
  Coffee,
  Hourglass,
  MapPin,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BREAK_TIMES } from '../lib/erp/mockData';
import { formatTime12, getClassTypeLabel } from '../lib/erp/normalizers';
import { DayOfWeek, TimetableEntry } from '../types';

interface TodayScheduleProps {
  dayName: DayOfWeek;
  classes: TimetableEntry[];
  currentTime: string;
  onOpenRoom: (roomCode: string) => void;
  onViewAllDays: () => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({
  dayName,
  classes,
  currentTime,
  onOpenRoom,
  onViewAllDays,
}) => {
  // Live seconds tick for reverse countdown
  const [liveSecTick, setLiveSecTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSecTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isSunday = dayName.toLowerCase() === 'sunday';

  if (classes.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-3xl p-6 sm:p-8 text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FEF3C7] border-2 border-[#FDE68A] flex items-center justify-center text-3xl mx-auto shadow-2xs">
          {isSunday ? '🏖️' : '🎉'}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-display uppercase tracking-wider">
              TODAY IS {dayName.toUpperCase()}
            </h3>
            {isSunday && (
              <span className="text-xs font-mono-code font-black px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shadow-2xs">
                WEEKEND HOLIDAY (साप्ताहिक अवकाश)
              </span>
            )}
          </div>
          <p className="text-sm text-[#555555] max-w-xl mx-auto leading-relaxed font-sans">
            {isSunday
              ? 'आज रविवार है और कॉलेज बंद है (No academic classes scheduled today). Enjoy your well-deserved recovery, review your weekly progress, and prepare for the week ahead.'
              : 'No academic classes scheduled for today. Enjoy your free day or work on project milestones.'}
          </p>
        </div>

        {/* SUNDAY HIGHLIGHT BOX */}
        {isSunday && (
          <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto text-left text-xs font-mono-code space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2 font-bold text-[#111111]">
              <span className="text-[11px] uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                <span>🏖️</span> TODAY'S SUNDAY LIFE & RECOVERY SCHEDULE
              </span>
              <span className="text-[11px] bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded">
                NO COLLEGE & NO RESTAURANT JOB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#333333]">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5]">
                <div className="font-extrabold text-[#111111] text-xs">⏰ Morning Routine</div>
                <div className="text-[11px] text-[#666666] mt-0.5">
                  07:30 AM Wake-up · 09:30 AM E-Commerce & Python Automation
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5]">
                <div className="font-extrabold text-[#111111] text-xs">🍽️ Afternoon Family & Review</div>
                <div className="text-[11px] text-[#666666] mt-0.5">
                  01:00 PM Family Lunch · 03:00 PM 20-min Weekly Life Audit
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5]">
                <div className="font-extrabold text-[#111111] text-xs">🎬 Evening Leisure & Walk</div>
                <div className="text-[11px] text-[#666666] mt-0.5">
                  05:30 PM Outdoor Walk · 07:00 PM Movie / Entertainment Break
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5]">
                <div className="font-extrabold text-[#111111] text-xs">😴 Night Sleep Target</div>
                <div className="text-[11px] text-[#15803D] font-bold mt-0.5">
                  10:30 PM Early Sleep (8h Solid Rest for Monday 6 AM)
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onViewAllDays}
            className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-xs font-mono-code font-bold text-[#FFFFFF] transition-all cursor-pointer shadow-xs"
          >
            View Full Timetable (Mon – Sat) →
          </button>
        </div>
      </div>
    );
  }

  // Calculate reverse countdown string for a given class item
  const getItemCountdown = (item: TimetableEntry) => {
    const now = new Date();
    const [startH, startM] = item.startTime.split(':').map(Number);
    const [endH, endM] = item.endTime.split(':').map(Number);

    const isLive = currentTime >= item.startTime && currentTime < item.endTime;
    const isPast = currentTime >= item.endTime;

    if (isPast) {
      return { type: 'past', text: 'Completed' };
    }

    if (isLive) {
      const endTarget = new Date();
      endTarget.setHours(endH, endM, 0, 0);
      const diffMs = Math.max(0, endTarget.getTime() - now.getTime());
      const totalSec = Math.floor(diffMs / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return {
        type: 'live',
        text: `Ends in ${m}m ${s}s`,
        seconds: totalSec,
      };
    }

    // Upcoming
    const startTarget = new Date();
    startTarget.setHours(startH, startM, 0, 0);
    const diffMs = Math.max(0, startTarget.getTime() - now.getTime());
    const totalSec = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    if (h > 0) {
      return {
        type: 'upcoming',
        text: `Starts in ${h}h ${m}m`,
        seconds: totalSec,
      };
    }
    return {
      type: 'upcoming',
      text: `Starts in ${m}m ${s}s`,
      seconds: totalSec,
    };
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block animate-pulse" />
          <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display uppercase tracking-wider">
            TODAY — {dayName}
          </h2>
        </div>

        <span className="text-xs font-mono-code font-bold text-[#666666]">
          {classes.length} Classes Scheduled
        </span>
      </div>

      {/* Classes list */}
      <div className="space-y-3">
        {classes.map((item, idx) => {
          const isLive = currentTime >= item.startTime && currentTime < item.endTime;
          const isPast = currentTime >= item.endTime;
          const prevItem = classes[idx - 1];
          const countdownObj = getItemCountdown(item);
          let breakNotice = null;

          if (prevItem) {
            const breakObj = BREAK_TIMES.find((b) => b.afterSlot === prevItem.slot);
            if (breakObj) {
              breakNotice = (
                <div
                  key={`today-break-${item.id}`}
                  className="flex items-center justify-center gap-2 py-1.5 px-3 my-1 rounded-xl bg-[#F9FAFB] border border-dashed border-[#E5E5E5] text-[11px] font-mono-code text-[#666666]"
                >
                  <Coffee className="w-3.5 h-3.5 text-[#111111]" />
                  <span>
                    {breakObj.duration} Break ({breakObj.startTime} – {breakObj.endTime})
                  </span>
                </div>
              );
            }
          }

          return (
            <React.Fragment key={item.id}>
              {breakNotice}

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLive
                    ? 'bg-[#F0FDF4] border-2 border-[#16A34A] shadow-sm'
                    : isPast
                    ? 'bg-[#F9FAFB]/70 border-[#E5E5E5] opacity-75'
                    : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#CCCCCC] shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-black font-mono-code text-[#111111] bg-[#F3F4F6] px-3 py-1 rounded-xl border border-[#D1D5DB] shadow-2xs">
                        {formatTime12(item.startTime)} – {formatTime12(item.endTime)}
                      </span>

                      {/* Live countdown pill */}
                      {isLive && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A] text-white text-xs font-black font-mono-code shadow-xs animate-pulse">
                          <Hourglass className="w-3.5 h-3.5 animate-spin" />
                          <span>LIVE · {countdownObj.text}</span>
                        </span>
                      )}

                      {/* Upcoming countdown pill */}
                      {!isLive && !isPast && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F4F6] text-[#111111] border border-[#E5E5E5] text-xs font-black font-mono-code">
                          <Hourglass className="w-3.5 h-3.5 text-[#111111]" />
                          <span>{countdownObj.text}</span>
                        </span>
                      )}

                      {isPast && (
                        <span className="text-xs text-[#888888] font-mono-code font-bold bg-[#F3F4F6] px-2 py-0.5 rounded">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <div className="text-sm sm:text-base font-bold text-[#111111] font-display">
                      {item.courseName}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono-code text-[#666666]">
                      <span className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[11px] font-bold text-[#111111] border border-[#E5E5E5]">
                        {item.courseCode}
                      </span>
                      <span>·</span>
                      <span>{getClassTypeLabel(item.classType)}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]">
                    <button
                      type="button"
                      onClick={() => onOpenRoom(item.room)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-xs font-mono-code font-bold text-[#FFFFFF] hover:text-[#B8FF00] transition-colors cursor-pointer shadow-xs"
                    >
                      <MapPin className="w-3 h-3 text-[#B8FF00]" />
                      <span>ROOM {item.room}</span>
                    </button>

                    {item.faculty && (
                      <div className="text-[11px] text-[#666666] flex items-center gap-1 font-sans">
                        <User className="w-3 h-3 text-[#9CA3AF]" />
                        <span>{item.faculty}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
