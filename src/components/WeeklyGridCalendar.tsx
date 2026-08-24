import { MapPin } from 'lucide-react';
import React from 'react';
import { FIXED_SLOTS } from '../lib/erp/mockData';
import { formatTime12 } from '../lib/erp/normalizers';
import { DayOfWeek, TimetableEntry } from '../types';

interface WeeklyGridCalendarProps {
  timetable: TimetableEntry[];
  onOpenRoom: (roomCode: string) => void;
  currentDayName?: string;
  currentTime?: string;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WeeklyGridCalendar: React.FC<WeeklyGridCalendarProps> = ({
  timetable,
  onOpenRoom,
  currentDayName = 'Monday',
  currentTime = '08:00',
}) => {
  const findEntry = (day: DayOfWeek, slot: number) => {
    return timetable.find(
      (e) => e.day.toLowerCase() === day.toLowerCase() && e.slot === slot
    );
  };

  const getCourseShortColor = (type: string) => {
    switch (type) {
      case 'L':
        return 'border-[#E5E5E5] bg-[#F9FAFB] text-[#111111]';
      case 'P':
        return 'border-[#E5E5E5] bg-[#F3F4F6] text-[#111111]';
      case 'T':
        return 'border-[#E5E5E5] bg-[#F9FAFB] text-[#111111]';
      case 'S':
        return 'border-[#E5E5E5] bg-[#F3F4F6] text-[#111111]';
      default:
        return 'border-[#E5E5E5] bg-[#FFFFFF] text-[#111111]';
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 sm:p-6 overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display uppercase tracking-wide">
            WEEKLY TIMETABLE MATRIX
          </h2>
          <p className="text-xs text-[#666666]">
            Full slot-by-slot master schedule for Odd Semester 2026-27
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono-code text-[#666666]">
          <span>[L] Lecture</span>
          <span>[S] Session</span>
          <span>[P] Practical</span>
          <span>[T] Tutorial</span>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9FAFB]">
              <th className="py-3 px-3 text-[#666666] font-mono-code font-bold uppercase text-[11px] w-32">
                TIME / SLOT
              </th>
              {DAYS.map((day) => {
                const isToday = day.toLowerCase() === currentDayName.toLowerCase();
                return (
                  <th
                    key={day}
                    className={`py-3 px-3 font-display font-bold uppercase text-xs ${
                      isToday ? 'text-[#111111] bg-[#F3F4F6]' : 'text-[#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{day.substring(0, 3)}</span>
                      {isToday && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#111111] text-[#FFFFFF] font-mono-code">
                          TODAY
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {FIXED_SLOTS.map((slot) => (
              <tr key={slot.slot} className="hover:bg-[#F9FAFB] transition-colors">
                {/* Slot Time Column */}
                <td className="py-3 px-3 font-mono-code text-[11px] text-[#666666] bg-[#FAFAFA] border-r border-[#E5E5E5]">
                  <div className="font-bold text-[#111111]">Slot {slot.slot}</div>
                  <div className="text-[10px] text-[#888888]">{formatTime12(slot.startTime)}</div>
                </td>

                {/* Day Columns */}
                {DAYS.map((day) => {
                  const entry = findEntry(day, slot.slot);
                  const isCurrentDay = day.toLowerCase() === currentDayName.toLowerCase();
                  const isNow =
                    isCurrentDay &&
                    currentTime >= slot.startTime &&
                    currentTime < slot.endTime;

                  return (
                    <td
                      key={day}
                      className={`py-2 px-2.5 align-top ${
                        isCurrentDay ? 'bg-[#FAFAFA]/70' : ''
                      }`}
                    >
                      {entry ? (
                        <div
                          className={`p-2.5 rounded-xl border transition-all ${
                            isNow
                              ? 'border-[#111111] bg-[#FFFFFF] shadow-sm'
                              : getCourseShortColor(entry.classType)
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-mono-code font-bold text-[10px] text-[#111111]">
                              {entry.courseCode}
                            </span>
                            <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-[#E5E5E5] text-[#111111]">
                              {entry.classType}
                            </span>
                          </div>

                          <div className="font-bold text-xs line-clamp-1 text-[#111111]" title={entry.courseName}>
                            {entry.courseName}
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#666666] mt-1.5 pt-1 border-t border-[#E5E5E5]">
                            <button
                              type="button"
                              onClick={() => onOpenRoom(entry.room)}
                              className="font-mono-code font-bold text-[#111111] hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <MapPin className="w-2.5 h-2.5 text-[#111111]" />
                              {entry.room}
                            </button>
                            <span className="truncate max-w-[70px]" title={entry.faculty}>
                              {entry.faculty.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[64px] flex items-center justify-center text-[10px] text-[#D1D5DB] font-mono-code">
                          —
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
