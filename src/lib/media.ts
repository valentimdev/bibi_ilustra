// Decide pela extensão do pathname, então funciona mesmo com query string
// (ex.: https://cdn.exemplo.com/a.mp4?v=2) ou fragmento (#t=0.001).
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const pathname = new URL(url, 'http://x').pathname.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}
