import { CheckCircle2, Download, Smartphone, Wifi, WifiOff, X, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface InstallAppBannerProps {
  onOpenModal: () => void;
  canPromptNative: boolean;
  onNativeInstall?: () => Promise<boolean>;
  isInstalled: boolean;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({
  onOpenModal,
  canPromptNative,
  onNativeInstall,
  isInstalled,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#111111] via-[#1C1C1C] to-[#111111] text-white rounded-2xl p-4 sm:p-5 border border-[#333333] shadow-md mb-5 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8FF00]/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/15 shrink-0 shadow-inner">
            <img
              src="https://i.ibb.co/XrWyDBV0/image.png"
              alt="KLNIGHT"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-white tracking-tight font-display">
                {isInstalled ? 'KLNIGHT Mobile App Active' : 'Install KLNIGHT on Mobile'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#4ADE80] text-[10px] font-mono-code font-bold border border-[#16A34A]/40">
                <WifiOff className="w-3 h-3" />
                <span>OFFLINE READY</span>
              </span>
            </div>
            <p className="text-xs text-[#D1D5DB] mt-0.5">
              {isInstalled
                ? 'Your timetable and attendance are cached for 100% offline access anytime.'
                : 'Add to your phone Home Screen to open timetable instantly even without internet.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {!isInstalled && (
            <button
              type="button"
              onClick={canPromptNative && onNativeInstall ? () => onNativeInstall() : onOpenModal}
              className="px-4 py-2 rounded-xl bg-[#B8FF00] hover:bg-[#A3E600] text-black text-xs font-bold font-mono-code flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>{canPromptNative ? 'INSTALL APP' : 'ADD TO HOME SCREEN'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenModal}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium font-mono-code transition-colors border border-white/15 cursor-pointer"
            title="How to install on phone"
          >
            <span>GUIDE</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
