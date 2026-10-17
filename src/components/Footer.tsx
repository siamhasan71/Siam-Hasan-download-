import React from 'react';
import { ArrowDownToLine, Heart, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#0B1120] py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-850">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <div className="text-sm font-extrabold text-white">
                Siam <span className="text-emerald-400">Downloader</span>
              </div>
              <div className="text-[11px] text-slate-400">
                All-in-One Social Video Extractor
              </div>
            </div>
          </div>

          {/* Supported Format Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-slate-300">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">MP4 (4K/1080p/720p)</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">MP3 (320kbps)</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">WEBM</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">No Watermark</span>
          </div>

          {/* Status info */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            <span>All Extraction Nodes Online</span>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-slate-400">
          <p className="max-w-xl text-[11px] leading-relaxed">
            <span className="font-semibold text-slate-300">Disclaimer:</span> Siam Downloader is a third-party utility tool created for educational and personal offline archiving under fair use. We do not host or store copyrighted media. All trademarks, logos, and brand names belong to their respective owners (YouTube, TikTok, Instagram, Meta/Facebook).
          </p>
          <div className="text-[11px] text-slate-400 shrink-0">
            © {new Date().getFullYear()} Siam Downloader. Engineered with modern SaaS precision.
          </div>
        </div>
      </div>
    </footer>
  );
};
