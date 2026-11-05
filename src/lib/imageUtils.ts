// Qualidade e tamanho máximo (lado maior, em px) por tipo de upload.
// A transferência no R2 é gratuita, então a qualidade das ilustrações tem prioridade.
export const IMAGE_PRESETS = {
  // Aparece pequena na home: o peso importa mais que o detalhe.
  cover: { quality: 0.8, maxSize: 1200 },
  // Primeira seção "full" do mural: aparece grande e pode ser ampliada no lightbox.
  muralPresentation: { quality: 0.9, maxSize: 2560 },
  // Demais seções do mural (full, split, trio).
  muralSection: { quality: 0.9, maxSize: 2560 },
} as const;

export type ImagePresetName = keyof typeof IMAGE_PRESETS;

/**
 * Converte uma imagem para WebP pelo canvas do navegador, redimensionando
 * para no máximo `maxSize` px no lado maior.
 *
 * Devolve o arquivo original quando:
 * - não é imagem, ou é GIF (o canvas desenharia só o primeiro quadro);
 * - o navegador não gera WebP de verdade (ex.: Safari antigo devolve PNG);
 * - o WebP gerado sai maior que o original.
 *
 * Observação: o canvas trabalha em sRGB, então imagens em Display P3 ou
 * Adobe RGB podem mudar levemente de cor. Por isso o guia pede exportar em sRGB.
 */
export async function convertImageToWebP(
  file: File,
  quality: number = 0.8,
  maxSize?: number
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  const img = await loadImage(file);

  let width = img.naturalWidth;
  let height = img.naturalHeight;
  if (maxSize && Math.max(width, height) > maxSize) {
    const scale = maxSize / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível criar o contexto do canvas');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality)
  );

  if (!blob || blob.type !== 'image/webp') {
    console.warn('Navegador não gerou WebP; enviando o original.');
    return file;
  }

  if (blob.size >= file.size) {
    return file;
  }

  const newName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
  return new File([blob], newName, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erro ao carregar imagem para conversão'));
    };
    img.src = url;
  });
}
