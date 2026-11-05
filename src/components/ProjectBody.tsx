import ProjectMural from '@/components/ProjectMural';
import type { MuralSection } from '@/lib/projectData';

const CATEGORY_LABELS: Record<string, string> = {
  design: 'Design',
  ilustracao: 'Ilustração',
};

type ProjectBodyProps = {
  description: string;
  category: string;
  date: string;
  sections: MuralSection[];
};

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Descrição do projeto no formato "ficha + texto": ficha curta à esquerda
// (tipo e data), separada por uma linha, e o texto à direita. No celular, a
// ficha fica em cima do texto. Depois vem o mural.
export default function ProjectBody({
  description,
  category,
  date,
  sections,
}: ProjectBodyProps) {
  const facts = [
    { label: 'Tipo', value: CATEGORY_LABELS[category] ?? category },
    ...(date ? [{ label: 'Data', value: date }] : []),
  ];

  return (
    <>
      {description && (
        <div className="pt-4 pb-12 md:pt-12 md:pb-16">
          <div className="grid gap-6 text-left md:grid-cols-[13rem_1fr] md:gap-14">
            <dl className="flex gap-8 md:flex-col md:gap-5 md:border-r md:border-gray-300 md:pr-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-gray-500">{f.label}</dt>
                  <dd className="text-base font-semibold text-gray-900">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="max-w-5xl text-gray-800">
              {paragraphs(description).map((p, i) => (
                <p
                  key={i}
                  className={`${i ? 'mt-5' : ''} text-base md:text-xl leading-relaxed md:leading-[1.65]`}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <ProjectMural sections={sections} />
    </>
  );
}
