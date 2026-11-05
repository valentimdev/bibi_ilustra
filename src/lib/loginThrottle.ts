import prisma from './db';

// Limites de tentativas de login que falharam, numa janela deslizante.
// Ficam no Postgres porque, na Vercel, a memória de cada função não é
// compartilhada nem dura entre invocações.
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_FAILURES_PER_USER = 5;
const MAX_FAILURES_PER_IP = 10;
const RETENTION_MS = 24 * 60 * 60 * 1000; // apaga registros com mais de 1 dia

export function getClientIp(headers: Headers): string {
  // Na Vercel, x-forwarded-for é definido pela plataforma (o valor enviado
  // pelo cliente é sobrescrito). O primeiro IP da lista é o do visitante.
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || headers.get('x-real-ip') || 'unknown';
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

/**
 * Retorna quantos segundos faltam para poder tentar de novo,
 * ou null se o login está liberado.
 */
export async function getLoginRetryAfter(
  ip: string,
  username: string
): Promise<number | null> {
  const since = new Date(Date.now() - WINDOW_MS);
  const user = normalizeUsername(username);

  const [userFailures, ipFailures] = await Promise.all([
    prisma.loginAttempt.findMany({
      where: { username: user, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: MAX_FAILURES_PER_USER,
      select: { createdAt: true },
    }),
    prisma.loginAttempt.findMany({
      where: { ip, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: MAX_FAILURES_PER_IP,
      select: { createdAt: true },
    }),
  ]);

  // O bloqueio dura até a falha mais antiga das N últimas sair da janela.
  const retryAfter = (failures: { createdAt: Date }[], max: number) => {
    if (failures.length < max) return 0;
    const oldest = failures[failures.length - 1].createdAt.getTime();
    return Math.ceil((oldest + WINDOW_MS - Date.now()) / 1000);
  };

  const seconds = Math.max(
    retryAfter(userFailures, MAX_FAILURES_PER_USER),
    retryAfter(ipFailures, MAX_FAILURES_PER_IP)
  );
  return seconds > 0 ? seconds : null;
}

export async function recordLoginFailure(
  ip: string,
  username: string
): Promise<void> {
  await prisma.loginAttempt.create({
    data: { ip, username: normalizeUsername(username) },
  });

  // Limpeza oportunista dos registros antigos.
  await prisma.loginAttempt
    .deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } },
    })
    .catch(() => {});
}

export async function clearLoginFailures(
  ip: string,
  username: string
): Promise<void> {
  await prisma.loginAttempt
    .deleteMany({
      where: { OR: [{ username: normalizeUsername(username) }, { ip }] },
    })
    .catch(() => {});
}
