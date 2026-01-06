import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Configurações ---
const RATE_LIMIT_REQUESTS = 5; // Máximo de requisições
const RATE_LIMIT_WINDOW = 3600; // Janela de tempo em segundos (1 hora)
const MAX_MESSAGE_LENGTH = 1500;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;

// Armazenamento em memória para Rate Limit (Nota: reinicia quando o serverless "dorme")
const requestLog = new Map<string, number[]>();

// --- Helpers ---

// 1. Função para limpar HTML malicioso (Sanitização)
function escapeHtml(text: string): string {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 2. Função de Rate Limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW * 1000;
  
  if (!requestLog.has(ip)) {
    requestLog.set(ip, [now]);
    return true;
  }
  
  const timestamps = requestLog.get(ip)!.filter(t => t > windowStart);
  
  if (timestamps.length >= RATE_LIMIT_REQUESTS) {
    return false;
  }
  
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return true;
}

// 3. Validação Básica
function validateInput(name: string, email: string, message: string): string | null {
  if (!name || name.trim().length === 0) return 'Nome é obrigatório';
  if (name.length > MAX_NAME_LENGTH) return `Nome muito longo (máx ${MAX_NAME_LENGTH})`;

  if (!email || email.trim().length === 0) return 'Email é obrigatório';
  if (email.length > MAX_EMAIL_LENGTH) return 'Email muito longo';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email inválido';

  if (!message || message.trim().length === 0) return 'Mensagem é obrigatória';
  if (message.length > MAX_MESSAGE_LENGTH) return `Mensagem muito longa (máx ${MAX_MESSAGE_LENGTH})`;

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar Rate Limit pelo IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Por favor, aguarde um pouco.' },
        { status: 429 }
      );
    }

    // 2. Ler dados (incluindo o campo armadilha 'gotcha')
    const { name, email, message, gotcha } = await request.json();

    // 3. Verificação Honeypot (Anti-Robô)
    // Se o campo 'gotcha' vier preenchido, é um robô. Retornamos sucesso falso.
    if (gotcha) {
      console.log(`Bot bloqueado. IP: ${ip}`);
      // Retorna 200 para enganar o bot e ele não tentar de novo
      return NextResponse.json({ success: true }, { status: 200 }); 
    }

    // 4. Validar Entradas
    const validationError = validateInput(name, email, message);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // 5. Sanitizar (Limpar) os dados antes de enviar
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: 'biancatavaresilustra@gmail.com',
      replyTo: email, 
      subject: `Nova mensagem de: ${safeName}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Nova mensagem do bibi ilustra :P</h2>
          <p><strong>De:</strong> ${safeName} (${email})</p>
          <hr />
          <p><strong>Mensagem:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro Resend:', error);
      return NextResponse.json({ error: 'Erro ao enviar email.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error('Erro servidor:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}