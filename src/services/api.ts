import { VideoMetadata, VideoResolution, Platform } from '../types';

// =========================================================================
// 🔑 RAPIDAPI / EXTERNAL EXTRACTOR CONFIGURATION
// You can insert your RapidAPI credentials or custom endpoint here:
// =========================================================================
export const EXTERNAL_API_CONFIG = {
  // Option 1: RapidAPI All-in-One Video Downloader (or TikTok/Instagram/Facebook Downloader)
  RAPIDAPI_KEY: (import.meta as any).env?.VITE_RAPIDAPI_KEY || '', // <-- PASTE YOUR RAPIDAPI KEY HERE (e.g. 'a1b2c3d4e5f6g7h8...')
  RAPIDAPI_HOST: (import.meta as any).env?.VITE_RAPIDAPI_HOST || 'social-download-all-in-one.p.rapidapi.com',
  RAPIDAPI_ENDPOINT: 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',

  // Option 2: Standard Cobalt / YTDL API endpoint
  COBALT_API_URL: (import.meta as any).env?.VITE_COBALT_API_URL || 'https://api.cobalt.tools/api/json',
};

export function detectPlatform(url: string): Platform {
  if (!url || typeof url !== 'string') return 'unknown';
  const clean = url.trim().toLowerCase();

  if (clean.includes('tiktok.com') || clean.includes('douyin.com')) return 'tiktok';
  if (clean.includes('instagram.com') || clean.includes('instagr.am')) return 'instagram';
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (
    clean.includes('facebook.com') ||
    clean.includes('fb.watch') ||
    clean.includes('fb.com') ||
    clean.includes('fb.gg') ||
    clean.includes('fb.me')
  ) return 'facebook';
  return 'unknown';
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Dynamically calls the backend API endpoint (/api/fetch-video) which uses
 * the configured RAPIDAPI_KEY and RAPIDAPI_HOST environment variables.
 */
export async function fetchVideoFromApi(url: string): Promise<VideoMetadata> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('Please enter a valid video link.');
  }

  if (!isValidUrl(cleanUrl)) {
    throw new Error('Please enter a valid HTTP or HTTPS video URL (e.g. from YouTube, TikTok, Instagram, or Facebook).');
  }

  try {
    const response = await fetch('/api/fetch-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: cleanUrl,
        apiKey: EXTERNAL_API_CONFIG.RAPIDAPI_KEY,
        host: EXTERNAL_API_CONFIG.RAPIDAPI_HOST,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || 'Failed to fetch video stream. Please check the URL or API Key.');
    }

    const data: VideoMetadata = await response.json();

    if (!data || !data.title || !data.resolutions || data.resolutions.length === 0) {
      throw new Error('Failed to fetch video stream. Please check the URL or API Key.');
    }

    return data;
  } catch (err: unknown) {
    console.error('API Fetch error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to fetch video stream. Please check the URL or API Key.';
    throw new Error(msg);
  }
}
