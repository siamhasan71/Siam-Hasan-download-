import React, { useState, useRef, useEffect } from 'react';
import { 
  Clipboard, 
  X, 
  ArrowRight, 
  Loader2, 
  Link2, 
  Check, 
  Sparkles,
  DownloadCloud
} from 'lucide-react';
import { Platform } from '../types';
import { detectPlatform } from '../utils/detector';
import { PLATFORM_INFO } from '../data/sampleVideos';

interface DownloadInputBarProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onFetch: (urlToFetch?: string) => void;
  onSelectPlatformSample: (platform: Platform) => void;
  onToast: (type: 'success' | 'info' | 'error', message: string) => void;
}

export const DownloadInputBar: React.FC<DownloadInputBarProps> = ({
  url,
  setUrl,
  isLoading,
  onFetch,
  onSelectPlatformSample,
  onToast,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  // Default to readonly so virtual keyboard doesn't pop up on mobile tap
  const [isReadOnly, setIsReadOnly] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const detectedPlatform = detectPlatform(url);

  const pasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        const inputEl = document.getElementById("linkInput") as HTMLInputElement | null;
        if (inputEl) {
          inputEl.value = text;
        }
        if (text && text.trim()) {
          setUrl(text.trim());
          setPasteSuccess(true);
          onToast('success', 'Link pasted from clipboard!');
          setTimeout(() => setPasteSuccess(false), 2000);

          // পেস্ট হওয়ার পর নিচে স্ক্রল করা
          window.scrollBy({
            top: 250, // কতটুকু নিচে নামবে তার পিক্সেল
            behavior: 'smooth'
          });
          return;
        } else {
          onToast('info', 'Clipboard is empty. Copy a link first!');
          return;
        }
      }
      setIsReadOnly(false);
      onToast('info', 'Please paste manually. Keyboard unlocked.');
    } catch (err) {
      console.error('Clipboard error: ', err);
      // Unlock keyboard so user can manually paste if browser blocks direct clipboard API
      setIsReadOnly(false);
      onToast('info', 'Clipboard access denied. Keyboard unlocked for manual paste.');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Expose pasteClipboard globally for direct onclick compatibility
  useEffect(() => {
    (window as unknown as { pasteClipboard: () => Promise<void> }).pasteClipboard = pasteClipboard;
    return () => {
      delete (window as unknown as { pasteClipboard?: () => Promise<void> }).pasteClipboard;
    };
  });

  const handleClear = () => {
    setUrl('');
    if (!isReadOnly) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onFetch();
    }
  };

  return (
    <div id="download-section" className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-6">
      {/* Central Input Box Container with Glassmorphism */}
      <div 
        className={`relative rounded-2xl p-2 sm:p-2.5 transition-all duration-300 ${
          isFocused 
            ? 'glass-panel-glow shadow-[0_0_40px_rgba(16,185,129,0.25)] border-emerald-500/50' 
            : 'glass-panel hover:border-slate-700/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Main Input Wrapper */}
          <div className="relative flex-1 flex items-center min-w-0">
            {/* Auto-detect Icon badge */}
            <div className="pl-3.5 pr-2 flex items-center justify-center pointer-events-none select-none">
              {detectedPlatform === 'youtube' && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  YouTube
                </div>
              )}
              {detectedPlatform === 'tiktok' && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  TikTok
                </div>
              )}
              {detectedPlatform === 'instagram' && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  Instagram
                </div>
              )}
              {detectedPlatform === 'facebook' && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Facebook
                </div>
              )}
              {detectedPlatform === 'unknown' && (
                <Link2 className="w-5 h-5 text-slate-400 stroke-[2]" />
              )}
            </div>

            {/* The Text Input - readonly used to prevent mobile keyboard from popping up */}
            <input
              ref={inputRef}
              id="linkInput"
              type="text"
              readOnly={isReadOnly}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onClick={() => {
                // If readonly and empty, tapping directly pastes from clipboard without keyboard popup
                if (isReadOnly && !url.trim()) {
                  pasteClipboard();
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={isReadOnly ? "Paste link here" : "Type or paste video link here..."}
              className={`w-full py-3.5 pl-2 pr-32 sm:pr-36 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none ${
                isReadOnly ? 'cursor-pointer select-none sm:select-text' : 'cursor-text'
              }`}
            />

            {/* Action Buttons inside Input (Clear, Keyboard Toggle & Paste) */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {/* Clear button */}
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Clear input"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Mode Toggle: No Keyboard vs Keyboard */}
              <button
                type="button"
                onClick={() => {
                  if (isReadOnly) {
                    setIsReadOnly(false);
                    onToast('info', 'Keyboard enabled for manual typing');
                    setTimeout(() => inputRef.current?.focus(), 50);
                  } else {
                    setIsReadOnly(true);
                    onToast('info', 'No-keyboard mode activated (Fast paste)');
                  }
                }}
                className={`p-1.5 rounded-lg border transition text-xs flex items-center gap-1 cursor-pointer ${
                  isReadOnly 
                    ? 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60' 
                    : 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                }`}
                title={isReadOnly ? "Keyboard is hidden. Click to enable typing" : "Keyboard enabled. Click to disable"}
                aria-label={isReadOnly ? "Enable keyboard" : "Disable keyboard"}
              >
                {isReadOnly ? (
                  <span className="text-[11px] font-medium hidden sm:inline text-slate-400">Type</span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-300 hidden sm:inline">Editing</span>
                )}
              </button>

              {/* Prominent Paste Button */}
              <button
                type="button"
                onClick={pasteClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 active:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Paste link from clipboard"
              >
                {pasteSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in" />
                    <span className="text-emerald-400 font-bold">Pasted</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Paste</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Fetch Video Glowing Action Button */}
          <button
            type="button"
            disabled={isLoading || !url.trim()}
            onClick={() => onFetch()}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
              !url.trim()
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'emerald-glow-btn text-slate-950 font-extrabold shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4 stroke-[2.5]" />
                <span>Fetch Video</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Brand Badges Underneath (with smooth hover effects) */}
      <div className="mt-5 flex flex-col items-center">
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-3">
          Supported High-Speed Platforms
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
          {/* YouTube */}
          <button
            type="button"
            onClick={() => onSelectPlatformSample('youtube')}
            className={`group relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
              detectedPlatform === 'youtube'
                ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-slate-900/60 border-slate-800/90 hover:border-red-500/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
              {/* YouTube SVG */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                YouTube
              </div>
              <div className="text-[10px] text-slate-400">4K & Shorts</div>
            </div>
          </button>

          {/* TikTok */}
          <button
            type="button"
            onClick={() => onSelectPlatformSample('tiktok')}
            className={`group relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
              detectedPlatform === 'tiktok'
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-black border border-cyan-500/40 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              {/* TikTok SVG */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.14 1.18 2.07 2.3 2.34 1.05.27 2.22-.01 3.01-.76.77-.73 1.19-1.81 1.18-2.87.02-4.57.01-9.14.01-13.71z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                TikTok
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">No Watermark</div>
            </div>
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={() => onSelectPlatformSample('instagram')}
            className={`group relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
              detectedPlatform === 'instagram'
                ? 'bg-pink-950/40 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                : 'bg-slate-900/60 border-slate-800/90 hover:border-pink-500/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-md shadow-pink-600/30 group-hover:scale-105 transition-transform">
              {/* Instagram SVG */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                Instagram
              </div>
              <div className="text-[10px] text-slate-400">Reels & Audio</div>
            </div>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => onSelectPlatformSample('facebook')}
            className={`group relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
              detectedPlatform === 'facebook'
                ? 'bg-blue-950/40 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                : 'bg-slate-900/60 border-slate-800/90 hover:border-blue-500/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              {/* Facebook SVG */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                Facebook
              </div>
              <div className="text-[10px] text-slate-400">Watch & Clips</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
