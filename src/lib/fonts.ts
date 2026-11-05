import { Fraunces } from 'next/font/google';

// Fraunces: serifa variável codesenhada pela carioca Flavia Zimbardi.
// SOFT arredonda as serifas; opsz ajusta o desenho ao tamanho.
export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

