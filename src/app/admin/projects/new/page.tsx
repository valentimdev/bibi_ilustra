'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import type { ProjectData, MuralSection } from '@/lib/projectData';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialProject: ProjectData = {
    id: '',
    slug: '',
    title: '',
    description: '',
    date: '',
    category: 'design',
    coverImage: '',
    published: false,
    muralSections: [],
  };

  const handleSave = async (project: ProjectData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar projeto');
      }

      router.push('/admin');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Novo Projeto</h1>
        </div>
        <ProjectForm
          project={initialProject}
          onSave={handleSave}
          loading={loading}
        />
      </div>
    </div>
  );
}
