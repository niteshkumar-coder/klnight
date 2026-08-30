import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Moon,
  Power,
  Shield,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { MINIMUM_DAY_RULES } from '../../data/lifePlannerData';

interface MinimumDayViewProps {
  isMinimumDayActive: boolean;
  onToggleMinimumDay: () => void;
}

export const MinimumDayView: React.FC<MinimumDayViewProps> = ({
  isMinimumDayActive,
  onToggleMinimumDay,
}) => {
  return (
    <div className="space-y-6">
      {/* ACTIVATION HERO CARD */}
      <div
        className={`rounded-2xl border p-6 shadow-xs transition-all ${
          isMinimumDayActive
            ? 'bg-[#FEF2F2] border-[#F87171]'
            : 'bg-[#FFFFFF] border-[#E5E5E5]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                isMinimumDayActive
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : 'bg-[#F3F4F6] text-[#111111]'
              }`}
            >
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111] font-display">
                  MINIMUM-DAY BACKUP SYSTEM
                </h3>
                <span
                  className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full ${
                    isMinimumDayActive
                      ? 'bg-[#DC2626] text-[#FFFFFF]'
                      : 'bg-[#F3F4F6] text-[#666666]'
                  }`}
                >
                  {isMinimumDayActive ? 'ACTIVE NOW' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-[#555555] mt-1 max-w-xl leading-relaxed">
                When you are tired, college assignments are overwhelming, or restaurant shifts are
                demanding — switch to Minimum-Day Mode to protect your health and sleep without
                guilt.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleMinimumDay}
            className={`px-5 py-2.5 rounded-xl font-mono-code font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
              isMinimumDayActive
                ? 'bg-[#DC2626] text-[#FFFFFF] hover:bg-[#B91C1C]'
                : 'bg-[#111111] text-[#FFFFFF] hover:bg-black'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>
              {isMinimumDayActive ? 'Deactivate Minimum Mode' : 'Activate Minimum Day for Today'}
            </span>
          </button>
        </div>
      </div>

      {/* TWO COLUMNS: MUST PROTECT VS ALLOWED TO SKIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* MUST PROTECT (NON-NEGOTIABLE) */}
        <div className="bg-[#FFFFFF] border border-[#A7F3D0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#047857] pb-2 border-b border-[#E5E5E5]">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <h4 className="text-sm font-bold font-display uppercase tracking-wide">
              MUST PROTECT (NON-NEGOTIABLE)
            </h4>
          </div>
          <p className="text-[11px] text-[#666666]">
            These form the rock-solid baseline of your student and physical life:
          </p>

          <div className="space-y-2 pt-1">
            {MINIMUM_DAY_RULES.mustProtect.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-2.5 text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-[#14532D]">{item.title}</div>
                  <div className="text-[11px] text-[#166534] mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALLOWED TO SKIP / POSTPONE (ZERO GUILT) */}
        <div className="bg-[#FFFFFF] border border-[#FECACA] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#B91C1C] pb-2 border-b border-[#E5E5E5]">
            <XCircle className="w-5 h-5 text-[#EF4444]" />
            <h4 className="text-sm font-bold font-display uppercase tracking-wide">
              ALLOWED TO SKIP / POSTPONE (ZERO GUILT)
            </h4>
          </div>
          <p className="text-[11px] text-[#666666]">
            On heavy/tired days, safely postpone these to Sunday or next week:
          </p>

          <div className="space-y-2 pt-1">
            {MINIMUM_DAY_RULES.allowedToSkip.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center font-mono-code font-bold text-[10px] shrink-0 mt-0.5">
                  ✕
                </span>
                <div>
                  <div className="font-bold text-[#7F1D1D]">{item.title}</div>
                  <div className="text-[11px] text-[#991B1B] mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GOLDEN HEALTH RULE */}
      <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-3 text-xs text-[#92400E]">
        <Moon className="w-5 h-5 text-[#B45309] shrink-0" />
        <p className="leading-relaxed">
          <strong>The Golden Directive:</strong> You are a human college student, not a machine.
          Never sacrifice your 7–8 hours of sleep or mental well-being to check an extra box.
        </p>
      </div>
    </div>
  );
};
