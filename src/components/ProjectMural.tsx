'use client';

import React from 'react';
import Image from 'next/image';
import ArtworkImage, {
  hasLoadedMedia,
  markMediaAsLoaded,
} from '@/components/ArtworkImage';
import type { MuralSection } from '@/lib/projectData';

type ProjectMuralProps = {
  sections: MuralSection[];
};

type LightboxMedia = {
  alt: string;
  src: string;
  type: 'image' | 'video';
};

const isVideo = (url: string) => {
  return (
    url.toLowerCase().endsWith('.mp4') ||
    url.toLowerCase().endsWith('.webm') ||
    url.toLowerCase().endsWith('.mov')
  );
};

function ClickableArtwork({
  alt,
  src,
  fill = false,
  onOpen,
  sizes,
  width,
  height,
  className,
  style,
}: {
  alt: string;
  src: string;
  fill?: boolean;
  onOpen: (image: LightboxMedia) => void;
  sizes: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ src, alt, type: 'image' })}
      className="block h-full w-full cursor-zoom-in focus:outline-none focus:ring-0"
      aria-label={`Ampliar imagem: ${alt}`}
    >
      <ArtworkImage
        unoptimized
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        loadingVariant="blur-only"
        className={className}
        style={style}
      />
    </button>
  );
}

function ClickableVideo({
  alt,
  src,
  onOpen,
}: {
  alt: string;
  src: string;
  onOpen: (media: LightboxMedia) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ src, alt, type: 'video' })}
      className="block h-full w-full cursor-zoom-in focus:outline-none focus:ring-0"
      aria-label={`Ampliar video: ${alt}`}
    >
      <video
        src={src}
        className="w-full h-auto"
        loop
        playsInline
        autoPlay
        muted
        onLoadedData={() => markMediaAsLoaded(src)}
      />
    </button>
  );
}

export default function ProjectMural({ sections }: ProjectMuralProps) {
  const [lightboxMedia, setLightboxMedia] = React.useState<LightboxMedia | null>(
    null
  );
  const [isZoomed, setIsZoomed] = React.useState(false);

  React.useEffect(() => {
    if (!lightboxMedia) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
          return;
        }

        setLightboxMedia(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isZoomed, lightboxMedia]);

  const openLightbox = React.useCallback((media: LightboxMedia) => {
    setIsZoomed(false);
    setLightboxMedia(media);
  }, []);

  const closeLightbox = React.useCallback(() => {
    setIsZoomed(false);
    setLightboxMedia(null);
  }, []);

  return (
    <>
      <div className="space-y-1  mb-10 ">
        {sections.map((section, index) => (
          <div key={index}>
            {section.type === 'full' && (
              <div className="w-full flex justify-center  items-center ">
                <div className={`w-full flex justify-center  items-center px-0 ${isVideo(section.imageUrl) ? 'px-20' : ''}`}>
                  {isVideo(section.imageUrl) ? (
                    <ClickableVideo
                      src={section.imageUrl}
                      alt={section.alt}
                      onOpen={openLightbox}
                    />
                  ) : (
                    <ClickableArtwork
                      src={section.imageUrl}
                      alt={section.alt}
                      width={1400}
                      height={0}
                      sizes="(max-width: 1400px) 100vw, 1400px"
                      className="w-full h-auto"
                      style={{ height: 'auto' }}
                      onOpen={openLightbox}
                    />
                  )}
                </div>
              </div>
            )}

            {section.type === 'split' && (
              <div className="flex flex-col md:flex-row gap-1 md:gap-1">
                <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden ">
                  <ClickableArtwork
                    src={section.imagesUrl[0]}
                    alt={section.alts[0]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onOpen={openLightbox}
                  />
                </div>
                <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden">
                  <ClickableArtwork
                    src={section.imagesUrl[1]}
                    alt={section.alts[1]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onOpen={openLightbox}
                  />
                </div>
              </div>
            )}

            {section.type === 'trio' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-1">
                {section.imagesUrl.map((imageUrl, i) => (
                  <div
                    key={i}
                    className="w-full aspect-square relative overflow-hidden "
                  >
                    <ClickableArtwork
                      src={imageUrl}
                      alt={section.alts[i]}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      onOpen={openLightbox}
                    />
                  </div>
                ))}
              </div>
            )}

            {section.type === 'text' && (
              <div className=" px-3 py-8 md:py-8   ">
                <p className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap ">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 md:p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-3 z-[101] text-5xl leading-none text-[var(--primary)] cursor-pointer"
            onClick={closeLightbox}
            aria-label="Fechar imagem ampliada"
          >
            ×
          </button>

          <div
            className="relative flex h-[96vh] w-[96vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {lightboxMedia.type === 'image' ? (
              <button
                type="button"
                className={[
                  'flex h-full w-full items-center justify-center cursor-zoom-in overflow-auto focus:outline-none focus:ring-0',
                  isZoomed ? 'cursor-zoom-out' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setIsZoomed((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
                aria-label={isZoomed ? 'Reduzir zoom da imagem' : 'Aumentar zoom da imagem'}
              >
                <Image
                  unoptimized
                  src={lightboxMedia.src}
                  alt={lightboxMedia.alt}
                  width={1800}
                  height={1800}
                  sizes="100vw"
                  className={[
                    'max-h-full max-w-full object-contain transition-transform duration-300 ease-out',
                    hasLoadedMedia(lightboxMedia.src) ? '' : 'animate-fade-in',
                    isZoomed ? 'scale-[1.9]' : 'scale-100',
                  ].join(' ')}
                  onLoad={() => markMediaAsLoaded(lightboxMedia.src)}
                />
              </button>
            ) : (
              <video
                src={lightboxMedia.src}
                className={[
                  'max-h-full max-w-full object-contain',
                  hasLoadedMedia(lightboxMedia.src) ? '' : 'animate-fade-in',
                ].join(' ')}
                loop
                playsInline
                autoPlay
                muted
                tabIndex={-1}
                onLoadedData={() => markMediaAsLoaded(lightboxMedia.src)}
                onKeyDown={(event) => {
                  if (event.key === ' ') {
                    event.preventDefault();
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
