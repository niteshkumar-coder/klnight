import {
  CheckCircle2,
  Download,
  ExternalLink,
  HelpCircle,
  Laptop,
  Layers,
  Phone,
  Share2,
  Smartphone,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPrompt?: () => Promise<boolean>;
  canPromptNative: boolean;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallPrompt,
  canPromptNative,
  isInstalled,
}) => {
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('android');
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/Android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (onInstallPrompt) {
      setInstalling(true);
      try {
        const accepted = await onInstallPrompt();
        if (accepted) {
          setInstallSuccess(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      } finally {
        setInstalling(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-[#111111] text-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/XrWyDBV0/image.png"
              alt="KLNIGHT App Icon"
              className="w-10 h-10 rounded-xl object-contain bg-[#1C1C1C] p-1 border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-2">
                <span>Download KLNIGHT App</span>
                <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-[#B8FF00] text-black">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-[#A3A3A3]">Add to Mobile Home Screen & Work Offline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Key Advantages */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] flex items-start gap-2">
              <WifiOff className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#111111]">100% Offline Ready</div>
                <div className="text-[11px] text-[#666666] leading-tight mt-0.5">
                  View full schedule without internet
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E5E5] flex items-start gap-2">
              <Zap className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#111111]">Instant 0s Launch</div>
                <div className="text-[11px] text-[#666666] leading-tight mt-0.5">
                  Opens directly from Home Screen
                </div>
              </div>
            </div>
          </div>

          {/* Quick Install Action (Native Android / Desktop) */}
          {canPromptNative && !isInstalled && (
            <div className="p-4 rounded-xl bg-[#F3F4F6] border border-[#E5E5E5] space-y-3">
              <div className="text-xs font-bold text-[#111111] flex items-center justify-between">
                <span>1-CLICK DIRECT INSTALL</span>
                <span className="text-[10px] text-[#16A34A] font-mono-code font-bold">READY</span>
              </div>
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={installing}
                className="w-full py-3 px-4 rounded-xl bg-[#111111] hover:bg-black text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#B8FF00]" />
                <span>{installing ? 'INSTALLING APP...' : 'INSTALL KLNIGHT ON DEVICE'}</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] flex items-center gap-2.5 text-[#166534] text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
              <span>KLNIGHT is installed on this device and ready for offline use!</span>
            </div>
          )}

          {/* Device Selection Tabs */}
          <div className="pt-1">
            <div className="flex rounded-lg bg-[#F3F4F6] p-1 text-xs font-mono-code font-bold text-[#666666]">
              <button
                type="button"
                onClick={() => setDeviceType('android')}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  deviceType === 'android'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceType('ios')}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  deviceType === 'ios'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>iPhone (iOS)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceType('desktop')}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  deviceType === 'desktop'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* Step by Step Guides */}
          {deviceType === 'android' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="font-bold text-[#111111] font-mono-code text-[11px] uppercase tracking-wider">
                Android (Chrome / Samsung Internet):
              </div>
              <ol className="space-y-2 pl-1 list-decimal list-inside text-[#555555]">
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 1:</strong> Tap the <strong>three dots (⋮)</strong> menu in the top right corner of Chrome.
                </li>
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 2:</strong> Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </li>
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 3:</strong> Tap <strong>Install</strong>. KLNIGHT will appear on your app drawer & home screen with full offline access!
                </li>
              </ol>
            </div>
          )}

          {deviceType === 'ios' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="font-bold text-[#111111] font-mono-code text-[11px] uppercase tracking-wider">
                iPhone / iPad (Safari Browser):
              </div>
              <ol className="space-y-2 pl-1 list-decimal list-inside text-[#555555]">
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 1:</strong> Open this website in <strong>Safari</strong> and tap the <strong>Share ( <Share2 className="w-3.5 h-3.5 inline text-[#007AFF]" /> )</strong> button at the bottom.
                </li>
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 2:</strong> Scroll down and tap <strong>"Add to Home Screen" (+)</strong>.
                </li>
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 3:</strong> Tap <strong>"Add"</strong> in the top right. KLNIGHT will be available as an app on your Home Screen!
                </li>
              </ol>
            </div>
          )}

          {deviceType === 'desktop' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="font-bold text-[#111111] font-mono-code text-[11px] uppercase tracking-wider">
                Chrome / Edge on Desktop:
              </div>
              <ol className="space-y-2 pl-1 list-decimal list-inside text-[#555555]">
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 1:</strong> Click the <strong>Install icon (⊕)</strong> on the right side of the browser address bar.
                </li>
                <li className="p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <strong className="text-[#111111]">Step 2:</strong> Click <strong>Install</strong> to add KLNIGHT to your desktop / taskbar.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-between">
          <div className="text-[11px] text-[#666666] flex items-center gap-1.5 font-mono-code">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Service Worker Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E5E5E5] hover:bg-[#D4D4D4] text-[#111111] text-xs font-bold transition-colors cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
