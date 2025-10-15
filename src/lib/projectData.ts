
import fs from 'fs';
import path from 'path';

type MuralSectionFull = {
  type: 'full';
  imageUrl: string;
  alt: string;
};


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


export type MuralSection = MuralSectionFull | MuralSectionSplit | MuralSectionTrio;

export type ProjectData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  published: boolean;
  muralSections: MuralSection[];
};




const projectsDirectory = path.join(process.cwd(), '_projects');


export function getProjectBySlug(slug: string): ProjectData | undefined {
  const fullPath = path.join(projectsDirectory, `${slug}.json`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const data: ProjectData = JSON.parse(fileContents);
    return data;
  } catch (error) {
    return undefined;
  }
}


export function getAllProjects(): ProjectData[] {
  const filenames = fs.readdirSync(projectsDirectory);

  const allProjects = filenames
    .map((filename) => {
      const slug = filename.replace(/\.json$/, '');
      return getProjectBySlug(slug);
    })
    .filter((project): project is ProjectData => project !== undefined)
    .filter((project) => project.published);

  return allProjects;
}