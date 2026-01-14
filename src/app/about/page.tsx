import Image from 'next/image';
import React from 'react';

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-screen py-8 gap-16">
      <div className="flex flex-row gap-8 px-8 py-8 max-w-7xl mx-auto w-full ">
      <div className="relative w-[48%] flex-shrink-0 min-h-[600px] border">
          <Image
           unoptimized
            src="/images/bibi_foto.png"
            alt="Foto de Bianca Tavares"
            fill
            className="object-contain"
          />
        </div>
        

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Hi, I'm{' '}
            <span className="text-[var(--primary)]">Bianca Tavares</span>!
          </h2>

          <p className="font-semibold text-lg leading-relaxed mb-6 text-gray-800">
            Blending{' '}
            <span className="text-[var(--secondary)]">illustration</span> and{' '}
            <span className="text-[var(--secondary)]">design</span> in the
            professional market since 2019. My work is versatile, moving across
            editorial, gaming, branding, and audiovisual content.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            I've delivered didactic illustrations, from children's materials to
            complex scientific university content, alongside developing the
            covers and graphic projects for those segments. My expertise also
            includes creating characters and concept art for digital games, as
            well as designing graphics and visuals for branding and video
            editing.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            My passion is translating complex ideas into engaging and
            strategically sound visual projects, always preserving the unique
            authenticity and spark of each creation.
          </p>

          <p className="text-[#EC2677] text-2xl font-bold">Let's create?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col   px-10  mb-17">
        <div className="flex flex-col md:flex-row gap-16 md:gap-20 ">
          <div className="flex flex-col w-full md:w-1/2 ">
            <h3 className="text-2xl font-extrabold text-[#12487F] mb-6">
              Graduações{' '}
              <span className="text-lg font-normal text-[#4B83C3]">
                / Education
              </span>
            </h3>

            <div className="flex flex-col gap-6">
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-bold text-gray-800">UFC 2017-2022</h4>
                <p className="text-gray-600">Bacharelado em Design</p>
                <p className="text-gray-500 text-sm italic">
                  Masters in Design
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-bold text-gray-800">PUC-RS 2024 - 2025</h4>
                <p className="text-gray-600">
                  MBA em Gestão de Projetos em Metodologias Ágeis
                </p>
                <p className="text-gray-500 text-sm italic">
                  MBA in Project Management with Agile Methodologies
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <h3 className="text-2xl font-bold text-[#12487F] mb-6">
              Cursos{' '}
              <span className="text-lg font-normal text-[#4B83C3]">
                / Courses
              </span>
            </h3>

            <div className="flex flex-col gap-6 ">
              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2025 - Motion Boost</h4>
                <p className="text-gray-600">
                  Motion Design com Paulo Ravel Felizardo
                </p>
                <p className="text-gray-500 text-sm italic">
                  Introduction to Motion Design
                </p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">
                  2025 - Centro Vocacional Tecnológico de Fortaleza
                </h4>
                <p className="text-gray-600">Modelagem 3D para Jogos</p>
                <p className="text-gray-500 text-sm italic">
                  3D Modeling for Games
                </p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2023 - Arte Revide</h4>
                <p className="text-gray-600">
                  Pé na Porta, introdução ao mercado de ilustração
                </p>
                <p className="text-gray-500 text-sm italic">
                  Pé na Porta: Introduction to the Illustration Market
                </p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">
                  2023 - Universidade Federal do Ceará
                </h4>
                <p className="text-gray-600">Oficina de Quadrinhos</p>
                <p className="text-gray-500 text-sm italic">
                  One-Year Comics Workshop
                </p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2022 - EBAC</h4>
                <p className="text-gray-600">Concept Art</p>
                <p className="text-gray-500 text-sm italic">
                  Introduction to Concept Art for Games
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
