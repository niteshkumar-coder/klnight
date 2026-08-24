import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import React from 'react';

interface OfflineBannerProps {
  lastSync: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  lastSync,
  onRetry,
  isRetrying,
}) => {
  return (
    <div className="w-full bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-3.5 sm:p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626]">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-[#111111] flex items-center gap-2">
            <span>OFFLINE MODE ACTIVE</span>
            <span className="text-[10px] text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded border border-[#FCA5A5]">
              CACHED DATA
            </span>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5">
            Displaying timetable from local cache. Last synced:{' '}
            <span className="text-[#111111] font-semibold">
              {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Earlier today'}
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F9FAFB] border border-[#E5E5E5] text-[#111111] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 font-bold"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-[#666666] ${isRetrying ? 'animate-spin' : ''}`} />
        <span>{isRetrying ? 'Connecting...' : 'RETRY SYNC'}</span>
      </button>
    </div>
  );
};
