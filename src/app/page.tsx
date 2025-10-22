import ArtGallery from "@/components/ArtGallery";
import Header from "@/components/Header";
import Image from "next/image";
import { getAllProjects } from '@/lib/projectData';
export default function Home() {
  const publishedProjects = getAllProjects();
  return (
    <div className="w-full flex flex-col ">
      <ArtGallery projects={publishedProjects} />
    </div>
  );
}
