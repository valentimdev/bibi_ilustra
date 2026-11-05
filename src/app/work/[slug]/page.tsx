// src/app/work/[slug]/page.tsx

import Image from 'next/image';
import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import {
  getCachedPublishedSlugs,
  getProjectBySlug as fetchProjectBySlug,
  getPublishedSlugs,
  isValidSlug,
  normalizeProjectSlug,
  type ProjectData,
} from '@/lib/projectData';
import { isVideoUrl } from '@/lib/media';
import { SITE_DESCRIPTION } from '@/lib/site';
import Link from 'next/link';
import ProjectBody from '@/components/ProjectBody';
import ProjectSubtitle from '@/components/ProjectSubtitle';
import ProjectHero from '@/components/ProjectHero';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Deduplica a consulta entre generateMetadata e a página no mesmo render.
const getProjectBySlug = cache(fetchProjectBySlug);

// Mesmas proteções da página: slug com formato válido e presente na lista
// em cache de publicados. Só então consulta o projeto.
async function findPublishedProject(slug: string): Promise<ProjectData | null> {
  const normalizedSlug = normalizeProjectSlug(slug);
  if (!isValidSlug(normalizedSlug)) return null;

  const publishedSlugs = await getCachedPublishedSlugs();
  if (!publishedSlugs.includes(normalizedSlug)) return null;

  const project = await getProjectBySlug(normalizedSlug);
  return project && project.published ? project : null;
}

// Primeira imagem que não é vídeo: capa, depois a apresentação (primeira
// seção "full"), depois qualquer imagem do mural.
function pickShareImage(project: ProjectData): string | undefined {
  const isImage = (url?: string) => !!url && !isVideoUrl(url);

  if (isImage(project.coverImage)) return project.coverImage;

  const firstFull = project.muralSections.find((s) => s.type === 'full');
  if (firstFull?.type === 'full' && isImage(firstFull.imageUrl)) {
    return firstFull.imageUrl;
  }

  for (const section of project.muralSections) {
    const urls =
      section.type === 'full'
        ? [section.imageUrl]
        : section.type === 'split' || section.type === 'trio'
          ? section.imagesUrl
          : [];
    const found = urls.find(isImage);
    if (found) return found;
  }

  return undefined;
}

function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + '…';
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await findPublishedProject(slug);

  if (!project) {
    return { title: 'Projeto não encontrado' };
  }

  const description = truncate(project.description) || SITE_DESCRIPTION;
  const url = `/work/${project.slug}`;
  const image = pickShareImage(project);
  const images = image ? [{ url: image, alt: project.title }] : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description,
      url,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

// Gera no build as páginas dos projetos publicados. Projetos novos continuam
// funcionando sem novo build, porque dynamicParams fica no padrão (true).
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeProjectSlug(slug);

  // Slug com formato inválido nem chega ao banco.
  if (!isValidSlug(normalizedSlug)) {
    notFound();
  }

  if (slug !== normalizedSlug) {
    redirect(`/work/${normalizedSlug}`);
  }

  // Endereços inventados param aqui, usando só a lista em cache.
  const publishedSlugs = await getCachedPublishedSlugs();
  if (!publishedSlugs.includes(normalizedSlug)) {
    notFound();
  }

  const project = await getProjectBySlug(normalizedSlug);

  if (!project || !project.published) {
    notFound();
  }

  // Se a primeira seção do mural for "full", ela vira o header do projeto:
  // aparece antes do título, ocupando toda a largura, e sai do mural.
  const [firstSection, ...restSections] = project.muralSections;
  const hero = firstSection?.type === 'full' && firstSection.imageUrl ? firstSection : null;
  const muralSections = hero ? restSections : project.muralSections;

  return (
    <section className={`w-full px-0 pb-10 sm:px-0 md:px-0 ${hero ? '' : 'pt-8'}`}>
      {hero && (
        <ProjectHero
          src={hero.imageUrl}
          alt={hero.alt || project.title}
          title={project.title}
          date={project.date}
          category={project.category}
          width={hero.width}
          height={hero.height}
        />
      )}

      <header className={`text-center mx-auto ${hero ? 'pt-6 md:hidden' : 'py-4'}`}>
        <div className={`flex items-center justify-center relative ${hero ? 'md:hidden' : ''}`}>
          <div className="absolute left-0 hidden md:block">
            <Link href="/">
              <button className="cursor-pointer">
                <Image
                  src="/icons/arrow-badge-left.svg"
                  alt="Voltar"
                  width={42}
                  height={42}
                  className="cursor-pointer"
                />
              </button>
            </Link>
          </div>
          
      
          <div className="flex flex-col justify-center ">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
              {project.title}
            </h1>
          </div>
        </div>
            <ProjectSubtitle
              date={project.date}
              category={project.category}
              className="mt-2 text-base sm:text-lg text-gray-500"
            />
          
      
      </header>

      <ProjectBody
        description={project.description}
        sections={muralSections}
      />
    </section>
  );
}
