export const SITE_NAME = 'Bibi Ilustra';
export const SITE_DESCRIPTION = 'Portfólio de ilustrações e design gráfico de Bibi';

const CATEGORY_LABELS: Record<string, string> = {
  design: 'Design',
  ilustracao: 'Ilustração',
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
