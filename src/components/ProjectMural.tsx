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
  children?: React.ReactNode;
  coverPosition?: 'before-header' | 'default';
};

type LightboxMedia = {
  alt: string;
  src: string;
  type: 'image' | 'video';
};

type PresentationArtwork = {
  alt: string;
  src: string;
};

const isVideo = (url: string) => {
  return (
    url.toLowerCase().endsWith('.mp4') ||
    url.toLowerCase().endsWith('.webm') ||
    url.toLowerCase().endsWith('.mov')
  );
};

const getPresentationArtwork = (
  sections: MuralSection[]
): PresentationArtwork | null => {
  const firstSection = sections[0];

  if (!firstSection || firstSection.type !== 'full' || isVideo(firstSection.imageUrl)) {
    return null;
  }

  return {
    alt: firstSection.alt,
    src: firstSection.imageUrl,
  };
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
      className="relative block h-full w-full cursor-zoom-in focus:outline-none focus:ring-0"
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

function PresentationArtworkCover({
  artwork,
  onOpen,
}: {
  artwork: PresentationArtwork;
  onOpen: (image: LightboxMedia) => void;
}) {
  return (
    <section
      className="relative mb-1 h-[25vh] sm:h-[50vh] md:h-[60vh] lg:h-[71vh] overflow-hidden bg-black -mx-8 sm:-mx-12 lg:-mx-16"
    >
      <ClickableArtwork
        src={artwork.src}
        alt={artwork.alt}
        fill
        sizes="100vw"
        className="object-cover object-center"
        onOpen={onOpen}
      />
    </section>
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

function LightboxArtworkImage({
  media,
  isZoomed,
}: {
  media: LightboxMedia;
  isZoomed: boolean;
}) {
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const [shouldFadeIn, setShouldFadeIn] = React.useState(
    () => !hasLoadedMedia(media.src)
  );

  React.useLayoutEffect(() => {
    const image = imageRef.current;

    if (hasLoadedMedia(media.src) || (image?.complete && image.naturalWidth > 0)) {
      markMediaAsLoaded(media.src);
      setShouldFadeIn(false);
    } else {
      setShouldFadeIn(true);
    }
  }, [media.src]);

  return (
    <Image
      unoptimized
      ref={imageRef}
      src={media.src}
      alt={media.alt}
      width={1800}
      height={1800}
      sizes="100vw"
      className={[
        'h-auto w-auto object-contain transition-[width,max-width,max-height] duration-300 ease-out',
        isZoomed
          ? 'max-h-none max-w-none w-[190vw] md:w-[150vw]'
          : 'max-h-[96vh] max-w-[96vw]',
        shouldFadeIn ? 'animate-fade-in' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onLoad={() => markMediaAsLoaded(media.src)}
    />
  );
}

function LightboxVideo({ media }: { media: LightboxMedia }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [shouldFadeIn, setShouldFadeIn] = React.useState(
    () => !hasLoadedMedia(media.src)
  );

  React.useLayoutEffect(() => {
    const video = videoRef.current;

    if (hasLoadedMedia(media.src) || (video && video.readyState >= 2)) {
      markMediaAsLoaded(media.src);
      setShouldFadeIn(false);
    } else {
      setShouldFadeIn(true);
    }
  }, [media.src]);

  return (
    <video
      ref={videoRef}
      src={media.src}
      className={[
        'h-auto w-auto max-h-[96vh] max-w-[96vw] object-contain',
        shouldFadeIn ? 'animate-fade-in' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      loop
      playsInline
      autoPlay
      muted
      tabIndex={-1}
      onClick={(event) => event.stopPropagation()}
      onLoadedData={() => markMediaAsLoaded(media.src)}
      onKeyDown={(event) => {
        if (event.key === ' ') {
          event.preventDefault();
        }
      }}
    />
  );
}

export default function ProjectMural({ sections, children, coverPosition = 'default' }: ProjectMuralProps) {
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

  const presentationArtwork = getPresentationArtwork(sections);
  const muralSections = presentationArtwork ? sections.slice(1) : sections;

  const coverElement = presentationArtwork ? (
    <PresentationArtworkCover
      artwork={presentationArtwork}
      onOpen={openLightbox}
    />
  ) : null;

  return (
    <>
      {coverPosition === 'before-header' ? (
        <>
          {coverElement}
          {children}
        </>
      ) : (
        <>
          {coverElement}
        </>
      )}

      <div className="space-y-1  mb-10 ">
        {muralSections.map((section, index) => (
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
          className="fixed inset-0 z-[100] overflow-auto bg-black/90"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="fixed right-4 top-3 z-[101] text-5xl leading-none text-[var(--primary)] cursor-pointer"
            onClick={closeLightbox}
            aria-label="Fechar imagem ampliada"
          >
            ×
          </button>

          <div
            className={[
              'relative flex min-h-screen min-w-full p-2 md:p-4',
              isZoomed
                ? 'items-start justify-center'
                : 'items-center justify-center',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {lightboxMedia.type === 'image' ? (
              <button
                type="button"
                className={[
                  'inline-flex items-center justify-center cursor-zoom-in focus:outline-none focus:ring-0',
                  isZoomed ? 'cursor-zoom-out' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsZoomed((current) => !current);
                }}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
                aria-label={isZoomed ? 'Reduzir zoom da imagem' : 'Aumentar zoom da imagem'}
              >
                <LightboxArtworkImage
                  media={lightboxMedia}
                  isZoomed={isZoomed}
                />
              </button>
            ) : (
              <LightboxVideo media={lightboxMedia} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
