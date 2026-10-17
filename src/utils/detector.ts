import { Platform, VideoMetadata, VideoResolution } from '../types';
import { fetchVideoFromApi, detectPlatform, isValidUrl } from '../services/api';
import { formatDuration } from './formatters';

export { detectPlatform, isValidUrl, formatDuration };

export interface DownloadResult {
  success: boolean;
  filename: string;
}

/**
 * Dynamically fetch video metadata via API with real URL parsing
 */
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('Please provide a valid video link.');
  }

  try {
    return await fetchVideoFromApi(cleanUrl);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch video stream. Please check the URL or API Key.';
    throw new Error(msg);
  }
}

/**
 * Client-side download handler:
 * Forces the browser to start an immediate file download directly
 * (using stream blob or same-origin proxy with Content-Disposition: attachment).
 * Never opens video in a new tab or plays inline.
 */
export async function downloadMediaFile(
  video: VideoMetadata,
  resolution: VideoResolution,
  onProgress?: (percent: number) => void
): Promise<DownloadResult> {
  const directVideoUrl = resolution.downloadUrl || video.previewVideoUrl;

  if (!directVideoUrl || !isValidUrl(directVideoUrl)) {
    throw new Error('Failed to fetch video stream. Please check the URL or API Key.');
  }

  const safeTitle = (video.title || 'video')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 32);
  const ext = resolution.format === 'mp3' ? 'mp3' : 'mp4';
  const cleanRes = resolution.resolution.replace(/[^a-zA-Z0-9]/g, '');
  const filename = `SiamDownloader_${video.platform.toUpperCase()}_${cleanRes}_${safeTitle}.${ext}`;

  if (onProgress) onProgress(15);

  // Strategy 1: Attempt direct client-side blob fetching first (if CORS allowed)
  try {
    if (onProgress) onProgress(30);
    const directRes = await fetch(directVideoUrl, { mode: 'cors' });
    if (directRes.ok) {
      if (onProgress) onProgress(65);
      const blob = await directRes.blob();
      if (blob.size > 1024) {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
        }, 1500);

        if (onProgress) onProgress(100);
        return { success: true, filename };
      }
    }
  } catch (corsErr) {
    console.warn('Direct client blob fetch restricted by CORS, routing via streaming proxy with Content-Disposition headers', corsErr);
  }

  // Strategy 2: Proxy through server streaming endpoint (/api/download-stream)
  // Fetches stream blob through same-origin proxy
  const proxyUrl = `/api/download-stream?url=${encodeURIComponent(directVideoUrl)}&filename=${encodeURIComponent(filename)}`;

  try {
    if (onProgress) onProgress(50);
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      if (onProgress) onProgress(80);
      const blob = await proxyRes.blob();
      if (blob.size > 1024) {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
        }, 1500);

        if (onProgress) onProgress(100);
        return { success: true, filename };
      }
    }
  } catch (proxyBlobErr) {
    console.warn('Proxy blob in-memory fetch failed, triggering direct proxy download link', proxyBlobErr);
  }

  // Strategy 3: Trigger hidden <a> tag pointing directly to /api/download-stream
  // The server sends Content-Disposition: attachment; filename="${filename}"
  // which forces the browser to trigger a native file download directly without opening a new tab
  try {
    if (onProgress) onProgress(90);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
    }, 1000);

    if (onProgress) onProgress(100);
    return { success: true, filename };
  } catch (err: unknown) {
    console.error('All download mechanisms failed:', err);
    throw new Error('Failed to download video file. Please check connection or source URL.');
  }
}
