import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  HelpCircle,
  Laptop,
  Layers,
  Menu,
  MoreVertical,
  Phone,
  PlusSquare,
  QrCode,
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
  const [showQR, setShowQR] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [directAppUrl, setDirectAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setDirectAppUrl(url);

      try {
        setIsInIframe(window.self !== window.top);
      } catch (e) {
        setIsInIframe(true);
      }
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

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(directAppUrl);
      } else {
        const input = document.createElement('input');
        input.value = directAppUrl;
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KLNIGHT — Timetable & Attendance App',
          text: 'Open and Install KLNIGHT Timetable App (Works 100% Offline):',
          url: directAppUrl,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleOpenDirect = () => {
    window.open(directAppUrl, '_blank');
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

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    directAppUrl || 'https://klnight.vercel.app'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl shadow-2xl overflow-hidden font-sans max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#111111] text-[#FFFFFF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/XrWyDBV0/image.png"
              alt="KLNIGHT App Icon"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-contain bg-[#1C1C1C] p-1 border border-white/15 shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
                <span>Install KLNIGHT App</span>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#B8FF00] text-black">
                  OFFLINE
                </span>
              </h3>
              <p className="text-xs text-[#A3A3A3]">Add to Phone Home Screen (0s Load Time)</p>
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
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* If inside preview iframe */}
          {isInIframe && (
            <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-[#B45309]" />
                <span>Open in Mobile Chrome / Safari Browser:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#78350F]">
                Real App install karne ke liye ise direct phone browser me open karein.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenDirect}
                  className="px-3.5 py-1.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN IN DIRECT BROWSER</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#92400E] border border-[#FCD34D] text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
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
                  READY
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

          {/* Device Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wide font-mono-code">
                Installation Guide:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShare}
                  className="text-[11px] font-mono-code font-bold text-[#111111] bg-[#F3F4F6] hover:bg-[#E5E5E5] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3 h-3 text-[#111111]" />
                  <span>Share Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQR(!showQR)}
                  className="text-[11px] font-mono-code font-bold text-[#111111] bg-[#F3F4F6] hover:bg-[#E5E5E5] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3 h-3 text-[#111111]" />
                  <span>{showQR ? 'Hide QR' : 'QR Code'}</span>
                </button>
              </div>
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
                <span>Android (Chrome)</span>
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
                <span>Laptop</span>
              </button>
            </div>
          </div>

          {/* QR Code Viewer */}
          {showQR && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] text-center space-y-2">
              <div className="text-xs font-bold text-[#111111] flex items-center justify-center gap-1.5 font-mono-code">
                <QrCode className="w-4 h-4 text-[#111111]" />
                <span>Scan with Camera / Google Lens</span>
              </div>
              <div className="inline-block p-2 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </div>
              <p className="text-[10px] text-[#666666]">
                Scan to open in Google Chrome on your phone directly.
              </p>
            </div>
          )}

          {/* ANDROID VISUAL STEP BY STEP INSTRUCTIONS */}
          {deviceType === 'android' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              {/* Step 1: Top Right 3-dots */}
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#111111] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-mono-code">1</span>
                    <span>Chrome ke Top Right me 3 Dots (⋮) dabayein</span>
                  </div>
                  <div className="p-1 rounded-lg bg-[#111111] text-white flex items-center justify-center">
                    <MoreVertical className="w-4 h-4 text-[#B8FF00]" />
                  </div>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Screen ke bilkul upar right corner me <strong>3 dots (⋮)</strong> menu par click karein.
                </p>
              </div>

              {/* Step 2: Select Install App */}
              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border-2 border-[#16A34A] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#166534] text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-mono-code">2</span>
                    <span>"Install app" (या "Add to Home screen") select karein</span>
                  </div>
                  <div className="p-1 rounded-lg bg-[#16A34A] text-white flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-[#15803D] text-[11px] pl-7">
                  Menu me <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> option par tap karein.
                </p>
              </div>

              {/* Step 3: Confirmation */}
              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-mono-code">3</span>
                  <span>"Install" par tap karein</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  App aapke mobile ke <strong>Home Screen</strong> aur <strong>Apps list</strong> me direct download ho jayegi aur <strong>100% Offline</strong> chalegi!
                </p>
              </div>
            </div>
          )}

          {/* IPHONE (IOS) STEP BY STEP INSTRUCTIONS */}
          {deviceType === 'ios' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#007AFF] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#007AFF] text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[10px] font-mono-code">1</span>
                    <span>Safari ke bottom me Share icon ( ⎋ ) dabayein</span>
                  </div>
                  <div className="p-1 rounded-lg bg-[#007AFF] text-white flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Safari ke bottom toolbar me <strong>Share button</strong> par click karein.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border-2 border-[#16A34A] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#166534] text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-mono-code">2</span>
                    <span>"Add to Home Screen" (+) par tap karein</span>
                  </div>
                  <div className="p-1 rounded-lg bg-[#16A34A] text-white flex items-center justify-center">
                    <PlusSquare className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-[#15803D] text-[11px] pl-7">
                  Menu me neeche scroll karke <strong>"Add to Home Screen"</strong> chunein aur <strong>Add</strong> dabayein.
                </p>
              </div>
            </div>
          )}

          {/* DESKTOP INSTRUCTIONS */}
          {deviceType === 'desktop' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-2">
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
        <div className="p-3.5 sm:p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#666666] flex items-center gap-1.5 font-mono-code">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>PWA & Offline Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-white border border-[#E5E5E5] hover:bg-[#F3F4F6] text-xs font-mono-code font-bold text-[#111111] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
