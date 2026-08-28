import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  HelpCircle,
  Laptop,
  Layers,
  Phone,
  Share2,
  Smartphone,
  Sparkles,
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
  const [copied, setCopied] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Check if running inside iframe (e.g. preview)
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

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

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement('input');
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Could not copy link:', err);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(currentUrl, '_blank');
  };

  const handleNativeInstall = async () => {
    if (onInstallPrompt) {
      setInstalling(true);
      try {
        const accepted = await onInstallPrompt();
        if (accepted) {
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      } finally {
        setInstalling(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl shadow-2xl overflow-hidden font-sans max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-[#111111] text-[#FFFFFF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/XrWyDBV0/image.png"
              alt="KLNIGHT App Icon"
              className="w-11 h-11 rounded-2xl object-contain bg-[#1C1C1C] p-1 border border-white/15 shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
                <span>Install KLNIGHT Mobile App</span>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#B8FF00] text-black">
                  OFFLINE
                </span>
              </h3>
              <p className="text-xs text-[#A3A3A3]">Add to Mobile Home Screen (0s Load & No Internet Needed)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* If inside preview iframe notification */}
          {isInIframe && (
            <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-[#B45309]" />
                <span>Mobile Browser Me Open Karein:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#78350F]">
                Phone me direct Home Screen pe add karne ke liye ise Chrome ya Safari browser me open karein.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="px-3 py-1.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN IN NEW TAB / BROWSER</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#92400E] border border-[#FCD34D] text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'LINK COPIED!' : 'COPY LINK'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 1-Click Direct Native Install if supported */}
          {canPromptNative && !isInstalled && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#111111] to-[#1F1F1F] text-white border border-[#333333] space-y-3 shadow-md">
              <div className="text-xs font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#B8FF00]">
                  <Sparkles className="w-4 h-4" />
                  <span>1-CLICK DIRECT INSTALL</span>
                </span>
                <span className="text-[10px] bg-[#16A34A] text-white px-2 py-0.5 rounded-full font-mono-code font-bold">
                  SUPPORTED
                </span>
              </div>
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={installing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#B8FF00] hover:bg-[#A3E600] text-black text-sm font-extrabold font-mono-code flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-black" />
                <span>{installing ? 'INSTALLING...' : 'INSTALL KLNIGHT APP NOW'}</span>
              </button>
            </div>
          )}

          {/* Already installed state */}
          {isInstalled && (
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] flex items-center gap-3 text-[#166534] text-xs font-semibold">
              <CheckCircle2 className="w-6 h-6 text-[#16A34A] shrink-0" />
              <div>
                <div className="font-bold">App Already Installed!</div>
                <div className="text-[11px] text-[#15803D] mt-0.5">
                  KLNIGHT aapke phone ke Home Screen par available hai aur offline work karega.
                </div>
              </div>
            </div>
          )}

          {/* Device Tabs */}
          <div>
            <div className="text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide font-mono-code">
              Select Your Device for Instructions:
            </div>
            <div className="flex rounded-xl bg-[#F3F4F6] p-1 text-xs font-mono-code font-bold text-[#666666]">
              <button
                type="button"
                onClick={() => setDeviceType('android')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deviceType === 'android'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#16A34A]" />
                <span>Android Phone</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceType('ios')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deviceType === 'ios'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Phone className="w-4 h-4 text-[#007AFF]" />
                <span>iPhone (iOS)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceType('desktop')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deviceType === 'desktop'
                    ? 'bg-white text-[#111111] shadow-xs'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Laptop className="w-4 h-4 text-[#666666]" />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* Android Steps */}
          {deviceType === 'android' && (
            <div className="space-y-3 text-xs text-[#333333]">
              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2.5">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Open in Google Chrome on your Phone</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Apne phone ke <strong>Google Chrome</strong> me link open karein.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2.5">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Tap on 3 Dots (⋮) Menu</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Chrome ke top right corner me <strong>3 dots (⋮)</strong> par click karein.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-2.5">
                <div className="font-bold text-[#166534] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Tap "Install app" ya "Add to Home screen"</span>
                </div>
                <p className="text-[#15803D] text-[11px] pl-7">
                  <strong>"Install"</strong> par tap karte hi app aapke mobile ke Home Screen aur App Drawer me download ho jayegi!
                </p>
              </div>
            </div>
          )}

          {/* iPhone Steps */}
          {deviceType === 'ios' && (
            <div className="space-y-3 text-xs text-[#333333]">
              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2.5">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Open in Safari Browser</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Ise apne iPhone ke <strong>Safari</strong> browser me open karein.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2.5">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Tap the Share Button ( <Share2 className="w-3.5 h-3.5 inline text-[#007AFF]" /> )</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Safari ke bottom bar me <strong>Share</strong> icon par tap karein.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-2.5">
                <div className="font-bold text-[#166534] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Tap "Add to Home Screen" (+)</span>
                </div>
                <p className="text-[#15803D] text-[11px] pl-7">
                  Menu me neeche scroll karke <strong>"Add to Home Screen"</strong> select karein aur <strong>Add</strong> par click karein.
                </p>
              </div>
            </div>
          )}

          {/* Desktop Steps */}
          {deviceType === 'desktop' && (
            <div className="space-y-3 text-xs text-[#333333]">
              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2">
                <div className="font-bold text-[#111111] text-xs">
                  Chrome / Edge Address Bar Install:
                </div>
                <p className="text-[#666666] text-[11px]">
                  Browser URL bar ke right side me <strong>Install icon (⊕)</strong> par click karein aur <strong>Install</strong> dabayein.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#666666] flex items-center gap-1.5 font-mono-code">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>PWA & Offline Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
