import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { AttendanceRecord } from '../types';

interface SubjectDetailModalProps {
  subject: AttendanceRecord | null;
  onClose: () => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!subject) return null;

  const calculateTargets = (attended: number, total: number) => {
    let safeToMiss75 = 0;
    let needToAttend75 = 0;
    const cur = total > 0 ? (attended / total) * 100 : 100;

    if (cur >= 75) {
      safeToMiss75 = Math.floor(attended / 0.75 - total);
    } else {
      needToAttend75 = Math.ceil((0.75 * total - attended) / 0.25);
    }

    let needToAttend85 = 0;
    if (cur < 85) {
      needToAttend85 = Math.ceil((0.85 * total - attended) / 0.15);
    }

    return { safeToMiss75, needToAttend75, needToAttend85, cur };
  };

  const targets = calculateTargets(subject.attended, subject.totalClasses);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl relative">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111]">
                {subject.courseCode}
              </span>
              <span className="text-xs text-[#666666] font-mono-code">{subject.classType}</span>
            </div>
            <h2 className="text-lg font-bold text-[#111111] font-display mt-1">
              {subject.courseName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E5E5] text-[#666666] hover:text-[#111111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                Percentage
              </span>
              <span className="text-xl font-bold font-mono-code text-[#111111] mt-0.5 block">
                {subject.percentage}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                Attended
              </span>
              <span className="text-xl font-bold font-mono-code text-[#16A34A] mt-0.5 block">
                {subject.attended}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
              <span className="text-[10px] uppercase font-bold text-[#666666] font-mono-code block">
                Total Held
              </span>
              <span className="text-xl font-bold font-mono-code text-[#111111] mt-0.5 block">
                {subject.totalClasses}
              </span>
            </div>
          </div>

          {/* Attendance Margin Advisory */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2">
            <div className="text-xs font-mono-code font-bold uppercase text-[#111111] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#111111]" />
              75% EXAM ELIGIBILITY ADVISORY
            </div>

            {targets.cur >= 75 ? (
              <p className="text-xs text-[#16A34A] leading-relaxed font-mono-code">
                ✓ You are eligible. You can miss up to <strong>{targets.safeToMiss75}</strong> upcoming class{targets.safeToMiss75 === 1 ? '' : 'es'} without dropping below 75%.
              </p>
            ) : (
              <p className="text-xs text-[#DC2626] leading-relaxed font-mono-code">
                ⚠ You need to attend the next <strong>{targets.needToAttend75}</strong> consecutive classes to regain exam eligibility (75%).
              </p>
            )}
          </div>

          {/* Faculty Info */}
          <div className="text-xs font-mono-code text-[#666666] flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#666666]" /> Instructor:
            </span>
            <span className="font-bold text-[#111111]">{subject.faculty}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-mono-code font-bold cursor-pointer transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
