import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Lock, 
  Cpu, 
  Layers, 
  Check 
} from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Ultra-Fast Server Processing',
      subtitle: '<0.4s Link Resolution',
      description: 'Distributed multithreaded edge cluster strips server latency and resolves video sources in milliseconds.',
      highlight: '100% Direct CDN Streams',
    },
    {
      icon: Sparkles,
      title: 'No Watermark Guarantee',
      subtitle: 'Tailored for TikTok & Reels',
      description: 'Proprietary bypass algorithms strip floating logo stamps, username watermarks, and ending credit cards completely.',
      highlight: 'Original Uncompressed Bitrate',
    },
    {
      icon: Lock,
      title: 'Fully Secure & Anonymous',
      subtitle: 'Zero Data Retention',
      description: 'No login required, no tracking cookies, and no storage of your parsed video links. Encrypted in-flight via TLS 1.3.',
      highlight: 'Safe & Clean Downloads',
    },
    {
      icon: Smartphone,
      title: 'Cross-Device & Responsive',
      subtitle: 'iOS, Android, Mac & PC',
      description: 'Flawlessly optimized for mobile safari, android chrome, tablets, and desktop browsers without installing apps.',
      highlight: 'Native Browser Storage',
    },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Next-Generation Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Engineered for Instant HD Downloads
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Everything you need to grab clean, high-framerate clips from your favorite platforms without software bloat.
        </p>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-panel group relative rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Corner soft accent glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400/60 group-hover:bg-emerald-950/30 transition-all duration-300 mb-5 shadow-inner">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                {/* Subtitle badge */}
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-1 font-semibold">
                  {item.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-200 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Feature Spec highlight */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{item.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
