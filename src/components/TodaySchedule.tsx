import { Clock, Coffee, MapPin, Sparkles, User, Zap } from 'lucide-react';
import React from 'react';
import { BREAK_TIMES } from '../lib/erp/mockData';
import { getClassTypeLabel } from '../lib/erp/normalizers';
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
  if (classes.length === 0) {
    return (
      <div className="bg-[#111113] border border-[#2D2D2D] rounded-2xl p-8 text-center shadow-lg">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-bold text-[#F5F5F5] font-display">
          TODAY — {dayName.toUpperCase()}
        </h3>
        <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
          No classes scheduled for today. Enjoy your day or catch up on coursework.
        </p>
        <button
          type="button"
          onClick={onViewAllDays}
          className="mt-4 px-4 py-2 rounded-xl bg-[#18181C] hover:bg-[#202025] border border-[#2D2D2D] text-xs font-mono-code text-[#B8FF00] transition-colors cursor-pointer"
        >
          View Full Week Timetable →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111113] border border-[#2D2D2D] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222225] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8FF00] inline-block animate-pulse" />
          <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display uppercase tracking-wider">
            TODAY — {dayName}
          </h2>
        </div>

        <span className="text-xs font-mono-code text-[#888888]">
          {classes.length} Classes Scheduled
        </span>
      </div>

      {/* Classes list */}
      <div className="space-y-3">
        {classes.map((item, idx) => {
          const isLive = currentTime >= item.startTime && currentTime < item.endTime;
          const isPast = currentTime >= item.endTime;
          const prevItem = classes[idx - 1];
          let breakNotice = null;

          if (prevItem) {
            const breakObj = BREAK_TIMES.find((b) => b.afterSlot === prevItem.slot);
            if (breakObj) {
              breakNotice = (
                <div
                  key={`today-break-${item.id}`}
                  className="flex items-center justify-center gap-2 py-1 px-3 my-1 rounded-lg bg-[#161619] border border-dashed border-[#242426] text-[10px] font-mono-code text-[#888888]"
                >
                  <Coffee className="w-3 h-3 text-[#B8FF00]" />
                  <span>{breakObj.duration} Break ({breakObj.startTime} – {breakObj.endTime})</span>
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
                    ? 'bg-gradient-to-r from-[#141A10] to-[#111113] border-[#B8FF00] shadow-md shadow-[#B8FF00]/10'
                    : isPast
                    ? 'bg-[#141416]/60 border-[#202024] opacity-75'
                    : 'bg-[#161619] border-[#26262B] hover:border-[#35353A]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold font-mono-code text-[#B8FF00]">
                        {item.startTime} – {item.endTime}
                      </span>
                      {isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#B8FF00] text-black text-[9px] font-extrabold font-mono-code">
                          LIVE NOW
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[10px] text-[#666666] font-mono-code">Completed</span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-[#F5F5F5] font-display">
                      {item.courseName}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono-code text-[#AAAAAA]">
                      <span className="bg-[#1D1D22] px-1.5 py-0.5 rounded text-[11px] text-[#CCCCCC]">
                        {item.courseCode}
                      </span>
                      <span>·</span>
                      <span>[{item.classType}] {getClassTypeLabel(item.classType)}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222225]">
                    <button
                      type="button"
                      onClick={() => onOpenRoom(item.room)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D1D22] hover:bg-[#25252C] border border-[#2D2D2D] text-xs font-mono-code font-bold text-[#F5F5F5] hover:text-[#B8FF00] transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-[#B8FF00]" />
                      <span>ROOM {item.room}</span>
                    </button>

                    <div className="text-[10px] text-[#777777] flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.faculty}</span>
                    </div>
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
