export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'unknown';

export interface VideoResolution {
  id: string;
  label: string; // e.g., "4K Ultra HD (2160p)"
  resolution: string; // "2160p" | "1080p" | "720p" | "480p" | "MP3"
  fps?: number;
  format: 'mp4' | 'mp3' | 'webm';
  size: string;
  bitrate?: string;
  noWatermark: boolean;
  recommended?: boolean;
  downloadUrl?: string;
}

export interface VideoMetadata {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
    verified: boolean;
  };
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  previewVideoUrl: string;
  audioUrl?: string;
  views: string;
  likes: string;
  date: string;
  resolutions: VideoResolution[];
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: Platform;
  thumbnailUrl: string;
  resolution: string;
  downloadedAt: string;
  url: string;
  duration?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}
