import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getProjectBySlug,
  saveProject,
  deleteProject,
  type ProjectData,
} from '@/lib/projectData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar projeto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const project: ProjectData = body;

    // Validar que o slug do projeto corresponde
    if (project.slug !== slug) {
      return NextResponse.json(
        { error: 'Slug do projeto não corresponde' },
        { status: 400 }
      );
    }

    await saveProject(project);

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Erro ao salvar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar projeto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const deleted = await deleteProject(slug);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar projeto' },
      { status: 500 }
    );
  }
}
