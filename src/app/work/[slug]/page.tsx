// src/app/work/[slug]/page.tsx

import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getProjectBySlug, normalizeProjectSlug } from '@/lib/projectData';
import Link from 'next/link';
import ProjectMural from '@/components/ProjectMural';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { isEnabled } = await draftMode();
  const { slug } = await params;
  const normalizedSlug = normalizeProjectSlug(slug);

  if (slug !== normalizedSlug) {
    redirect(`/work/${normalizedSlug}`);
  }

  const project = await getProjectBySlug(normalizedSlug);

  if (!project || (!project.published && !isEnabled)) {
    notFound();
  }

  return (
    <section className="w-full pt-10 pb-10 ">

      <header className="text-center  py-4 mx-auto border border-purple-700">
        <div className=" flex items-center  justify-center relative  border border-red-600">
          <div className="absolute left-0">
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
          
      
          <div className="flex flex-col justify-center border border-amber-400">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              {project.title}
            </h1>
          </div>
        </div>
            <p className="mt-2 text-lg text-gray-500  ">{project.date}</p>
          
      
        
        <div className='border-yellow-500 flex px-20 '>
        <p className="mt-2 text-xl text-justify   text-gray-800 mx-auto ">
          {project.description}
        </p>
        </div>
      </header>

      <ProjectMural sections={project.muralSections} />
    </section>
  );
}
