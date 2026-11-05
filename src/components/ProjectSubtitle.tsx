import { categoryLabel } from '@/lib/site';

// Subtítulo do projeto: data e tipo de trabalho, separados por uma barra.
export default function ProjectSubtitle({
  date,
  category,
  className,
}: {
  date: string;
  category: string;
  className?: string;
}) {
  const label = category ? categoryLabel(category) : '';
  if (!date && !label) return null;

  return (
    <p className={className}>
      {date}
      {date && label && (
        <span aria-hidden="true" className="mx-2.5 opacity-60">
          /
        </span>
      )}
      {label}
    </p>
  );
}
