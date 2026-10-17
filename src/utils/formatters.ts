/**
 * Format video duration string or seconds to a clean display (e.g. 02:45 or 1:15:30)
 */
export function formatDuration(duration?: string | number | null): string {
  if (duration === undefined || duration === null || duration === '') {
    return '00:00';
  }

  // If number of seconds was passed
  if (typeof duration === 'number') {
    if (isNaN(duration) || duration < 0) return '00:00';
    const totalSecs = Math.floor(duration);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const str = String(duration).trim();
  // If numeric string like "120"
  if (/^\d+$/.test(str)) {
    return formatDuration(parseInt(str, 10));
  }

  // If already in MM:SS or HH:MM:SS format
  return str;
}
