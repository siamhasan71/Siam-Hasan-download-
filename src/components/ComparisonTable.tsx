import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisonItems = [
    {
      feature: 'TikTok Watermark Removal',
      omnisnap: '100% Clean (No username logo / outro)',
      others: 'Often fails or leaves blurred boxes',
      omniBetter: true,
    },
    {
      feature: 'Resolution Support',
      omnisnap: 'Up to 4K Ultra HD & 60 FPS',
      others: 'Limited to 720p or compressed 480p',
      omniBetter: true,
    },
    {
      feature: 'Intrusive Popups & Ads',
      omnisnap: 'Zero popups, no shady redirects',
      others: 'Bombarded with spam ads & malware redirects',
      omniBetter: true,
    },
    {
      feature: 'Audio Extraction',
      omnisnap: 'High-Fidelity 320kbps MP3',
      others: 'Low-quality 128kbps or unavailable',
      omniBetter: true,
    },
    {
      feature: 'Processing Speed',
      omnisnap: '< 0.8 seconds multithreaded edge stream',
      others: 'Slow server queues with 30s delays',
      omniBetter: true,
    },
    {
      feature: 'Mobile Device Compatibility',
      omnisnap: 'Native iOS Safari & Android Chrome direct save',
      others: 'Requires installing suspicious APK/apps',
      omniBetter: true,
    },
  ];

  return (
    <section id="comparison" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quality Standard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Why Creators Choose Siam Downloader
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Compare our modern cloud engine against traditional download tools.
        </p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Capability / Feature</th>
                <th className="py-4 px-6 text-emerald-400 font-extrabold bg-emerald-950/20 border-x border-emerald-500/20">
                  Siam Downloader Engine
                </th>
                <th className="py-4 px-6 text-slate-400">Other Free Downloaders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {comparisonItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-300 bg-emerald-950/10 border-x border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                      <span>{item.omnisnap}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400/80 shrink-0 stroke-[2.5]" />
                      <span>{item.others}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
