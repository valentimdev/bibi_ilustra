// src/lib/projectData.ts

import fs from 'fs';
import path from 'path';
import prisma from './db';

type MuralSectionFull = { type: 'full'; imageUrl: string; alt: string };
type MuralSectionSplit = {
  type: 'split';
  imagesUrl: [string, string];
  alts: [string, string];
};
type MuralSectionTrio = {
  type: 'trio';
  imagesUrl: [string, string, string];
  alts: [string, string, string];
};
type MuralSectionText = { type: 'text'; content: string };

export type MuralSection =
  | MuralSectionFull
  | MuralSectionSplit
  | MuralSectionTrio
  | MuralSectionText;

export type ProjectData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  published: boolean;
  category: string;
  order?: number;
  muralSections: MuralSection[];
};

export async function getProjectBySlug(
  slug: string
): Promise<ProjectData | undefined> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      return undefined;
    }

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      date: project.date,
      category: project.category,
      coverImage: project.coverImage,
      order: project.order,
      published: project.published,
      muralSections: project.muralSections as MuralSection[],
    };
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    return undefined;
  }
}

export async function getAllProjects(): Promise<ProjectData[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      date: project.date,
      category: project.category,
      coverImage: project.coverImage,
      published: project.published,
      muralSections: project.muralSections as MuralSection[],
    }));
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    return [];
  }
}

export async function getAllProjectsIncludingDrafts(): Promise<ProjectData[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      date: project.date,
      category: project.category,
      coverImage: project.coverImage,
      published: project.published,
      muralSections: project.muralSections as MuralSection[],
    }));
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    return [];
  }
}

export async function saveProject(project: ProjectData): Promise<void> {
  try {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        description: project.description,
        date: project.date,
        category: project.category,
        coverImage: project.coverImage,
        published: project.published,
        muralSections: project.muralSections as any,
      },
      create: {
        id: project.id || undefined,
        slug: project.slug,
        title: project.title,
        description: project.description,
        date: project.date,
        category: project.category,
        coverImage: project.coverImage,
        published: project.published,
        muralSections: project.muralSections as any,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar projeto:', error);
    throw error;
  }
}

export async function deleteProject(slug: string): Promise<boolean> {
  try {
    await prisma.project.delete({
      where: { slug },
    });
    return true;
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return false;
  }
}
