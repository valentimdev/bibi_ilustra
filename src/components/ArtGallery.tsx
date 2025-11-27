'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectData } from '@/lib/projectData';

type ArtGalleryProps = {
  projects: ProjectData[];
};

const ArtGallery: React.FC<ArtGalleryProps> = ({ projects }) => {
  const [exibition, setExibition] = React.useState<string>('design');

  const handleToggleCategory = (value: string) => {
    setExibition(value);
  };

  return (
    <section className="w-full h-full py-10 pb-24">
      <div className="max-w-8xl mx-auto  h-full flex flex-col ">
        <div className="grid grid-cols-1 flex-1 transition-all duration-300">
          {exibition === 'ilustracao' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

          {exibition === 'design' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {projects
                .filter((project: ProjectData) => project.category === 'design')
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

      {/* Botão fixo na parte inferior */}
      <div className="sticky bottom-0 left-0 right-0 flex justify-center pb-4 z-50 pt-10">
        <div className="relative inline-flex rounded-full border-2 border-[var(--primary)] overflow-hidden bg-[var(--primary)]">
          <button
            onClick={() => handleToggleCategory('design')}
            className={`px-6 py-2 text-xl font-extrabold uppercase select-none transition-all duration-300 ease-in-out ${
              exibition === 'design'
              ? 'font-extrabold bg-[var(--secondary)] text-white rounded-full scale-105 shadow-xl transition-all duration-300' 
              : 'bg-transparent font-extrabold text-white cursor-pointer'
            }`}
          >
            DESIGN
          </button>
          <button
            onClick={() => handleToggleCategory('ilustracao')}
            className={`px-6 py-2 text-xl font-extrabold uppercase select-none transition-all duration-300 ease-in-out ${
              exibition === 'ilustracao'
              ? 'bg-[var(--secondary)] text-white rounded-full scale-105 shadow-xl transition-all duration-300' 
              : 'bg-transparent text-white font-extrabold cursor-pointer'
            }`}
          >
            ILLUSTRATION
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArtGallery;
