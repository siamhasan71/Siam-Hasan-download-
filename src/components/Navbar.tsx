import React from 'react';
import { History } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onScrollTo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onScrollTo('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <BrandLogo size="md" className="group-hover:scale-105 transition-transform duration-300" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Siam <span className="text-emerald-400">Downloader</span>
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              HD Social Video Extractor
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onScrollTo('download-section')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Downloader
          </button>
          <button
            onClick={() => onScrollTo('features')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => onScrollTo('how-it-works')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onScrollTo('comparison')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Why Siam Downloader
          </button>
          <button
            onClick={() => onScrollTo('faq')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          {/* Server Status pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            <span className="text-slate-300">Fast CDN v2.4</span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="View recent downloaded videos"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
