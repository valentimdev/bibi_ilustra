// src/app/work/[slug]/page.tsx

import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import {
  getCachedPublishedSlugs,
  getProjectBySlug,
  getPublishedSlugs,
  isValidSlug,
  normalizeProjectSlug,
} from '@/lib/projectData';
import Link from 'next/link';
import ProjectMural from '@/components/ProjectMural';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

  return (
    <section className=" w-full px-0 pt-8 pb-10 sm:px-0 md:px-0">

      <header className="text-center py-4 mx-auto ">
        <div className="flex items-center justify-center relative ">
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
            <p className="mt-2 text-base sm:text-lg text-gray-500">{project.date}</p>
          
      
        
        <div className="flex px-0 pt-3 md:px-20">
        <p className="mx-auto max-w-none text-center text-base leading-7 text-gray-800 md:mt-2 md:text-xl md:text-justify">
          {project.description}
        </p>
        </div>
      </header>

      <ProjectMural sections={project.muralSections} />
    </section>
  );
}
