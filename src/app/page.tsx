import ArtGallery from "@/components/ArtGallery";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col">
      <ArtGallery/>
    </div>
  );
}
