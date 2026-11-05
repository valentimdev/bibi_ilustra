import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getAllProjectsIncludingDrafts,
  saveProject,
  normalizeProjectSlug,
  SLUG_REGEX,
  type ProjectData,
} from '@/lib/projectData';
import { revalidatePath, revalidateTag } from 'next/cache';


export async function GET() {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const projects = await getAllProjectsIncludingDrafts();

    // Retornar apenas informações básicas para a lista
    const projectsList = projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      category: project.category,
      published: project.published,
      order: project.order ?? 0,
    }));

    return NextResponse.json(projectsList);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar projetos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
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

    // Gerar ID único se não fornecido
    if (!project.id) {
      project.id = Date.now().toString();
    }

    await saveProject(project);

    revalidatePath('/');
    revalidatePath(`/work/${project.slug}`);
    revalidateTag('projects');

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar projeto' },
      { status: 500 }
    );
  }
}
