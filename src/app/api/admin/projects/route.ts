import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getAllProjectsIncludingDrafts,
  saveProject,
  type ProjectData,
} from '@/lib/projectData';

export async function GET() {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const projects = getAllProjectsIncludingDrafts();

    // Retornar apenas informações básicas para a lista
    const projectsList = projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      category: project.category,
      published: project.published,
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
    const project: ProjectData = body;

    // Gerar ID único se não fornecido
    if (!project.id) {
      project.id = Date.now().toString();
    }

    saveProject(project);

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar projeto' },
      { status: 500 }
    );
  }
}
