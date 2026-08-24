import {
  Bell,
  Check,
  HardDrive,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onLogout,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('Timetable · Alerts Enabled', {
          body: 'Class notification alerts are successfully enabled for your schedule.',
          icon: '/favicon.ico',
        });
        setNotificationSent(true);
        setTimeout(() => setNotificationSent(false), 3000);
      }
    }
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Next Class in 10 Minutes', {
        body: 'Mathematics for Computation (26MT1101) in Room F105.',
        icon: '/favicon.ico',
      });
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
    } else {
      requestNotificationPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[#E5E5E5] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-mono-code text-[#666666] uppercase font-bold">
              PREFERENCES
            </span>
            <h2 className="text-xl font-bold text-[#111111] font-display">
              Settings & Cache
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

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#111111]">
              <Bell className="w-4 h-4 text-[#111111]" />
              CLASS REMINDER NOTIFICATIONS
            </div>

            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111111] block">Browser Alerts</span>
                  <span className="text-[11px] text-[#666666]">
                    Notify prior to each lecture & lab starting
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => {
                    onUpdateSettings({ notificationsEnabled: e.target.checked });
                    if (e.target.checked && notificationPermission !== 'granted') {
                      requestNotificationPermission();
                    }
                  }}
                  className="w-4 h-4 rounded text-[#111111] accent-[#111111] cursor-pointer"
                />
              </div>

              {settings.notificationsEnabled && (
                <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
                  <span className="text-xs text-[#666666]">Send reminder:</span>
                  <select
                    value={settings.reminderLeadTime}
                    onChange={(e) => onUpdateSettings({ reminderLeadTime: Number(e.target.value) })}
                    className="bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono-code rounded-lg px-2.5 py-1 text-[#111111]"
                  >
                    <option value={5}>5 mins before</option>
                    <option value={10}>10 mins before</option>
                    <option value={15}>15 mins before</option>
                    <option value={30}>30 mins before</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={handleTestNotification}
                className="w-full py-1.5 px-3 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono-code font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                {notificationSent ? '✓ Sent Test Notification' : 'Send Test Notification'}
              </button>
            </div>
          </div>

          {/* Sync Frequency */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#111111]">
              <RefreshCw className="w-4 h-4 text-[#111111]" />
              AUTO BACKGROUND REFRESH
            </div>

            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111111] block">Refresh Rate</span>
                <span className="text-[11px] text-[#666666]">
                  Background sync interval with university ERP
                </span>
              </div>
              <select
                value={settings.autoRefresh}
                onChange={(e) => onUpdateSettings({ autoRefresh: e.target.value })}
                className="bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono-code rounded-lg px-2.5 py-1 text-[#111111]"
              >
                <option value="5m">Every 5 mins</option>
                <option value="10m">Every 10 mins</option>
                <option value="30m">Every 30 mins</option>
                <option value="off">Disabled (Manual Only)</option>
              </select>
            </div>
          </div>

          {/* Offline Cache & Local Storage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#111111]">
              <HardDrive className="w-4 h-4 text-[#111111]" />
              OFFLINE CACHE STORAGE
            </div>

            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111111] block">Clear Cached Timetable</span>
                <span className="text-[11px] text-[#666666]">
                  Purge offline copy and reload latest from server
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('timetable_cache');
                  alert('Offline cache cleared successfully.');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono-code font-bold text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Clear Cache
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-mono-code font-bold hover:bg-[#FECACA] cursor-pointer"
          >
            LOG OUT
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-mono-code font-bold cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
