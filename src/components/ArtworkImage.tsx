'use client';

import Image, { type ImageProps } from 'next/image';
import React from 'react';

type ArtworkImageProps = ImageProps & {
  loadingVariant?: 'shimmer' | 'blur-only';
  placeholderClassName?: string;
};

export default function ArtworkImage({
  alt,
  className,
  loadingVariant = 'shimmer',
  placeholderClassName,
  ...props
}: ArtworkImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const showPlaceholder = loadingVariant === 'shimmer' && !isLoaded;

  React.useEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

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
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}
