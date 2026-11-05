'use client';

import React from 'react';

type LazyVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  style?: React.CSSProperties;
  onLoadedData?: React.ReactEventHandler<HTMLVideoElement>;
};

/**
 * Vídeo mudo em loop que só começa a baixar perto de aparecer na tela,
 * toca quando está visível e pausa quando sai. Com prefers-reduced-motion,
 * mostra só o primeiro quadro.
 */
export default function LazyVideo({
  src,
  className,
  poster,
  style,
  onLoadedData,
}: LazyVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const isVisibleRef = React.useRef(false);
  const reducedMotionRef = React.useRef(false);
  const [shouldLoad, setShouldLoad] = React.useState(false);

  const tryPlay = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || reducedMotionRef.current || !video.getAttribute('src')) return;
    // play() rejeita se o navegador bloquear o autoplay; ignoramos.
    video.play().catch(() => {});
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (typeof IntersectionObserver === 'undefined') {
      isVisibleRef.current = true;
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          tryPlay();
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [tryPlay]);

  // Quando o src acaba de ser aplicado, começa a tocar se ainda estiver visível.
  React.useEffect(() => {
    if (shouldLoad && isVisibleRef.current) tryPlay();
  }, [shouldLoad, tryPlay]);

  // "#t=0.001" faz o iOS mostrar o primeiro quadro quando não há poster.
  const videoSrc = shouldLoad ? (poster ? src : `${src}#t=0.001`) : undefined;

  return (
    <video
      ref={videoRef}
      src={videoSrc}
      className={className}
      style={style}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      onLoadedData={onLoadedData}
    />
  );
}
