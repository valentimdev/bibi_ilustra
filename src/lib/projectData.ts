// src/lib/projectData.ts

import fs from 'fs';
import path from 'path';

// --- DEFINIÇÃO DOS TIPOS (O "CONTRATO") ---
// Estes tipos garantem que todos os nossos dados tenham o mesmo formato.

type MuralSectionFull = { type: 'full'; imageUrl: string; alt: string; };
type MuralSectionSplit = { type: 'split'; imagesUrl: [string, string]; alts: [string, string]; };
type MuralSectionTrio = { type: 'trio'; imagesUrl: [string, string, string]; alts: [string, string, string]; };

export type MuralSection = MuralSectionFull | MuralSectionSplit | MuralSectionTrio;

export type ProjectData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  published: boolean;
  category: string;
  muralSections: MuralSection[];
};

// --- FUNÇÕES DE LEITURA (AS "FERRAMENTAS") ---
// Este código só roda no servidor.

const projectsDirectory = path.join(process.cwd(), '_projects');

export function getProjectBySlug(slug: string): ProjectData | undefined {
  const fullPath = path.join(projectsDirectory, `${slug}.json`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return undefined;
  }
}

export function getAllProjects(): ProjectData[] {
  const filenames = fs.readdirSync(projectsDirectory);

  return filenames
    .map(filename => getProjectBySlug(filename.replace(/\.json$/, '')))
    .filter((project): project is ProjectData => project !== undefined)
    .filter(project => project.published);
}