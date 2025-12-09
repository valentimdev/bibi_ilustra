import ArtGallery from "@/components/ArtGallery";
import Header from "@/components/Header";
import Image from "next/image";
import { getAllProjects } from '@/lib/projectData';
export default async function Home() {
  const publishedProjects = await getAllProjects();
  return (
    <div className="w-full flex flex-col ">
      <ArtGallery projects={publishedProjects} />
    </div>
  );
}
