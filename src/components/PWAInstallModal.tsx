import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  HelpCircle,
  Laptop,
  Layers,
  Phone,
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
    // Determine direct clean URL
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setDirectAppUrl(url);

      // Check if running inside iframe or preview
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
          title: 'KLNIGHT — Student Timetable App',
          text: 'Install KLNIGHT Timetable & Attendance App on your phone (Works 100% Offline):',
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
    directAppUrl || 'https://ais-pre-wimczufw2qgqeh7g2mtse5-582044349376.asia-southeast1.run.app'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl shadow-2xl overflow-hidden font-sans max-h-[92vh] flex flex-col"
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
                <span>Install KLNIGHT App</span>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#B8FF00] text-black">
                  PWA OFFLINE
                </span>
              </h3>
              <p className="text-xs text-[#A3A3A3]">Standalone Mobile App (No Internet Needed)</p>
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
          {/* EXPLANATION: Why 'Adding Preview Site' happens and how to fix */}
          <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-xs text-[#7F1D1D]">
              <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>"Adding Preview Site" Kyun Aa Raha Tha?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#991B1B]">
              Jab aap app ko AI Studio editor ya preview box ke andar dekh rahe hote hain, to phone AI Studio ka shortcut banane lagta hai. 
              <strong> Real App download karne ke liye ise direct phone browser me open karein.</strong>
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenDirect}
                className="px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>OPEN DIRECT IN CHROME / SAFARI</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#F3F4F6] text-[#7F1D1D] border border-[#FECACA] text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE TO PHONE</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#F3F4F6] text-[#7F1D1D] border border-[#FECACA] text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQR ? 'HIDE QR' : 'SCAN QR CODE'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Viewer if toggled */}
          {showQR && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] text-center space-y-3">
              <div className="text-xs font-bold text-[#111111] flex items-center justify-center gap-1.5 font-mono-code">
                <QrCode className="w-4 h-4 text-[#111111]" />
                <span>Scan from Mobile Camera / Google Lens</span>
              </div>
              <div className="inline-block p-2.5 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs">
                <img
                  src={qrCodeUrl}
                  alt="QR Code to install KLNIGHT"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-[11px] text-[#666666]">
                Phone ka camera ya Google Lens open karke scan karein, link direct <strong>Google Chrome</strong> me open hogi.
              </p>
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
                  NATIVE PROMPT
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
                  KLNIGHT aapke phone ke Home Screen par available hai aur offline 0s load ke sath work karega.
                </div>
              </div>
            </div>
          )}

          {/* Device Tabs */}
          <div>
            <div className="text-xs font-bold text-[#111111] mb-2 uppercase tracking-wide font-mono-code">
              Select Your Phone OS:
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
                <span>PC / Chrome</span>
              </button>
            </div>
          </div>

          {/* Android Steps (Exact Chrome UI Walkthrough) */}
          {deviceType === 'android' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Open in Google Chrome Browser</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Phone ke <strong>Google Chrome</strong> me link open karein.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Tap on 3 Dots (⋮) at top right</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Chrome ke top right corner me <strong>3 dots (⋮)</strong> menu par click karein.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-1">
                <div className="font-bold text-[#166534] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Tap "Install app" (या "Add to Home screen")</span>
                </div>
                <p className="text-[#15803D] text-[11px] pl-7">
                  Menu me <strong>"Install app"</strong> par click karein. Yeh app phone ke home screen aur app list me direct download ho jayegi!
                </p>
              </div>
            </div>
          )}

          {/* iPhone Steps (Exact Safari UI Walkthrough) */}
          {deviceType === 'ios' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Open in Safari Browser</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Link ko iPhone ke <strong>Safari</strong> browser me open karein.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <div className="font-bold text-[#111111] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Tap Share Button ( ⎋ ) at bottom</span>
                </div>
                <p className="text-[#666666] text-[11px] pl-7">
                  Safari ke bottom toolbar me <strong>Share</strong> button (बॉक्स से निकलता तीर) dabayein.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-1">
                <div className="font-bold text-[#166534] text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Tap "Add to Home Screen" (+)</span>
                </div>
                <p className="text-[#15803D] text-[11px] pl-7">
                  Menu me scroll karke <strong>"Add to Home Screen"</strong> select karein aur top right me <strong>Add</strong> dabayein.
                </p>
              </div>
            </div>
          )}

          {/* Desktop Steps */}
          {deviceType === 'desktop' && (
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
                <div className="font-bold text-[#111111] text-xs">
                  Chrome / Edge Address Bar Install:
                </div>
                <p className="text-[#666666] text-[11px]">
                  Browser ke URL bar ke right side me <strong>Install icon (⊕)</strong> par click karein aur <strong>Install</strong> dabayein.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E5E5] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#666666] flex items-center gap-1.5 font-mono-code">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>100% Offline Ready</span>
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
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
