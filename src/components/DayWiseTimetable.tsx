import {
  Calendar,
  Clock,
  Coffee,
  MapPin,
  User,
} from 'lucide-react';
import React from 'react';
import { BREAK_TIMES } from '../lib/erp/mockData';
import { formatTime12, getClassTypeLabel } from '../lib/erp/normalizers';
import { DayOfWeek, TimetableEntry } from '../types';

interface DayWiseTimetableProps {
  timetable: TimetableEntry[];
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  onOpenRoom: (roomCode: string) => void;
  currentTime?: string;
  currentDayName?: DayOfWeek;
}

const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DayWiseTimetable: React.FC<DayWiseTimetableProps> = ({
  timetable,
  selectedDay,
  onSelectDay,
  onOpenRoom,
  currentTime = '08:00',
  currentDayName = 'Monday',
}) => {
  // Get sorted classes strictly for the selected day
  const dayClasses = timetable
    .filter((e) => e.day.toLowerCase() === selectedDay.toLowerCase())
    .sort((a, b) => a.slot - b.slot || a.startTime.localeCompare(b.startTime));

  const isClassActiveNow = (entry: TimetableEntry) => {
    if (selectedDay.toLowerCase() !== currentDayName.toLowerCase()) return false;
    return currentTime >= entry.startTime && currentTime < entry.endTime;
  };

  return (
    <section className="space-y-4">
      {/* SECTION HEADER & DAY SELECTOR */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#111111]" />
              WEEKLY TIMETABLE
            </h2>
            <p className="text-xs text-[#666666]">
              Select a day to view scheduled lectures, labs, and breaks.
            </p>
          </div>
        </div>

        {/* 6-DAY SELECTOR: 1 ROW ON DESKTOP, HORIZONTALLY SCROLLABLE ON MOBILE */}
        <div className="pt-1">
          <div className="flex sm:grid sm:grid-cols-6 gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-1 sm:pb-0">
            {DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const isRealToday = day.toLowerCase() === currentDayName.toLowerCase();
              const count = timetable.filter((e) => e.day.toLowerCase() === day.toLowerCase()).length;

              return (
                <button
                  key={day}
                  id={`btn-day-${day.toLowerCase()}`}
                  type="button"
                  onClick={() => onSelectDay(day)}
                  className={`min-w-[100px] sm:min-w-0 flex-1 flex flex-col items-center justify-center py-2.5 px-3 rounded-xl text-xs font-mono-code transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-[#111111] text-[#FFFFFF] font-bold border-[#111111] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#666666] border-[#E5E5E5] hover:border-[#CCCCCC] hover:text-[#111111] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {/* Today indicator */}
                  {isRealToday && (
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md mb-0.5 tracking-wider ${
                        isSelected
                          ? 'bg-[#FFFFFF] text-[#111111]'
                          : 'bg-[#F3F4F6] text-[#111111] border border-[#E5E5E5]'
                      }`}
                    >
                      TODAY
                    </span>
                  )}

                  <span className="font-bold tracking-wider uppercase text-xs">
                    {day}
                  </span>

                  <span
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? 'text-[#D1D5DB]' : 'text-[#888888]'
                    }`}
                  >
                    {count} {count === 1 ? 'class' : 'classes'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED DAY HEADING */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#111111] font-display uppercase tracking-wide">
            {selectedDay}
          </h3>
          {selectedDay.toLowerCase() === currentDayName.toLowerCase() && (
            <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#111111] text-[#FFFFFF]">
              TODAY
            </span>
          )}
        </div>
        <span className="text-xs text-[#666666] font-mono-code">
          {dayClasses.length} {dayClasses.length === 1 ? 'Class' : 'Classes'} Scheduled
        </span>
      </div>

      {/* TIMETABLE LIST FOR ONLY THE SELECTED DAY */}
      {dayClasses.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-8 text-center shadow-sm">
          <div className="text-3xl mb-2">🎉</div>
          <h4 className="text-base font-bold text-[#111111] font-display">
            No Classes on {selectedDay}
          </h4>
          <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
            No lectures or practical labs scheduled for this day. Enjoy your free time or prepare for upcoming coursework.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayClasses.map((item, idx) => {
            const isLive = isClassActiveNow(item);
            const prevItem = dayClasses[idx - 1];
            let breakNotice = null;

            // Check if break occurs before this class
            if (prevItem) {
              const breakObj = BREAK_TIMES.find((b) => b.afterSlot === prevItem.slot);
              if (breakObj) {
                breakNotice = (
                  <div
                    key={`break-${item.id}`}
                    className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code text-[#666666]"
                  >
                    <div className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-[#111111]" />
                      <span className="font-bold text-[#111111]">
                        {formatTime12(breakObj.startTime)} – {formatTime12(breakObj.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#111111]">☕ BREAK</span>
                      <span className="text-[#888888]">({breakObj.duration})</span>
                    </div>
                  </div>
                );
              }
            }

            return (
              <React.Fragment key={item.id}>
                {breakNotice}

                {/* TIMETABLE CARD */}
                <div
                  id={`card-class-${item.id}`}
                  className={`bg-[#FFFFFF] border rounded-2xl p-4 sm:p-5 transition-colors shadow-sm ${
                    isLive
                      ? 'border-2 border-[#111111] bg-[#FAFAFA]'
                      : 'border-[#E5E5E5] hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Left details: Time, Course, Code & Type */}
                    <div className="space-y-1.5">
                      {/* Time & Live Indicator */}
                      <div className="flex items-center gap-2">
                        <div className="text-sm sm:text-base font-bold font-mono-code text-[#111111]">
                          {formatTime12(item.startTime)} – {formatTime12(item.endTime)}
                        </div>

                        {isLive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111111] text-[#FFFFFF] text-[10px] font-bold font-mono-code">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            ● NOW
                          </span>
                        )}

                        <span className="text-[10px] text-[#888888] font-mono-code">
                          Slot {item.slot}
                        </span>
                      </div>

                      {/* Course Name */}
                      <h4 className="text-base sm:text-lg font-bold text-[#111111] font-display leading-snug">
                        {item.courseName}
                      </h4>

                      {/* Course Code & Type */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-xs font-mono-code text-[#666666]">
                          {item.courseCode} · {getClassTypeLabel(item.classType)}
                        </span>
                        <span className="text-[#D1D5DB]">·</span>
                        <span className="text-xs text-[#888888] flex items-center gap-1">
                          <User className="w-3 h-3 text-[#9CA3AF]" />
                          <span>{item.faculty}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right details: Room Number */}
                    <div className="flex items-center md:flex-col md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F3F4F6]">
                      <button
                        type="button"
                        onClick={() => onOpenRoom(item.room)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E5E5] text-xs sm:text-sm font-bold font-mono-code text-[#111111] transition-colors cursor-pointer"
                        title="Click for classroom directions and facilities"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                        <span>Room {item.room}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </section>
  );
};
