import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getProjectBySlug,
  updateProject,
  deleteProject,
  normalizeProjectSlug,
  type ProjectData,
} from '@/lib/projectData';
import { revalidatePath } from 'next/cache';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
    const normalizedSlug = normalizeProjectSlug(slug);
    const project = await getProjectBySlug(normalizedSlug);

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
    const normalizedSlug = normalizeProjectSlug(slug);
    const body = await request.json();
    const project: ProjectData = {
      ...body,
      slug: normalizeProjectSlug(String(body.slug ?? '')),
    };

    if (!project.slug || !SLUG_REGEX.test(project.slug)) {
      return NextResponse.json(
        { error: 'Slug inválido. Use apenas letras minúsculas, números e hífens.' },
        { status: 400 }
      );
    }

    await updateProject(normalizedSlug, project);

    revalidatePath('/');
    revalidatePath(`/work/${normalizedSlug}`);
    revalidatePath(`/work/${project.slug}`);

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Erro ao salvar projeto:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao salvar projeto' },
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
    const normalizedSlug = normalizeProjectSlug(slug);
    const deleted = await deleteProject(normalizedSlug);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    revalidatePath('/', 'page');
    revalidatePath(`/work/${normalizedSlug}`, 'page');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar projeto' },
      { status: 500 }
    );
  }
}
