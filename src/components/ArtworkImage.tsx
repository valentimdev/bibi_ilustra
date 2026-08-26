'use client';

import Image, { type ImageProps } from 'next/image';
import React from 'react';

type ArtworkImageProps = ImageProps & {
  loadingVariant?: 'shimmer' | 'blur-only';
  placeholderClassName?: string;
};

const loadedMediaSources = new Set<string>();

export function hasLoadedMedia(src: string) {
  return loadedMediaSources.has(src);
}

export function markMediaAsLoaded(src: string) {
  loadedMediaSources.add(src);
}

export default function ArtworkImage({
  alt,
  className,
  loadingVariant = 'shimmer',
  placeholderClassName,
  onLoad,
  ...props
}: ArtworkImageProps) {
  const source =
    typeof props.src === 'string'
      ? props.src
      : 'src' in props.src
        ? props.src.src
        : props.src.default.src;
  const [isLoaded, setIsLoaded] = React.useState(() => hasLoadedMedia(source));
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const showPlaceholder = loadingVariant === 'shimmer' && !isLoaded;

  React.useLayoutEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      markMediaAsLoaded(source);
      setIsLoaded(true);
    } else {
      setIsLoaded(hasLoadedMedia(source));
    }
  }, [source]);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    markMediaAsLoaded(source);
    setIsLoaded(true);
    onLoad?.(event);
  };

  return (
    <>
      {showPlaceholder && (
        <div
          aria-hidden="true"
          className={[
            'artwork-placeholder absolute inset-0',
            placeholderClassName ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}

      <Image
        {...props}
        alt={alt}
        ref={imageRef}
        className={[
          className ?? '',
          loadingVariant === 'shimmer'
            ? 'transition-all duration-700 ease-out'
            : 'transition-[filter,transform] duration-500 ease-out',
          loadingVariant === 'shimmer'
            ? isLoaded
              ? 'opacity-100 blur-0 scale-100'
              : 'opacity-0 blur-2xl scale-[1.03]'
            : isLoaded
              ? 'opacity-100 blur-0 scale-100'
              : 'opacity-100 blur-xl scale-[1.01]',
        ]
          .filter(Boolean)
          .join(' ')}
        onLoad={handleLoad}
      />
    </>
  );
}
