import Image from 'next/image';
import Link from 'next/link';
import ArtworkImage from '@/components/ArtworkImage';
import LazyVideo from '@/components/LazyVideo';
import { isVideoUrl } from '@/lib/media';
import ProjectSubtitle from '@/components/ProjectSubtitle';

type ProjectHeroProps = {
  src: string;
  alt: string;
  title: string;
  date: string;
  category: string;
  width?: number;
  height?: number;
};

// Altura máxima: a tela menos o header do site (120 px), para o título,
// que fica no rodapé da arte, aparecer sem rolar.
const MEDIA_CLASS =
  'block w-full h-auto object-cover object-center md:max-h-[calc(100svh-120px)]';

// Primeira arte do projeto, como capa da página: largura cheia, de ponta a
// ponta. No computador, o título e a data ficam por cima do rodapé da arte,
// sobre um degradê. No celular, a página mostra o título abaixo da arte.
// As margens negativas anulam o padding lateral do <main> (AppShell).
export default function ProjectHero({
  src,
  alt,
  title,
  date,
  category,
  width,
  height,
}: ProjectHeroProps) {
  // Com as dimensões gravadas no upload, o espaço da capa já é reservado
  // antes de a mídia carregar, e a página não pula.
  const sizeStyle =
    width && height ? { aspectRatio: `${width} / ${height}` } : undefined;

  return (
    <div className="relative -mx-8 sm:-mx-12 lg:-mx-16 overflow-hidden bg-neutral-900">
      {isVideoUrl(src) ? (
        <LazyVideo src={src} className={MEDIA_CLASS} style={sizeStyle} />
      ) : (
        <ArtworkImage
          unoptimized
          priority
          src={src}
          alt={alt}
          width={2560}
          height={0}
          sizes="100vw"
          loadingVariant="blur-only"
          className={MEDIA_CLASS}
          style={sizeStyle}
        />
      )}

      <Link
        href="/"
        aria-label="Voltar para os projetos"
        className="absolute left-12 lg:left-16 top-6 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <Image src="/icons/arrow-badge-left.svg" alt="" width={28} height={28} />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden md:block bg-gradient-to-t from-black/80 via-black/40 to-transparent px-12 lg:px-16 pb-10 pt-40">
        <h1 className="max-w-4xl text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          {title}
        </h1>
        <ProjectSubtitle
          date={date}
          category={category}
          className="mt-3 text-lg text-[var(--accent)]"
        />
      </div>
    </div>
  );
}
