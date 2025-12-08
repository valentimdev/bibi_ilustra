import { cookies } from 'next/headers';
import prisma from './db';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'bibi-admin-session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 dias

export interface SessionData {
  adminId: number;
  username: string;
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const [adminId, username] = sessionCookie.value.split(':');

    if (!adminId || !username) {
      return null;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!admin || admin.username !== username) {
      return null;
    }

    return {
      adminId: parseInt(adminId),
      username,
    };
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return null;
  }
}

/**
 * Cria uma sessão após login bem-sucedido
 */
export async function createSession(
  adminId: number,
  username: string
): Promise<void> {
  const cookieStore = await cookies();
  const sessionValue = `${adminId}:${username}`;

  cookieStore.set(SESSION_COOKIE_NAME, sessionValue, {
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
