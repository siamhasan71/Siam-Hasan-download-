import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  FileAudio, 
  ShieldCheck, 
  Eye, 
  Heart, 
  Clock, 
  ChevronDown, 
  RefreshCw,
  ExternalLink,
  Layers,
  Music2,
  Film
} from 'lucide-react';
import { VideoMetadata, VideoResolution } from '../types';
import { downloadMediaFile } from '../utils/detector';
import { formatDuration } from '../utils/formatters';
import { EXTERNAL_API_CONFIG } from '../services/api';

// =========================================================================
// 🔑 RAPIDAPI / EXTERNAL EXTRACTOR CONFIGURATION
// Insert your RapidAPI Key or Endpoint in src/services/api.ts or .env:
// Example: EXTERNAL_API_CONFIG.RAPIDAPI_KEY = 'your_rapidapi_key_here';
// =========================================================================

interface ResultCardProps {
  video: VideoMetadata;
  onReset: () => void;
  onRecordHistory: (video: VideoMetadata, resolution: VideoResolution) => void;
  onToast: (type: 'success' | 'info' | 'error', message: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  video,
  onReset,
  onRecordHistory,
  onToast,
}) => {
  const videoData = video;
  const [selectedResId, setSelectedResId] = useState<string>(
    video.resolutions[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter resolutions based on active tab
  const videoResolutions = video.resolutions.filter((r) => r.format === 'mp4' || r.format === 'webm');
  const audioResolutions = video.resolutions.filter((r) => r.format === 'mp3');

  const currentList = activeTab === 'video' ? videoResolutions : audioResolutions;
  const activeResolution =
    video.resolutions.find((r) => r.id === selectedResId) ||
    currentList[0] ||
    video.resolutions[0];

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  /**
   * Immediate File Download Handler:
   * Forces an immediate client-side file download directly in the browser
   * using stream blob or proxy endpoint with Content-Disposition: attachment.
   * Never opens a new tab or plays inline.
   */
  const handleDownload = async (targetResolution?: VideoResolution) => {
    const resToDownload = targetResolution || activeResolution;
    if (!resToDownload || isDownloading) return;

    setIsDownloading(true);
    setDownloadProgress(10);
    setDownloadSuccess(false);

    try {
      const result = await downloadMediaFile(video, resToDownload, (progress) => {
        setDownloadProgress(progress);
      });

      setDownloadSuccess(true);
      onRecordHistory(video, resToDownload);
      onToast('success', `Downloading ${result.filename} directly to your device!`);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err: unknown) {
      console.error('Download error:', err);
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to download video stream. Please check the URL or API Key.';
      onToast('error', errorMessage);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(video.url);
        onToast('success', 'Original clean video link copied to clipboard!');
        return;
      }
    } catch (e) {
      console.warn('Clipboard writeText restricted by browser permissions policy, trying fallback:', e);
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = video.url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onToast('success', 'Original clean video link copied to clipboard!');
    } catch {
      onToast('info', `Link: ${video.url}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Top Header info bar */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            Ready to Download
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-medium capitalize">{video.platform} Stream Verified</span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Link</span>
        </button>
      </div>

      {/* Main Glassmorphic Card Container */}
      <div className="glass-panel-glow rounded-2xl overflow-hidden border border-emerald-500/30 p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Media Preview & Thumbnail */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative group rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-video lg:aspect-[4/3] border border-slate-800 shadow-2xl flex items-center justify-center">
              
              {/* Actual Video Player if playing */}
              <video
                ref={videoRef}
                src={video.previewVideoUrl}
                poster={video.thumbnailUrl}
                playsInline
                loop
                onEnded={() => setIsPlaying(false)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isPlaying ? 'opacity-100' : 'opacity-90 group-hover:scale-105'
                }`}
              />

              {/* Watermark-Free Seal Badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/85 backdrop-blur-md border border-emerald-400/40 text-[11px] font-bold text-emerald-300 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Watermark</span>
              </div>

              {/* Duration Badge */}
              <span className="duration-badge absolute bottom-3 right-3 z-20">
                ⏱️ {formatDuration(videoData.duration)}
              </span>

              {/* Center Play / Pause Action Button */}
              <button
                onClick={handlePlayToggle}
                className={`absolute z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isPlaying
                    ? 'opacity-0 group-hover:opacity-100 bg-black/60 text-white backdrop-blur-sm'
                    : 'bg-emerald-500/90 text-slate-950 shadow-xl shadow-emerald-500/40 scale-100 group-hover:scale-110'
                }`}
                title={isPlaying ? 'Pause preview' : 'Play preview'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Play className="w-6 h-6 fill-slate-950 stroke-[2.5] ml-0.5" />
                )}
              </button>

              {/* Sound Toggle (visible when playing) */}
              {isPlaying && (
                <button
                  onClick={handleMuteToggle}
                  className="absolute bottom-3 left-3 z-20 p-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white hover:text-emerald-400 border border-white/10 transition cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Author Profile Information */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={video.author.avatarUrl}
                  alt={video.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-white truncate">
                    <span>{video.author.name}</span>
                    {video.author.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {video.author.handle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-xs shrink-0 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {video.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  {video.likes}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Video Metadata & Download Options */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Video Title */}
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
                {video.title}
              </h2>

              {/* Video Meta & Duration Badge */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="duration-badge">
                  ⏱️ {formatDuration(videoData.duration)}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300">
                  <span className="capitalize">{videoData.platform}</span>
                </span>
                {videoData.date && (
                  <span className="text-xs text-slate-400 font-mono py-1">
                    {videoData.date}
                  </span>
                )}
              </div>

              {/* Mode Tabs: Video vs Audio */}
              <div className="mt-4 flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('video');
                    if (videoResolutions[0]) setSelectedResId(videoResolutions[0].id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video (MP4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('audio');
                    if (audioResolutions[0]) setSelectedResId(audioResolutions[0].id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'audio'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Music2 className="w-3.5 h-3.5" />
                  <span>Audio Only (MP3)</span>
                </button>
              </div>

              {/* Resolution Selector Dropdown / Grid Options */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Resolution / Quality
                </label>

                <div className="space-y-2">
                  {currentList.map((res) => {
                    const isSelected = res.id === activeResolution.id;
                    return (
                      <div
                        key={res.id}
                        onClick={() => setSelectedResId(res.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-500'
                                : 'border-slate-600'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                              <span>{res.label}</span>
                              {res.recommended && (
                                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  Best
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{res.format.toUpperCase()}</span>
                              <span>·</span>
                              <span>{res.size}</span>
                              {res.bitrate && (
                                <>
                                  <span>·</span>
                                  <span>{res.bitrate}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400">
                            No Watermark
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Download Buttons Section */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              {/* Download Progress Bar if downloading */}
              {isDownloading && (
                <div className="mb-3 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Downloading {activeResolution.label}...
                    </span>
                    <span className="font-mono font-bold text-white">
                      {downloadProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Direct high-speed stream. Cleaning watermark metadata...
                  </p>
                </div>
              )}

              {/* Success Notification Bar */}
              {downloadSuccess && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/50 flex items-center gap-2.5 text-xs text-emerald-300 font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>File downloaded cleanly! Check your browser's Downloads folder.</span>
                </div>
              )}

              {/* Primary Glowing Download Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() => handleDownload()}
                  className={`flex-1 w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 cursor-pointer shadow-lg ${
                    isDownloading
                      ? 'bg-slate-800 text-slate-400 cursor-wait'
                      : 'emerald-glow-btn text-slate-950'
                  }`}
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    Download {activeResolution.resolution} (No Watermark)
                  </span>
                </button>

                {/* Secondary Fast Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Copy direct shareable link"
                  >
                    <Share2 className="w-4 h-4 text-slate-300" />
                    <span className="sm:hidden">Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const audioOption = video.resolutions.find((r) => r.format === 'mp3');
                      if (audioOption) handleDownload(audioOption);
                    }}
                    className="flex-1 sm:flex-none p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-emerald-400 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Quick extract MP3 audio"
                  >
                    <FileAudio className="w-4 h-4" />
                    <span className="text-xs font-semibold">Get MP3</span>
                  </button>
                </div>
              </div>

              {/* Safe & Legal disclaimer note */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Direct SSL encrypted stream · Free & private
                </span>
                <span>Max Speed CDN</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
