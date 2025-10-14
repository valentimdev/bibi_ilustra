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
    title: 'Exploradora dos Mundos',
    category: 'Concept Art',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 2,
    title: 'Café & Magia',
    category: 'Ilustração',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 3,
    title: 'Identidade Visual - Astrodev',
    category: 'Branding',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 4,
    title: 'Guerreiro da Montanha',
    category: 'Concept Art',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 5,
    title: 'Noite Estrelada Revisitada',
    category: 'Ilustração',
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 6,
    title: 'Capa de Livro - O Último Dragão',
    category: 'Editorial',
    imageUrl: '/placeholder.jpg',
  },
];

// 3. DEFININDO O COMPONENTE COM REACT.FC (Functional Component)
// É uma boa prática para definir componentes em TypeScript.
const ArtGallery: React.FC = () => {
  return (
    <main className=" py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção */}
        <div className="text-center mb-12 text-black flex flex-row justify-center gap-10">
          <p>CONCEPT</p>
          <p>DESIGN</p>
          <p>TATU</p>
        </div>

        {/* Grid da Galeria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map(
            (
              art // O TypeScript já sabe que 'art' é do tipo Artwork aqui!
            ) => (
              <Link href={`/work/${art.id}`} key={art.id}>
                <div className="group relative block w-full h-96 overflow-hidden rounded-lg shadow-xl cursor-pointer">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Otimiza o carregamento
                    className="transition-transform duration-500 ease-in-out  object-cover"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                    <div>
                      <h3 className="text-white text-2xl font-bold">
                        {art.title}
                      </h3>
                      <p className="text-gray-200 mt-1">{art.category}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default ArtGallery;
