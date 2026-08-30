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
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-8 text-center shadow-xs">
        <div className="text-4xl mb-3">{isSunday ? '🏖️' : '🎉'}</div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-[#111111] font-display">
            TODAY — {dayName.toUpperCase()}
          </h3>
          {isSunday && (
            <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
              HOLIDAY
            </span>
          )}
        </div>
        <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto leading-relaxed">
          {isSunday
            ? 'रविवार की छुट्टी है (Sunday Weekend Holiday). आज कोई क्लास नहीं है। Enjoy your weekend & rest!'
            : 'No classes scheduled for today. Enjoy your day or catch up on coursework.'}
        </p>
        <button
          type="button"
          onClick={onViewAllDays}
          className="mt-4 px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-xs font-mono-code font-bold text-[#FFFFFF] transition-colors cursor-pointer shadow-xs"
        >
          View Full Week Timetable →
        </button>
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
                      <span className="text-sm font-extrabold font-mono-code text-[#111111]">
                        {formatTime12(item.startTime)} – {formatTime12(item.endTime)}
                      </span>

                      {/* Live countdown pill */}
                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-extrabold font-mono-code shadow-xs">
                          <Hourglass className="w-3 h-3 animate-spin" />
                          <span>LIVE · {countdownObj.text}</span>
                        </span>
                      )}

                      {/* Upcoming countdown pill */}
                      {!isLive && !isPast && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#111111] border border-[#E5E5E5] text-[10px] font-bold font-mono-code">
                          <Hourglass className="w-3 h-3 text-[#666666]" />
                          <span>{countdownObj.text}</span>
                        </span>
                      )}

                      {isPast && (
                        <span className="text-[10px] text-[#888888] font-mono-code font-bold">
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
