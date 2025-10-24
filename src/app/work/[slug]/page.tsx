// src/app/work/[slug]/page.tsx

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getProjectBySlug } from '@/lib/projectData';

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProjectPage({
  params: { slug },
}: ProjectPageProps) {
  const { isEnabled } = await draftMode();

  const project = getProjectBySlug(slug);

  if (!project || (!project.published && !isEnabled)) {
    notFound();
  }

  return (
    <section className="w-full pt-20 pb-10">
      {isEnabled && (
        <div className="bg-pink-600 text-white text-center p-2 mb-8">
          Você está em **Modo de Preview**.{' '}
          <a href="/api/draft/disable" className="underline font-bold">
            Sair do Preview
          </a>
        </div>
      )}

      <header className="text-center mb-12  px-4 py-6 mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-gray-500">{project.date}</p>
        <p className="mt-4 text-xl text-left text-gray-800 mx-auto">
          {project.description}
        </p>

      </header>

      <div className="space-y-1 md:space-y-1">
        {project.muralSections.map((section, index) => (
          <div key={index}>
            {section.type === 'full' && (
              <div className="w-full aspect-[3/2] md:aspect-[4/2] relative overflow-hidden  ">
                <Image
                  src={section.imageUrl}
                  alt={section.alt}
                  fill
                  sizes="100vw"
                  className="object-cover cursor-zoom-in"
                />
              </div>
            )}
            {section.type === 'split' && (
              <div className="flex flex-col md:flex-row gap-1 md:gap-1">
                <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden ">
                  <Image
                    src={section.imagesUrl[0]}
                    alt={section.alts[0]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={section.imagesUrl[1]}
                    alt={section.alts[1]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
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
                    <Image
                      src={imageUrl}
                      alt={section.alts[i]}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {section.type === 'text' && (
              <div className=" px-3 py-8 md:py-8  ">
                <p className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap ">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
