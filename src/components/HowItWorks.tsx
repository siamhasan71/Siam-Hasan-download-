import React from 'react';
import { Copy, SlidersHorizontal, ArrowDownToLine, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Copy Video Link',
      description: 'Open TikTok, Instagram, YouTube, or Facebook. Tap the Share button and select "Copy Link".',
      icon: Copy,
      tip: 'Works on browser links or in-app shared URLs',
    },
    {
      step: '02',
      title: 'Paste & Fetch Stream',
      description: 'Paste the link into the Siam Downloader bar above. Our engine instantly analyzes and resolves the clean source.',
      icon: SlidersHorizontal,
      tip: 'Auto-detects platform and strips watermarks',
    },
    {
      step: '03',
      title: 'Save in 4K or MP3',
      description: 'Choose your desired resolution (4K, 1080p, 720p or MP3 Audio) and click Download directly to your device.',
      icon: ArrowDownToLine,
      tip: 'Saved straight to your gallery or downloads',
    },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How to Download in 3 Simple Steps
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          No third-party apps, no browser extensions, and no registration required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="glass-panel relative rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-400">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{item.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
