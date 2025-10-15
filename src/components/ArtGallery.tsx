'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Artwork = {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
};

const artworks: Artwork[] = [
  {
    id: 1,
    title: 'Projeto 1',
    category: 'ilustracao',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 2,
    title: 'Projeto 2',
    category: 'ilustracao',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 3,
    title: 'Projeto 3',
    category: 'ilustracao',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 4,
    title: 'Projeto 4',
    category: 'ilustracao',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 5,
    title: 'Projeto 5',
    category: 'ilustracao',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 6,
    title: 'Projeto 6',
    category: 'ilustracao',
    imageUrl: '/placeholder.jpg',
  },

  {
    id: 7,
    title: 'Projeto 7',
    category: 'design',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 8,
    title: 'Projeto 8',
    category: 'design',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 9,
    title: 'Projeto 9',
    category: 'design',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 10,
    title: 'Projeto 10',
    category: 'design',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 11,
    title: 'Projeto 11',
    category: 'design',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 12,
    title: 'Projeto 12',
    category: 'design',
    imageUrl: '/placeholder.jpg',
  },
];

const ArtGallery: React.FC = () => {
  return (
    <main className="w-full h-full py-8">
      <div className="max-w-8xl mx-auto  h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black">ILUSTRAÇÃO</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {artworks
                .filter((art) => art.category === 'ilustracao')
                .map((art) => (
                  <Link href={`/work/${art.id}`} key={art.id}>
                    <div className="group relative block w-full aspect-square overflow-hidden cursor-pointer">
                      <Image
                        src={art.imageUrl}
                        alt={art.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="transition-transform duration-500 ease-in-out object-cover rounded-md"
                      />

                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-6 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            {art.title}
                          </h3>
                          <p className="text-gray-200 mt-1">{art.category}</p>
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
              {artworks
                .filter((art) => art.category === 'design')
                .map((art) => (
                  <Link href={`/work/${art.id}`} key={art.id}>
                    <div className="group relative block w-full aspect-square overflow-hidden cursor-pointer">
                      <Image
                        src={art.imageUrl}
                        alt={art.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="transition-transform duration-500 ease-in-out object-cover rounded-md"
                      />

                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-6 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                        <div>
                          <h3 className="text-white text-xl font-bold">
                            {art.title}
                          </h3>
                          <p className="text-gray-200 mt-1">{art.category}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArtGallery;
