// src/app/work/[slug]/page.tsx

import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getProjectBySlug, normalizeProjectSlug } from '@/lib/projectData';
import Link from 'next/link';

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

  const isVideo = (url: string) => {
    return (
      url.toLowerCase().endsWith('.mp4') ||
      url.toLowerCase().endsWith('.webm') ||
      url.toLowerCase().endsWith('.mov')
    );
  };

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
            <p className="mt-2 text-lg text-gray-500  ">{project.date}</p>
          </div>
        </div>
          
      
        
        <div className='border-yellow-500 flex px-20 '>
        <p className="mt-2 text-xl text-justify   text-gray-800 mx-auto ">
          {project.description}
        </p>
        </div>
      </header>

      <div className="space-y-1 md:space-y-1 mb-10 ">
        {project.muralSections.map((section, index) => (
          <div key={index}>
            {section.type === 'full' && (
              <div className="w-full flex justify-center border items-center border-amber-950">
                <div className="w-full flex justify-center border items-center px-20">
                  {isVideo(section.imageUrl) ? (
                    <video
                      src={section.imageUrl}
                      className="w-full h-auto cursor-zoom-in"
                      loop
                      playsInline
                      autoPlay
                      muted
                    />
                  ) : (
                    <Image
                      unoptimized
                      src={section.imageUrl}
                      alt={section.alt}
                      width={1400}
                      height={0}
                      sizes="(max-width: 1400px) 100vw, 1400px"
                      className="w-full h-auto cursor-zoom-in"
                      style={{ height: 'auto' }}
                    />
                  )}
                </div>
              </div>
            )}
            {section.type === 'split' && (
              <div className="flex flex-col md:flex-row gap-1 md:gap-1">
                <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden ">
                  <Image
                  unoptimized
                    src={section.imagesUrl[0]}
                    alt={section.alts[0]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden">
                  <Image
                  unoptimized
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
                    unoptimized
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
              <div className=" px-3 py-8 md:py-8   ">
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
