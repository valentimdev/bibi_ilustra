// src/lib/projectData.ts

import fs from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
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

export function normalizeProjectSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

// Sem try/catch de propósito: se o banco falhar, o erro sobe e o Next não
// guarda em cache uma página vazia ou um 404 falso.
export async function getProjectBySlug(
  slug: string
): Promise<ProjectData | undefined> {
  const normalizedSlug = normalizeProjectSlug(slug);
  const project = await prisma.project.findUnique({
    where: { slug: normalizedSlug },
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
}

export async function getAllProjects(): Promise<ProjectData[]> {
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
    order: project.order,
    published: project.published,
    muralSections: project.muralSections as MuralSection[],
  }));
}

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_SLUG_LENGTH = 100;

export function isValidSlug(slug: string): boolean {
  return slug.length <= MAX_SLUG_LENGTH && SLUG_REGEX.test(slug);
}

// Também sem try/catch: uma lista vazia por erro faria todo projeto dar 404.
export async function getPublishedSlugs(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((project) => project.slug);
}

// Invalidada por revalidateTag('projects') nas rotas do admin.
export const getCachedPublishedSlugs = unstable_cache(
  getPublishedSlugs,
  ['published-slugs'],
  { tags: ['projects'] }
);

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
      order: project.order,
      muralSections: project.muralSections as MuralSection[],
    }));
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    return [];
  }
}

export async function saveProject(project: ProjectData): Promise<void> {
  const normalizedSlug = normalizeProjectSlug(project.slug);
  const orderValue = project.order !== undefined ? Number(project.order) : 0;
  try {
    await prisma.project.upsert({
      where: { slug: normalizedSlug },
      update: {
        title: project.title,
        description: project.description,
        date: project.date,
        category: project.category,
        coverImage: project.coverImage,
        published: project.published,
        order: orderValue,
        muralSections: project.muralSections as any,
      },
      create: {
        id: project.id || undefined,
        slug: normalizedSlug,
        title: project.title,
        description: project.description,
        date: project.date,
        category: project.category,
        coverImage: project.coverImage,
        published: project.published,
        order: orderValue,
        muralSections: project.muralSections as any,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar projeto:', error);
    throw error;
  }
}

export async function updateProject(
  currentSlug: string,
  project: ProjectData
): Promise<void> {
  const normalizedCurrentSlug = normalizeProjectSlug(currentSlug);
  const normalizedSlug = normalizeProjectSlug(project.slug);
  const orderValue = project.order !== undefined ? Number(project.order) : 0;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { slug: normalizedCurrentSlug },
      select: { id: true },
    });

    if (!existingProject) {
      throw new Error('Projeto não encontrado');
    }

    await prisma.project.update({
      where: { id: existingProject.id },
      data: {
        slug: normalizedSlug,
        title: project.title,
        description: project.description,
        date: project.date,
        category: project.category,
        coverImage: project.coverImage,
        published: project.published,
        order: orderValue,
        muralSections: project.muralSections as any,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

export async function deleteProject(slug: string): Promise<boolean> {
  try {
    const normalizedSlug = normalizeProjectSlug(slug);
    await prisma.project.delete({
      where: { slug: normalizedSlug },
    });
    return true;
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return false;
  }
}
