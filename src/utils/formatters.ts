/**
 * Format a duration in seconds to MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}