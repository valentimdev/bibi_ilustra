import { del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {

    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL do arquivo não fornecida' },
        { status: 400 }
      );
    }

    await del(url);

    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar o arquivo' },
      { status: 500 }
    );
  }
}
