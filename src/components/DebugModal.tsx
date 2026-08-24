import {
  Activity,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Server,
  Terminal,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ERPStatus } from '../types';

interface DebugModalProps {
  onClose: () => void;
}

export const DebugModal: React.FC<DebugModalProps> = ({ onClose }) => {
  const [debugInfo, setDebugInfo] = useState<ERPStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebug = async () => {
    setLoading(true);
    try {
      const data = await api.getDebugStatus();
      setDebugInfo(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebug();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl w-full max-w-xl overflow-hidden shadow-xl relative font-mono-code">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] border border-[#E5E5E5] flex items-center justify-center text-[#111111]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#666666] uppercase font-bold">
                DEVELOPER INSPECTOR
              </div>
              <h2 className="text-base font-bold text-[#111111] font-display">
                GATEWAY & SYNC STATUS
              </h2>
            </div>
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
        <div className="p-5 space-y-4 text-xs">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#111111]" />
              <span className="text-[#666666]">Querying gateway...</span>
            </div>
          ) : debugInfo ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                  <span className="text-[10px] text-[#666666] uppercase block">
                    Mode
                  </span>
                  <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5 mt-0.5">
                    <Server className="w-4 h-4 text-[#111111]" />
                    {debugInfo.mode.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                  <span className="text-[10px] text-[#666666] uppercase block">
                    Gateway Health
                  </span>
                  <span className="text-sm font-bold text-[#16A34A] flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                    ONLINE
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                  <span className="text-[10px] text-[#666666] uppercase block">
                    Timetable Entries
                  </span>
                  <span className="text-sm font-bold text-[#111111] mt-0.5 block">
                    {debugInfo.cachedEntries} Slots Loaded
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5]">
                  <span className="text-[10px] text-[#666666] uppercase block">
                    Response Latency
                  </span>
                  <span className="text-sm font-bold text-[#111111] mt-0.5 block">
                    {debugInfo.latencyMs}ms
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <span className="text-[10px] text-[#666666] uppercase block">
                  Active Adapter
                </span>
                <p className="text-xs text-[#111111]">{debugInfo.adapterInfo}</p>
                <div className="text-[10px] text-[#888888] pt-1">
                  Last Sync Timestamp: {new Date(debugInfo.lastSync).toLocaleString()}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-[#DC2626]">
              Could not retrieve debug information.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-between">
          <button
            type="button"
            onClick={fetchDebug}
            className="flex items-center gap-1 text-xs text-[#111111] hover:underline cursor-pointer font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> RE-PING GATEWAY
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-bold cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
