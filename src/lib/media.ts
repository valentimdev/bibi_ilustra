export type MediaDimensions = { width: number; height: number };

/** Lê largura e altura de uma imagem ou vídeo no navegador. Null se não der. */
export async function getMediaDimensions(file: File): Promise<MediaDimensions | null> {
  const url = URL.createObjectURL(file);
  try {
    if (file.type.startsWith('video/')) {
      return await new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.onloadedmetadata = () =>
          resolve(
            video.videoWidth && video.videoHeight
              ? { width: video.videoWidth, height: video.videoHeight }
              : null
          );
        video.onerror = () => resolve(null);
        video.src = url;
      });
    }
    return await new Promise((resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve(
          img.naturalWidth && img.naturalHeight
            ? { width: img.naturalWidth, height: img.naturalHeight }
            : null
        );
      img.onerror = () => resolve(null);
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

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
