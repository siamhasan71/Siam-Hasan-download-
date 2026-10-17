import React from 'react';
import { Sparkles, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Platform } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeroHeaderProps {
  onSelectSample: (platform: Platform) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ onSelectSample }) => {
  return (
    <div id="hero" className="relative pt-6 sm:pt-10 pb-6 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Glow highlight orb behind headline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[220px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* App Icon Showcase */}
      <div className="flex justify-center mb-5">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
          <BrandLogo 
            size="2xl" 
            showGlow={true} 
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Top feature announcement pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs text-emerald-300 font-medium mb-5 shadow-lg shadow-emerald-950/40">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Next-Gen High Speed Video Extractor</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-300 font-semibold">100% Free & No Ads</span>
      </div>

      {/* Bold Catchy Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
          Siam Downloader
        </span>
        <span className="block mt-2 text-2xl sm:text-4xl lg:text-5xl text-slate-100 font-bold">
          Download HD Videos Without Watermark
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Save high-resolution clips from <span className="text-white font-semibold">YouTube</span>,{' '}
        <span className="text-white font-semibold">Facebook</span>,{' '}
        <span className="text-white font-semibold">Instagram Reels</span>, and{' '}
        <span className="text-white font-semibold">TikTok</span> in original quality. Fast, lossless, and directly to your device.
      </p>

      {/* Trust Badges */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Zero Watermarks Guaranteed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Ultra-Fast 60FPS Streams</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>No Login or Install Required</span>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Quick Sample:</span>
        <button
          onClick={() => onSelectSample('tiktok')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
        >
          🎵 TikTok Clip
        </button>
        <button
          onClick={() => onSelectSample('instagram')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
        >
          📸 Instagram Reel
        </button>
        <button
          onClick={() => onSelectSample('youtube')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
        >
          ▶️ YouTube 4K
        </button>
        <button
          onClick={() => onSelectSample('facebook')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
        >
          📘 Facebook Watch
        </button>
      </div>
    </div>
  );
};
