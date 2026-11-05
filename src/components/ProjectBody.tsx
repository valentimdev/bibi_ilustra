import ProjectMural from '@/components/ProjectMural';
import { fraunces } from '@/lib/fonts';
import type { MuralSection } from '@/lib/projectData';

type ProjectBodyProps = {
  description: string;
  sections: MuralSection[];
};

// Fraunces com serifas suavizadas (SOFT), peso leve para texto claro no escuro.
const SERIF = {
  fontFamily: 'var(--font-fraunces), Georgia, serif',
  fontVariationSettings: '"SOFT" 40',
  fontWeight: 350,
} as const;

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Descrição do projeto.
// - Computador: texto branco sobre o degradê da capa, no canto inferior
//   direito, ao lado do título. O bloco tem altura zero e o texto é ancorado
//   pela base na borda inferior da capa, crescendo para cima (nunca vaza).
// - Celular: abaixo do título, em texto escuro.
// Depois vem o mural.
export default function ProjectBody({ description, sections }: ProjectBodyProps) {
  return (
    <div className={fraunces.variable}>
      {description ? (
        <>
          <div className="relative z-10 px-4 pt-2 pb-12 md:p-0 md:h-0">
            <div className="[text-wrap:pretty] md:absolute md:right-0 md:bottom-10 md:max-w-[30em]">
              {paragraphs(description).map((p, i) => (
                <p
                  key={i}
                  className={`${i ? 'mt-4' : ''} text-[1.05rem] leading-[1.5] text-gray-800 md:text-white md:[text-shadow:0_1px_8px_rgba(0,0,0,0.5)]`}
                  style={SERIF}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          {/* Espaçador: uma margem num bloco de altura zero "vazaria" para cima. */}
          <div className="hidden md:block h-14" />
        </>
      ) : (
        <div className="pt-4 md:pt-10" />
      )}

      <ProjectMural sections={sections} />
    </div>
  );
}
