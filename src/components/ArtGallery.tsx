'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectData } from '@/lib/projectData';

type ArtGalleryProps = {
  projects: ProjectData[];
};

const ArtGallery: React.FC<ArtGalleryProps> = ({ projects }) => {
  const [exibition, setExibition] = React.useState<string>('');

  const handleToggleCategory = (value: string) => {
    setExibition((exibition) => (exibition === value ? '' : value));
  };

  return (
    <section className="w-full h-full py-10">
      <div className="max-w-8xl mx-auto  h-full flex flex-col ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="text-center mb-6 cursor-pointer w-fit mx-auto">
            <h2
            onClick={() => handleToggleCategory('ilustracao')}
              className={`  text-2xl font-extrabold select-none hover:text-[var(--primary)] transition-all duration-400 ease-in-out ${
                exibition === 'ilustracao'
                  ? 'text-[var(--primary)]'
                  : 'text-[#12487F]'
              }`}
            >
              {' '}
              ILLUSTRATION
            </h2>
          </div>
          <div className="text-center mb-6 cursor-pointer w-fit mx-auto">
            <h2
            onClick={() => handleToggleCategory('design')}
              className={`  text-2xl font-extrabold select-none hover:text-[var(--primary)] transition-all duration-400 ease-in-out ${
                exibition === 'design'
                  ? 'text-[var(--primary)]'
                  : 'text-[#12487F]'
              }`}
            >
              {' '}
              DESIGN
            </h2>
          </div>
        </div>
        <div
          className={`grid grid-cols-1 ${
            exibition === '' ? 'lg:grid-cols-2 gap-2' : 'gap-0'
          } flex-1 transition-all duration-300`}
        >
          <div>
            {(exibition === 'ilustracao' || exibition === '') && (
              <div
                className={`grid ${
                  exibition === ''
                    ? 'grid-cols-2'
                    : 'grid-cols-2 md:grid-cols-3'
                } gap-2`}
              >
                {projects
                  .filter(
                    (project: ProjectData) => project.category === 'ilustracao'
                  )
                  .map((project: ProjectData) => (
                    <Link href={`/work/${project.slug}`} key={project.id}>
                      <div className="group relative block w-full aspect-square overflow-hidden cursor-pointer">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="transition-transform duration-500 ease-in-out object-cover"
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-6 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                          <div>
                            <h3 className="text-white text-xl font-bold">
                              {project.title}
                            </h3>
                            <p className="text-gray-200 mt-1">
                              {project.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          {/* Coluna DESIGN */}
          <div>
            {(exibition === 'design' || exibition === '') && (
              <div
                className={`grid ${
                  exibition === ''
                    ? 'grid-cols-2'
                    : 'grid-cols-2 md:grid-cols-3'
                } gap-2 `}
              >
                {projects
                  .filter(
                    (project: ProjectData) => project.category === 'design'
                  )
                  .map((project: ProjectData) => (
                    <Link href={`/work/${project.slug}`} key={project.id}>
                      <div className="group relative block w-full aspect-square overflow-hidden cursor-pointer">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="transition-transform duration-500 ease-in-out object-cover"
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-6 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                          <div>
                            <h3 className="text-white text-xl font-bold">
                              {project.title}
                            </h3>
                            <p className="text-gray-200 mt-1">
                              {project.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtGallery;
