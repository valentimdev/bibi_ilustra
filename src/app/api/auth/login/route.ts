import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';
import {
  clearLoginFailures,
  getClientIp,
  getLoginRetryAfter,
  recordLoginFailure,
} from '@/lib/loginThrottle';

const MAX_FIELD_LENGTH = 200;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username ||
      !password
    ) {
      return NextResponse.json(
        { error: 'Username e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (username.length > MAX_FIELD_LENGTH || password.length > MAX_FIELD_LENGTH) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const ip = getClientIp(request.headers);

    // Checa o limite antes do bcrypt, para que tentativas bloqueadas saiam baratas.
    const retryAfter = await getLoginRetryAfter(ip, username);
    if (retryAfter !== null) {
      const minutes = Math.ceil(retryAfter / 60);
      return NextResponse.json(
        {
          error: `Muitas tentativas de login. Tente de novo em ${minutes} minuto${minutes > 1 ? 's' : ''}.`,
        },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const admin = await verifyCredentials(username, password);

    if (!admin) {
      await recordLoginFailure(ip, username);
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    await clearLoginFailures(ip, username);
    await createSession(admin.id);

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}
