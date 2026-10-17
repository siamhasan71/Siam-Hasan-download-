import React from 'react';
import { History, X, Trash2, ArrowDownToLine, ExternalLink, Play } from 'lucide-react';
import { DownloadHistoryItem } from '../types';
import { formatDuration } from '../utils/formatters';

interface RecentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: DownloadHistoryItem) => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel-glow w-full max-w-lg rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Recent Downloads</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-950/30 transition cursor-pointer"
                title="Clear download history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No recent downloads yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Videos you download will appear here for fast re-access.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-emerald-500/40 flex items-center justify-between gap-3 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[9px] font-mono font-bold text-emerald-400 uppercase">
                      {item.platform}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 flex items-center flex-wrap gap-1.5 mt-0.5">
                      <span className="text-emerald-400 font-medium">{item.resolution}</span>
                      {item.duration && (
                        <>
                          <span>·</span>
                          <span className="duration-badge text-[10px] py-0 px-1.5">
                            ⏱️ {formatDuration(item.duration)}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>{item.downloadedAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectHistoryItem(item)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 transition shrink-0 cursor-pointer"
                  title="Open in Downloader"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          History is saved locally in your browser cache.
        </div>
      </div>
    </div>
  );
};
