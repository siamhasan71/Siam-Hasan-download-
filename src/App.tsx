/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { DownloadInputBar } from './components/DownloadInputBar';
import { ResultCard } from './components/ResultCard';
import { FeatureCards } from './components/FeatureCards';
import { HowItWorks } from './components/HowItWorks';
import { ComparisonTable } from './components/ComparisonTable';
import { RecentHistory } from './components/RecentHistory';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Platform, VideoMetadata, VideoResolution, DownloadHistoryItem, ToastMessage } from './types';
import { fetchVideoMetadata, isValidUrl } from './utils/detector';
import { SAMPLE_VIDEOS } from './data/sampleVideos';

export default function App() {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem('omnisnap_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, []);

  const addToast = (type: 'success' | 'info' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFetch = async (urlToFetch?: string) => {
    const targetUrl = (urlToFetch || url).trim();

    if (!targetUrl) {
      addToast('error', 'Please paste a valid video URL first.');
      return;
    }

    if (!isValidUrl(targetUrl)) {
      addToast('info', 'Analyzing link format with extraction engine...');
    }

    // Reset result card so mock or previous video is never shown during fetch
    setVideoData(null);
    setIsLoading(true);

    try {
      // Dynamic API request to extract real video data
      const metadata = await fetchVideoMetadata(targetUrl);
      if (!metadata || !metadata.title) {
        throw new Error('No video stream found for this URL.');
      }
      // Only show result card when real data returns
      setVideoData(metadata);
      addToast('success', `${metadata.platform.toUpperCase()} video successfully extracted!`);

      // Smooth scroll to result card
      setTimeout(() => {
        const el = document.getElementById('result-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setVideoData(null);
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to fetch video stream. Please check the URL or API Key.';
      addToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlatformSample = (platform: Platform) => {
    const sample = SAMPLE_VIDEOS[platform];
    if (sample) {
      setUrl(sample.url);
      handleFetch(sample.url);
    }
  };

  const handleRecordHistory = (video: VideoMetadata, resolution: VideoResolution) => {
    const newItem: DownloadHistoryItem = {
      id: `${video.id}-${Date.now()}`,
      title: video.title,
      platform: video.platform,
      thumbnailUrl: video.thumbnailUrl,
      resolution: resolution.label,
      downloadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      url: video.url,
      duration: video.duration,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((i) => i.url !== video.url)].slice(0, 15);
      try {
        localStorage.setItem('omnisnap_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('omnisnap_history');
    } catch (e) {}
    addToast('info', 'Download history cleared');
  };

  const handleSelectHistoryItem = (item: DownloadHistoryItem) => {
    setUrl(item.url);
    setIsHistoryOpen(false);
    handleFetch(item.url);
  };

  const handleReset = () => {
    setVideoData(null);
    setUrl('');
    const inputSection = document.getElementById('download-section');
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col relative selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background futuristic ambient mesh glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-[35%] -left-32 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-[60%] -right-32 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Main App Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar */}
        <Navbar
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onScrollTo={handleScrollTo}
        />

        <main className="flex-1">
          {/* Hero Header */}
          <HeroHeader onSelectSample={handleSelectPlatformSample} />

          {/* Central Download Bar (Main Focus) */}
          <DownloadInputBar
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onFetch={handleFetch}
            onSelectPlatformSample={handleSelectPlatformSample}
            onToast={addToast}
          />

          {/* Output Result Card (Appears after pasting URL / Fetching) */}
          {videoData && (
            <div id="result-section">
              <ResultCard
                video={videoData}
                onReset={handleReset}
                onRecordHistory={handleRecordHistory}
                onToast={addToast}
              />
            </div>
          )}

          {/* Quick Feature Cards */}
          <FeatureCards />

          {/* 3-Step Guide */}
          <HowItWorks />

          {/* Comparison Table */}
          <ComparisonTable />

          {/* FAQ Accordion Section */}
          <FaqSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* History Drawer / Modal */}
      <RecentHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
      />

      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
