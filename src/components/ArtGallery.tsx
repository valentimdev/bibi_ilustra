'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projectData';
import type { ProjectData } from '@/lib/projectData';

type ArtGalleryProps = {
  projects: ProjectData[];
};

const ArtGallery: React.FC<ArtGalleryProps> = ({ projects }) => {
  return (
    <section className="w-full h-full py-8">
      <div className="max-w-8xl mx-auto  h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black">ILUSTRAÇÃO</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {projects
                .filter((project: ProjectData) => project.category === 'ilustracao')
                .map((project: ProjectData) => (
                  <Link href={`/work/${project.slug}`} key={project.id}>
                    <div className="group relative block w-full aspect-square overflow-hidden cursor-pointer">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="transition-transform duration-500 ease-in-out object-cover rounded-md"
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
          </div>

          {/* Coluna DESIGN */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black">DESIGN</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                        className="transition-transform duration-500 ease-in-out object-cover rounded-md"
                      />

                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-6 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            {project.title}
                          </h3>
                          <p className="text-gray-200 mt-1">{project.category}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtGallery;
