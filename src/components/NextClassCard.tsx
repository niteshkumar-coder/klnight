import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Hourglass,
  MapPin,
  Sparkles,
  Timer,
  User,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatTime12, getClassTypeLabel } from '../lib/erp/normalizers';
import { TimetableEntry } from '../types';

interface NextClassCardProps {
  status: 'live_now' | 'upcoming' | 'completed_for_today' | 'no_classes_today' | 'loading';
  currentClass?: TimetableEntry;
  nextClass?: TimetableEntry;
  nextClassTomorrow?: { day: string; entry: TimetableEntry };
  day?: string;
  onOpenRoom: (roomCode: string) => void;
  onViewSchedule?: () => void;
}

interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
  progressPercent: number;
  isZero: boolean;
}

export const NextClassCard: React.FC<NextClassCardProps> = ({
  status,
  currentClass,
  nextClass,
  nextClassTomorrow,
  day = 'Today',
  onOpenRoom,
  onViewSchedule,
}) => {
  // Live continuous second-by-second countdown calculation (Ulta timing)
  const [countdown, setCountdown] = useState<CountdownState>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    totalSeconds: 0,
    progressPercent: 0,
    isZero: false,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();

      // Scenario 1: Class is Live Now -> Countdown until class ENDS
      if (status === 'live_now' && currentClass) {
        const [startH, startM] = currentClass.startTime.split(':').map(Number);
        const [endH, endM] = currentClass.endTime.split(':').map(Number);

        const startTimeDate = new Date();
        startTimeDate.setHours(startH, startM, 0, 0);

        const endTimeDate = new Date();
        endTimeDate.setHours(endH, endM, 0, 0);

        const totalDurationMs = Math.max(1, endTimeDate.getTime() - startTimeDate.getTime());
        const remainingMs = endTimeDate.getTime() - now.getTime();

        if (remainingMs <= 0) {
          setCountdown({
            hours: '00',
            minutes: '00',
            seconds: '00',
            totalSeconds: 0,
            progressPercent: 100,
            isZero: true,
          });
          return;
        }

        const elapsedMs = totalDurationMs - remainingMs;
        const progress = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

        const totalSec = Math.floor(remainingMs / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;

        setCountdown({
          hours: h.toString().padStart(2, '0'),
          minutes: m.toString().padStart(2, '0'),
          seconds: s.toString().padStart(2, '0'),
          totalSeconds: totalSec,
          progressPercent: Math.round(progress),
          isZero: false,
        });
        return;
      }

      // Scenario 2: Upcoming Class Today -> Countdown until class STARTS
      if (status === 'upcoming' && nextClass) {
        const [startH, startM] = nextClass.startTime.split(':').map(Number);
        const target = new Date();
        target.setHours(startH, startM, 0, 0);

        const diffMs = target.getTime() - now.getTime();

        if (diffMs <= 0) {
          setCountdown({
            hours: '00',
            minutes: '00',
            seconds: '00',
            totalSeconds: 0,
            progressPercent: 0,
            isZero: true,
          });
          return;
        }

        const totalSec = Math.floor(diffMs / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;

        setCountdown({
          hours: h.toString().padStart(2, '0'),
          minutes: m.toString().padStart(2, '0'),
          seconds: s.toString().padStart(2, '0'),
          totalSeconds: totalSec,
          progressPercent: 0,
          isZero: false,
        });
        return;
      }

      // Scenario 3: Completed for today or No classes today (e.g. Sunday Holiday) -> Countdown to Next class
      if (nextClassTomorrow) {
        const [startH, startM] = nextClassTomorrow.entry.startTime.split(':').map(Number);
        const target = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayIdx = target.getDay();
        const targetIdx = dayNames.indexOf(nextClassTomorrow.day);
        let daysDiff = targetIdx !== -1 ? (targetIdx - todayIdx + 7) % 7 : 1;
        if (daysDiff === 0) daysDiff = 7;

        target.setDate(target.getDate() + daysDiff);
        target.setHours(startH, startM, 0, 0);

        const diffMs = target.getTime() - now.getTime();

        if (diffMs > 0) {
          const totalSec = Math.floor(diffMs / 1000);
          const h = Math.floor(totalSec / 3600);
          const m = Math.floor((totalSec % 3600) / 60);
          const s = totalSec % 60;

          setCountdown({
            hours: h.toString().padStart(2, '0'),
            minutes: m.toString().padStart(2, '0'),
            seconds: s.toString().padStart(2, '0'),
            totalSeconds: totalSec,
            progressPercent: 0,
            isZero: false,
          });
          return;
        }
      }

      // Default state
      setCountdown({
        hours: '00',
        minutes: '00',
        seconds: '00',
        totalSeconds: 0,
        progressPercent: 0,
        isZero: true,
      });
    };

    calculateCountdown();
    const timerInterval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timerInterval);
  }, [status, currentClass, nextClass, nextClassTomorrow]);

  if (status === 'loading') {
    return (
      <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-[#F3F4F6] rounded w-28 mb-4" />
        <div className="h-7 bg-[#F3F4F6] rounded w-2/3 mb-3" />
        <div className="h-4 bg-[#F3F4F6] rounded w-1/3" />
      </div>
    );
  }

  // --- 1. CLASS IS LIVE NOW (WITH LIVE REVERSE COUNTDOWN & PROGRESS BAR) ---
  if (status === 'live_now' && currentClass) {
    return (
      <div className="w-full bg-[#FFFFFF] border-2 border-[#111111] rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#FFFFFF] text-xs font-bold font-mono-code">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              ● LIVE NOW
            </span>
            <span className="text-xs font-bold text-[#111111] uppercase tracking-wide">
              CLASS IN PROGRESS
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#111111] bg-[#F9FAFB] px-3 py-1 rounded-lg border border-[#E5E5E5]">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
            <span>
              {formatTime12(currentClass.startTime)} – {formatTime12(currentClass.endTime)}
            </span>
          </div>
        </div>

        {/* Content & Reverse Countdown Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <div>
              <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                CURRENT COURSE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] font-display leading-tight">
                {currentClass.courseName}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Clickable Room */}
              <button
                type="button"
                onClick={() => onOpenRoom(currentClass.room)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] text-[#FFFFFF] hover:bg-[#2A2A2A] text-xs font-bold font-mono-code transition-colors cursor-pointer shadow-xs"
                title="Click to view room information and map"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B8FF00]" />
                <span>Room {currentClass.room}</span>
              </button>

              {/* Class Type & Code */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code text-[#111111]">
                <span className="font-bold">{getClassTypeLabel(currentClass.classType)}</span>
                <span className="text-[#9CA3AF]">·</span>
                <span className="text-[#666666]">{currentClass.courseCode}</span>
              </div>

              {/* Day badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F3F4F6] text-xs font-medium text-[#666666]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{day}</span>
              </div>

              {currentClass.faculty && (
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#666666] ml-auto">
                  <User className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>{currentClass.faculty}</span>
                </div>
              )}
            </div>
          </div>

          {/* LIVE ULTA COUNTDOWN BOX (CLASS ENDS IN) */}
          <div className="bg-[#111111] text-white border border-[#222222] rounded-xl p-4 shrink-0 flex flex-col items-center justify-center min-w-[230px] shadow-sm">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#B8FF00] uppercase mb-1.5 font-mono-code">
              <Hourglass className="w-3.5 h-3.5 animate-spin" />
              <span>CLASS ENDS IN (उलटा टाइम)</span>
            </div>

            {/* HH : MM : SS (Ticking live seconds) */}
            <div className="flex items-center gap-1 font-mono-code text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              <span className="bg-[#1C1C1C] px-2 py-1 rounded border border-white/10 shadow-xs min-w-[42px] text-center">
                {countdown.hours}
              </span>
              <span className="text-[#B8FF00] text-lg font-bold animate-pulse">:</span>
              <span className="bg-[#1C1C1C] px-2 py-1 rounded border border-white/10 shadow-xs min-w-[42px] text-center">
                {countdown.minutes}
              </span>
              <span className="text-[#B8FF00] text-lg font-bold animate-pulse">:</span>
              <span className="bg-[#1C1C1C] px-2 py-1 rounded border border-white/10 shadow-xs min-w-[42px] text-center text-[#B8FF00]">
                {countdown.seconds}
              </span>
            </div>

            {/* Labels: HRS  MINS  SECS */}
            <div className="flex items-center justify-between w-full px-2 mt-1 text-[9px] font-bold text-[#A3A3A3] font-mono-code">
              <span>HRS</span>
              <span className="pl-1">MINS</span>
              <span>SECS</span>
            </div>

            {/* Progress bar */}
            <div className="w-full mt-2.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-[10px] text-[#A3A3A3] font-mono-code mb-1">
                <span>Elapsed</span>
                <span className="text-[#B8FF00] font-bold">{countdown.progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B8FF00] transition-all duration-1000"
                  style={{ width: `${countdown.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. UPCOMING NEXT CLASS WITH LIVE SECOND-BY-SECOND ULTA COUNTDOWN ---
  if (status === 'upcoming' && nextClass) {
    return (
      <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono-code tracking-wider uppercase bg-[#F3F4F6] text-[#111111] px-3 py-1 rounded-full border border-[#E5E5E5] flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#111111]" />
              <span>NEXT CLASS</span>
            </span>
            <span className="text-xs text-[#666666] font-medium">{day}</span>
          </div>

          <div className="text-xs sm:text-sm font-mono-code font-black text-[#111111] bg-[#F3F4F6] px-3.5 py-1.5 rounded-xl border border-[#D1D5DB] flex items-center gap-2 shadow-2xs">
            <Clock className="w-4 h-4 text-[#111111]" />
            <span>
              {formatTime12(nextClass.startTime)} – {formatTime12(nextClass.endTime)}
            </span>
          </div>
        </div>

        {/* Content & Countdown Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Course Details */}
          <div className="space-y-3 max-w-xl">
            <div>
              <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                UPCOMING LECTURE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] font-display leading-tight">
                {nextClass.courseName}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              {/* Room Button */}
              <button
                type="button"
                onClick={() => onOpenRoom(nextClass.room)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] text-[#FFFFFF] hover:bg-[#2A2A2A] text-xs font-bold font-mono-code transition-colors cursor-pointer shadow-xs"
                title="Click to view room details"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B8FF00]" />
                <span>Room {nextClass.room}</span>
              </button>

              {/* Class Type & Code */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code text-[#111111]">
                <span className="font-bold">{getClassTypeLabel(nextClass.classType)}</span>
                <span className="text-[#9CA3AF]">·</span>
                <span className="text-[#666666]">{nextClass.courseCode}</span>
              </div>

              {nextClass.faculty && (
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#666666]">
                  <User className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>{nextClass.faculty}</span>
                </div>
              )}
            </div>
          </div>

          {/* LIVE REAL-TIME COUNTDOWN BOX (STARTS IN) */}
          <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 shrink-0 flex flex-col items-center justify-center min-w-[230px]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#666666] uppercase mb-1.5 font-mono-code">
              <Hourglass className="w-3 h-3 text-[#111111]" />
              <span>STARTS IN (उलटा टाइमिंग)</span>
            </div>

            {/* HH : MM : SECS (Live ticking) */}
            <div className="flex items-center gap-1 font-mono-code text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#E5E5E5] shadow-2xs min-w-[42px] text-center">
                {countdown.hours}
              </span>
              <span className="text-[#666666] text-lg font-bold animate-pulse">:</span>
              <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#E5E5E5] shadow-2xs min-w-[42px] text-center">
                {countdown.minutes}
              </span>
              <span className="text-[#666666] text-lg font-bold animate-pulse">:</span>
              <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#E5E5E5] shadow-2xs min-w-[42px] text-center text-[#16A34A]">
                {countdown.seconds}
              </span>
            </div>

            {/* Labels: HRS  MINS  SECS */}
            <div className="flex items-center justify-between w-full px-2 mt-1 text-[9px] font-bold text-[#888888] font-mono-code">
              <span>HRS</span>
              <span className="pl-1">MINS</span>
              <span>SECS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. SUNDAY HOLIDAY / NO MORE CLASSES TODAY / NEXT DAY PREVIEW WITH LIVE ULTA COUNTDOWN ---
  const isSunday = day.toLowerCase() === 'sunday';

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] border border-[#E5E5E5] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
          {isSunday ? '🏖️' : '🎉'}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-[#111111] font-display">
              {isSunday
                ? 'SUNDAY HOLIDAY — आज छुट्टी है 🏖️'
                : status === 'no_classes_today'
                ? 'No Classes Scheduled Today'
                : 'NO MORE CLASSES TODAY 🎉'}
            </h3>
            {isSunday && (
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                WEEKEND OFF
              </span>
            )}
          </div>
          <p className="text-xs text-[#666666] mt-0.5 max-w-md">
            {isSunday
              ? 'Sunday is an official academic holiday at KL University. No lectures or lab sessions are scheduled today. Enjoy your weekend!'
              : status === 'no_classes_today'
              ? 'Enjoy your free day or prepare ahead for upcoming course modules.'
              : 'All scheduled lectures and practical sessions are complete for today.'}
          </p>
        </div>
      </div>

      {nextClassTomorrow && (
        <div className="w-full md:w-auto p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shrink-0 shadow-2xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded text-[10px] uppercase font-mono-code font-black border border-[#FDE68A]">
                NEXT CLASS ({nextClassTomorrow.day.toUpperCase()}):
              </span>
              <span className="text-[#111111] font-mono-code font-black text-xs sm:text-sm bg-[#FFFFFF] px-2.5 py-0.5 rounded-lg border border-[#E5E5E5] shadow-2xs">
                {formatTime12(nextClassTomorrow.entry.startTime)} – {formatTime12(nextClassTomorrow.entry.endTime)}
              </span>
            </div>
            <div className="text-[#111111] text-xs font-sans font-bold">
              {nextClassTomorrow.entry.courseName}
            </div>
            {countdown.totalSeconds > 0 && (
              <div className="text-xs font-mono-code font-black text-[#16A34A] flex items-center gap-1.5 pt-0.5">
                <Hourglass className="w-4 h-4 text-[#16A34A] animate-spin" />
                <span>Starts in {countdown.hours}h {countdown.minutes}m {countdown.seconds}s (उलटा टाइमिंग)</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenRoom(nextClassTomorrow.entry.room)}
            className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-xs text-[#FFFFFF] font-bold cursor-pointer transition-colors shadow-2xs"
          >
            Room {nextClassTomorrow.entry.room}
          </button>
        </div>
      )}
    </div>
  );
};
