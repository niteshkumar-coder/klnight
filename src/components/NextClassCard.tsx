import {
  Clock,
  MapPin,
  Sparkles,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TimetableEntry } from '../types';
import { formatTime12, getClassTypeLabel } from '../lib/erp/normalizers';

interface NextClassCardProps {
  status: 'live_now' | 'upcoming' | 'completed_for_today' | 'no_classes_today' | 'loading';
  currentClass?: TimetableEntry;
  nextClass?: TimetableEntry;
  nextClassTomorrow?: { day: string; entry: TimetableEntry };
  day?: string;
  onOpenRoom: (roomCode: string) => void;
  onViewSchedule?: () => void;
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
  // Live local second-by-second countdown calculation
  const [countdown, setCountdown] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    isZero: boolean;
  }>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    isZero: false,
  });

  useEffect(() => {
    if (status !== 'upcoming' || !nextClass) {
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date();
      const [startH, startM] = nextClass.startTime.split(':').map(Number);
      
      const target = new Date();
      target.setHours(startH, startM, 0, 0);

      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown({
          hours: '00',
          minutes: '00',
          seconds: '00',
          isZero: true,
        });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isZero: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [status, nextClass]);

  if (status === 'loading') {
    return (
      <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-[#F3F4F6] rounded w-28 mb-4" />
        <div className="h-7 bg-[#F3F4F6] rounded w-2/3 mb-3" />
        <div className="h-4 bg-[#F3F4F6] rounded w-1/3" />
      </div>
    );
  }

  // --- 1. CLASS IS LIVE NOW ---
  if (status === 'live_now' && currentClass) {
    return (
      <div className="w-full bg-[#FFFFFF] border-2 border-[#111111] rounded-2xl p-5 sm:p-6 shadow-sm relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#FFFFFF] text-xs font-bold font-mono-code">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              ● NOW
            </span>
            <span className="text-xs font-bold text-[#111111] uppercase tracking-wide">
              CLASS IS LIVE
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#111111] bg-[#F9FAFB] px-3 py-1 rounded-lg border border-[#E5E5E5]">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
            <span>
              {formatTime12(currentClass.startTime)} – {formatTime12(currentClass.endTime)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] text-[#FFFFFF] hover:bg-[#2A2A2A] text-xs font-bold font-mono-code transition-colors cursor-pointer"
              title="Click to view room information and map"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFFFFF]" />
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
      </div>
    );
  }

  // --- 2. UPCOMING NEXT CLASS WITH LIVE SECOND-BY-SECOND COUNTDOWN ---
  if (status === 'upcoming' && nextClass) {
    return (
      <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono-code tracking-wider uppercase bg-[#F3F4F6] text-[#111111] px-3 py-1 rounded-full border border-[#E5E5E5]">
              NEXT CLASS
            </span>
            <span className="text-xs text-[#666666] font-medium">{day}</span>
          </div>

          <div className="text-xs font-mono-code font-bold text-[#111111] bg-[#F9FAFB] px-3 py-1 rounded-lg border border-[#E5E5E5] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
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
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] font-display leading-tight">
                {nextClass.courseName}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              {/* Room Button */}
              <button
                type="button"
                onClick={() => onOpenRoom(nextClass.room)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] text-[#FFFFFF] hover:bg-[#2A2A2A] text-xs font-bold font-mono-code transition-colors cursor-pointer"
                title="Click to view room details"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FFFFFF]" />
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

          {/* LIVE REAL-TIME COUNTDOWN BOX */}
          <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 shrink-0 flex flex-col items-center justify-center min-w-[220px]">
            <div className="text-[10px] font-bold tracking-widest text-[#666666] uppercase mb-1.5 font-mono-code">
              STARTS IN
            </div>

            {/* HH : MM : SS */}
            <div className="flex items-center gap-1 font-mono-code text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#E5E5E5] shadow-2xs min-w-[42px] text-center">
                {countdown.hours}
              </span>
              <span className="text-[#666666] text-lg font-bold">:</span>
              <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#E5E5E5] shadow-2xs min-w-[42px] text-center">
                {countdown.minutes}
              </span>
              <span className="text-[#666666] text-lg font-bold">:</span>
              <span className="bg-[#FFFFFF] px-2 py-1 rounded border border-[#E5E5E5] shadow-2xs min-w-[42px] text-center">
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

  // --- 3. NO MORE CLASSES TODAY / FREE DAY ---
  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] border border-[#E5E5E5] flex items-center justify-center text-xl shrink-0">
          🎉
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#111111] font-display">
            {status === 'no_classes_today'
              ? 'No Classes Scheduled Today'
              : 'NO MORE CLASSES TODAY 🎉'}
          </h3>
          <p className="text-xs text-[#666666] mt-0.5">
            {status === 'no_classes_today'
              ? 'Enjoy your free day or prepare ahead for upcoming course modules.'
              : 'All scheduled lectures and practical sessions are complete for today.'}
          </p>
        </div>
      </div>

      {nextClassTomorrow && (
        <div className="w-full md:w-auto p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] text-xs font-mono-code flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[#666666] block text-[10px] uppercase font-bold">
              NEXT CLASS TOMORROW ({nextClassTomorrow.day.toUpperCase()}):
            </span>
            <span className="text-[#111111] font-bold">
              {formatTime12(nextClassTomorrow.entry.startTime)} – {formatTime12(nextClassTomorrow.entry.endTime)}
            </span>
            <span className="text-[#666666] ml-1.5 font-sans font-medium">
              ({nextClassTomorrow.entry.courseName.split(' ')[0]} in Room {nextClassTomorrow.entry.room})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenRoom(nextClassTomorrow.entry.room)}
            className="px-2.5 py-1 rounded bg-[#111111] hover:bg-[#2A2A2A] text-[11px] text-[#FFFFFF] font-bold cursor-pointer transition-colors"
          >
            Room {nextClassTomorrow.entry.room}
          </button>
        </div>
      )}
    </div>
  );
};
