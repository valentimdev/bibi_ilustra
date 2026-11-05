// Conversão de vídeo no navegador com Mediabunny (WebCodecs).
// Só é usado no painel admin; o Mediabunny é carregado com import() dinâmico
// para não entrar no bundle das páginas públicas.

export const VIDEO_PRESETS = {
  // Capa da home: quadrada, curta e leve.
  cover: {
    width: 1080,
    height: 1080,
    fit: 'cover' as const,
    maxFrameRate: 30,
    bitrate: 2_000_000,
    maxDuration: 15,
  },
  // Vídeos do mural: mantém a proporção, sem corte de duração.
  mural: {
    maxWidth: 1920,
    fit: 'contain' as const,
    maxFrameRate: 30,
    bitrate: 4_000_000,
  },
} as const;

export type VideoPresetName = keyof typeof VIDEO_PRESETS;

// Limites usados pela validação no ProjectForm.
export const VIDEO_LIMITS = {
  maxInputSize: 500 * 1024 * 1024, // acima disso o navegador pode travar
  coverMaxSize: 8 * 1024 * 1024,
  coverMaxDuration: 15,
  muralMaxSize: 50 * 1024 * 1024,
};

export class VideoConversionCanceledError extends Error {
  constructor() {
    super('Conversão cancelada');
    this.name = 'VideoConversionCanceledError';
  }
}

const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);

type Target = {
  codec: 'avc' | 'vp9';
  mimeType: 'video/mp4' | 'video/webm';
  ext: 'mp4' | 'webm';
};

const TARGETS: Target[] = [
  { codec: 'avc', mimeType: 'video/mp4', ext: 'mp4' },
  { codec: 'vp9', mimeType: 'video/webm', ext: 'webm' },
];

/**
 * Converte e comprime um vídeo. Devolve o original se o navegador não
 * conseguir converter, se der erro, ou se o resultado sair maior.
 * Lança VideoConversionCanceledError se `signal` for abortado.
 */
export async function convertVideo(
  file: File,
  preset: VideoPresetName,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<File> {
  try {
    if (typeof window === 'undefined' || !('VideoEncoder' in window)) {
      console.warn('WebCodecs indisponível; enviando o vídeo original.');
      return file;
    }

    const mb = await import('mediabunny');

    for (const target of TARGETS) {
      if (signal?.aborted) throw new VideoConversionCanceledError();

      const input = new mb.Input({
        source: new mb.BlobSource(file),
        formats: mb.ALL_FORMATS,
      });

      try {
        const videoTrack = await input.getPrimaryVideoTrack();
        if (!videoTrack) {
          console.warn('Arquivo sem faixa de vídeo; enviando o original.');
          return file;
        }

        const srcWidth = await videoTrack.getDisplayWidth();
        const srcHeight = await videoTrack.getDisplayHeight();
        const duration = await input.computeDuration();

        let frameRate: number | undefined;
        try {
          const stats = await videoTrack.computePacketStats(100);
          if (stats.averagePacketRate > 30.5) frameRate = 30;
        } catch {
          frameRate = 30;
        }

        let width: number;
        let height: number;
        let fit: 'cover' | 'contain';
        let bitrate: number;
        let trimEnd: number | undefined;

        if (preset === 'cover') {
          const p = VIDEO_PRESETS.cover;
          // Não aumenta vídeos menores que 1080 px.
          const side = even(Math.min(p.width, srcWidth, srcHeight));
          width = side;
          height = side;
          fit = p.fit;
          bitrate = p.bitrate;
          if (duration > p.maxDuration) trimEnd = p.maxDuration;
        } else {
          const p = VIDEO_PRESETS.mural;
          width = even(Math.min(p.maxWidth, srcWidth));
          height = even((width * srcHeight) / srcWidth);
          fit = p.fit;
          bitrate = p.bitrate;
        }

        const format =
          target.ext === 'mp4'
            ? new mb.Mp4OutputFormat({ fastStart: 'in-memory' })
            : new mb.WebMOutputFormat();
        const bufferTarget = new mb.BufferTarget();
        const output = new mb.Output({ format, target: bufferTarget });

        const conversion = await mb.Conversion.init({
          input,
          output,
          video: {
            width,
            height,
            fit,
            frameRate,
            codec: target.codec,
            quality: new mb.Quality({ bitrate }),
            forceTranscode: true,
          },
          // O site toca todos os vídeos sem som.
          audio: { discard: true },
          trim: trimEnd !== undefined ? { start: 0, end: trimEnd } : undefined,
          showWarnings: false,
        });

        const videoDiscarded = conversion.discardedTracks.some(
          (d) => d.track.type === 'video'
        );
        if (!conversion.isValid || videoDiscarded) {
          console.warn(
            `Não foi possível codificar em ${target.codec}:`,
            conversion.discardedTracks.map((d) => d.reason)
          );
          continue; // tenta o próximo codec
        }

        const onAbort = () => void conversion.cancel();
        signal?.addEventListener('abort', onAbort, { once: true });
        if (onProgress) conversion.onProgress = (p) => onProgress(p);

        try {
          await conversion.execute();
        } catch (err) {
          if (signal?.aborted || err instanceof mb.ConversionCanceledError) {
            throw new VideoConversionCanceledError();
          }
          throw err;
        } finally {
          signal?.removeEventListener('abort', onAbort);
        }

        const buffer = bufferTarget.buffer;
        if (!buffer) return file;
        // Se saiu maior, fica o original, exceto quando houve corte de duração:
        // nesse caso o original passaria do limite de 15 s da capa.
        if (buffer.byteLength >= file.size && trimEnd === undefined) {
          return file;
        }

        const name = file.name.replace(/\.[^/.]+$/, '') + '.' + target.ext;
        return new File([buffer], name, {
          type: target.mimeType,
          lastModified: Date.now(),
        });
      } finally {
        input.dispose();
      }
    }

    console.warn('Nenhum codec disponível para converter; enviando o original.');
    return file;
  } catch (error) {
    if (error instanceof VideoConversionCanceledError) throw error;
    console.warn('Falha ao converter vídeo; enviando o original.', error);
    return file;
  }
}

/** Lê a duração (em segundos) com um <video> temporário. */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível ler o vídeo'));
    };
    video.src = url;
  });
}
