import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';
import prisma from './db';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'bibi-admin-session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 dias

export interface SessionData {
  adminId: number;
  username: string;
}

// Só o hash vai para o banco: se o banco vazar, os tokens continuam inúteis.
function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // Rejeita cookies no formato antigo ("1:bibi") sem nem consultar o banco.
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

    const session = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { admin: { select: { id: true, username: true } } },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return { adminId: session.admin.id, username: session.admin.username };
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return null;
  }
}

/**
 * Cria uma sessão após login bem-sucedido
 */
export async function createSession(adminId: number): Promise<void> {
  const token = randomBytes(32).toString('hex'); // 64 caracteres aleatórios
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

  await prisma.session.create({
    data: { tokenHash: hashToken(token), adminId, expiresAt },
  });

  // Aproveita para limpar sessões vencidas dessa admin.
  await prisma.session.deleteMany({
    where: { adminId, expiresAt: { lt: new Date() } },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/**
 * Remove a sessão (logout)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // Apaga do banco: mesmo que alguém tenha copiado o cookie, ele para de valer.
  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifica credenciais e retorna o admin se válido
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<{ id: number; username: string } | null> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      return null;
    }

    return {
      id: admin.id,
      username: admin.username,
    };
  } catch (error: any) {
    console.error('Erro ao verificar credenciais:', error);

    // Verificar se é erro de conexão com banco
    if (
      error?.code === 'EAI_AGAIN' ||
      error?.code === 'ENOTFOUND' ||
      error?.message?.includes('getaddrinfo')
    ) {
      throw new Error(
        'Erro de conexão com o banco de dados. Verifique se DATABASE_URL está configurada corretamente.'
      );
    }

    return null;
  }
}

/**
 * Verifica se o usuário está autenticado e retorna erro se não estiver
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    throw new Error('Não autenticado');
  }

  return session;
}
