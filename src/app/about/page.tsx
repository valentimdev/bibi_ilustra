import React from 'react';

export default function About() {
  return (
    <div className="flex w-full h-full justify-center ">


      <div className="flex flex-col md:flex-row md:gap-12 max-w-7xl mx-auto border border-b-blue-500">
        

        <div className="md:w-3/5 mb-8 md:mb-0 border border-black">
          <div className="bg-gray-700 w-full h-64 md:h-full"></div> {/* Placeholder para a imagem */}
        </div>

        <div className="md:w-2/5 border border-b-emerald-400">
          <h2 className="text-4xl font-bold text-pink-500 mb-4">
            SOBRE
          </h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>Oi, Sou Bianca Tavares!</p> 
            <p>Minha trajetória profissional desde 2019 se baseia na fusão entre ilustração e design. Meu portfólio é altamente versátil, abrangendo os mercados editorial, de games, branding e audiovisual.</p> 
            <p>No campo educacional, desenvolvi ilustrações didáticas para o público infantil até o científico universitário, além de criar capas e projetos gráficos para esse segmento. Minha experiência inclui o desenvolvimento de personagens e concept arts para jogos digitais, bem como a criação de gráficos e peças visuais para branding e edição de vídeo.</p>
            <p>Minha paixão é traduzir ideias complexas em projetos visuais envolventes e estrategicamente sólidos, sempre preservando a autenticidade e o brilho próprio de cada criação.</p>
            <p>Vamos criar?</p>
          </div>
        </div>

      </div>
    </div>
  );
}