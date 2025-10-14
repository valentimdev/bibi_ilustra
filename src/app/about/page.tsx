import React from 'react';

export default function About() {
  return (
    <div className="flex flex-col w-full h-full justify-center gap-16 border border-black">
      {/* Primeira seção - imagem 3/5 à esquerda, texto 2/5 à direita */}
      <div className="flex flex-col md:flex-row md:gap-12 max-w-7xl mx-auto">
        <div className="md:w-3/5 mb-8 md:mb-0">
          <div className="bg-gray-700 w-full h-64 md:h-full"></div>{' '}
          {/* Placeholder para a imagem */}
        </div>

        <div className="md:w-2/5">
          <h2 className="text-4xl font-bold text-pink-500 mb-4">SOBRE</h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>Oi, Sou Bianca Tavares!</p>
            <p>
              Minha trajetória profissional desde 2019 se baseia na fusão entre
              ilustração e design. Meu portfólio é altamente versátil,
              abrangendo os mercados editorial, de games, branding e
              audiovisual.
            </p>
            <p>
              No campo educacional, desenvolvi ilustrações didáticas para o
              público infantil até o científico universitário, além de criar
              capas e projetos gráficos para esse segmento. Minha experiência
              inclui o desenvolvimento de personagens e concept arts para jogos
              digitais, bem como a criação de gráficos e peças visuais para
              branding e edição de vídeo.
            </p>
            <p>
              Minha paixão é traduzir ideias complexas em projetos visuais
              envolventes e estrategicamente sólidos, sempre preservando a
              autenticidade e o brilho próprio de cada criação.
            </p>
            <p className="text-pink-500 font-bold">Vamos criar?</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-12 max-w-7xl mx-auto">
        {/* O texto (2/5) agora vem primeiro */}
        <div className="md:w-2/5 order-2 md:order-1">
          <h2 className="text-4xl font-bold text-pink-500 mb-4">PLACEHOLDER</h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>BLABLABLA</p>
            <p>oi tenho minhas artes num sei q lá</p>
            <p>sou especialista em blablbala</p>
            <p>
              Minha paixão é traduzir ideias complexas em projetos visuais
              envolventes e estrategicamente sólidos, sempre preservando a
              autenticidade e o brilho próprio de cada criação.
            </p>
            <p className="text-pink-500 font-bold">Vamos criar?</p>
          </div>
        </div>

        <div className="md:w-3/5 mb-8 md:mb-0 order-1 md:order-2 flex flex-col gap-5">
          <div className="bg-gray-700 w-full h-50 md:h-50%"></div>{' '}
          <div className="bg-gray-700 w-full h-50 md:h-50%"></div>{' '}
        </div>
      </div>

      {/* Terceira seção - Formação e Cursos */}
      <div className="max-w-7xl mx-auto w-full flex flex-col px-4 border border-black">
        <h2 className="text-4xl font-bold text-pink-500 mb-8 text-center">
          FORMAÇÃO
        </h2>
       {/* Container principal com as duas colunas */}
          <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row  gap-20 md:gap-40 ">
          
          {/* Coluna da Esquerda: Graduações */}
          <div className="flex flex-col w-full md:w-1/2 border-black">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Graduações{' '}
              <span className="text-lg font-normal text-gray-600">
                / Education
              </span>
            </h3>
            
            <div className="flex flex-col gap-6">
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-bold text-gray-800">UFC 2017-2022</h4>
                <p className="text-gray-700">Bacharelado em Design</p>
                <p className="text-gray-600 text-sm italic">Masters in Design</p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-bold text-gray-800">PUC-RS 2024 - 2025</h4>
                <p className="text-gray-700">
                  MBA em Gestão de Projetos em Metodologias Ágeis
                </p>
                <p className="text-gray-600 text-sm italic">
                  MBA in Project Management with Agile Methodologies
                </p>
              </div>
            </div>
          </div>
          {/* Coluna da Direita: Cursos */}
          <div className="flex flex-col w-full md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Cursos{' '}
              <span className="text-lg font-normal text-gray-600">
                / Courses
              </span>
            </h3>

            <div className="flex flex-col gap-6 border border-black">
              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2025 - Motion Boost</h4>
                <p className="text-gray-700">Motion Design com Paulo Ravel Felizardo</p>
                <p className="text-gray-600 text-sm italic">Introduction to Motion Design</p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2025 - Centro Vocacional Tecnológico de Fortaleza</h4>
                <p className="text-gray-700">Modelagem 3D para Jogos</p>
                <p className="text-gray-600 text-sm italic">3D Modeling for Games</p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2023 - Arte Revide</h4>
                <p className="text-gray-700">Pé na Porta, introdução ao mercado de ilustração</p>
                <p className="text-gray-600 text-sm italic">Pé na Porta: Introduction to the Illustration Market</p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2023 - Universidade Federal do Ceará</h4>
                <p className="text-gray-700">Oficina de Quadrinhos</p>
                <p className="text-gray-600 text-sm italic">One-Year Comics Workshop</p>
              </div>

              <div className="border-l-4 border-pink-300 pl-4">
                <h4 className="font-bold text-gray-800">2022 - EBAC</h4>
                <p className="text-gray-700">Concept Art</p>
                <p className="text-gray-600 text-sm italic">Introduction to Concept Art for Games</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
